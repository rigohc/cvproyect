import React, { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "../icons/WhatsAppIcon";
import { contactFormValidator } from "../../lib/contact/ContactFormValidator";
import { turnstileSiteKey, web3FormsAccessKey } from "../../lib/contact/contactFormConfig";
import { TurnstileWidgetManager } from "../../lib/contact/TurnstileWidgetManager";
import { submitToWeb3Forms } from "../../lib/contact/web3formsClient";
import "./ContactForm.css";

interface ContactFormProps {
  email: string;
  whatsappUrl: string;
  location: string;
}

type FormStatus = "idle" | "sending" | "success" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const turnstileManager = new TurnstileWidgetManager();

export default function ContactForm({ email, whatsappUrl, location }: ContactFormProps) {
  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const loadedAt = useRef(Date.now());
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) return;

    return turnstileManager.mount(
      turnstileRef.current,
      turnstileSiteKey,
      setTurnstileToken,
      () => setTurnstileToken(""),
    );
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");

    const payload = {
      name,
      email: fromEmail,
      message,
      honeypot,
      loadedAt: loadedAt.current,
      turnstileRequired: Boolean(turnstileSiteKey),
      turnstileToken,
    };

    const errors = contactFormValidator.validate(payload);
    const firstError = contactFormValidator.firstError(errors);
    if (firstError) {
      setErrorMsg(firstError);
      setStatus("error");
      return;
    }

    const clean = contactFormValidator.toCleanPayload(payload);
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...clean,
          website: honeypot,
          loadedAt: loadedAt.current,
          turnstileToken,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "No se pudo validar el mensaje.");
      }

      await submitToWeb3Forms(web3FormsAccessKey, clean);

      setStatus("success");
      setName("");
      setFromEmail("");
      setMessage("");
      turnstileManager.reset(() => setTurnstileToken(""));
      loadedAt.current = Date.now();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar.");
      turnstileManager.reset(() => setTurnstileToken(""));
    }
  };

  return (
    <div className="contact-block">
      <div className="contact-channels">
        <a className="whatsapp-btn" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <span className="whatsapp-btn-icon" aria-hidden="true">
            <WhatsAppIcon size={22} />
          </span>
          <span className="whatsapp-btn-text">
            <strong>Escríbeme por WhatsApp</strong>
            <small>Canal preferido · sin llamadas</small>
          </span>
        </a>
        <a className="contact-email-link" href={`mailto:${email}`}>
          {email}
        </a>
        <span className="contact-location">{location}</span>
      </div>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <p className="contact-form-note">
          Formulario oficial de este sitio. No pedimos contraseñas, pagos ni datos bancarios.
        </p>

        <div className="contact-form-grid">
          <label>
            <span>Nombre</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={status === "sending"}
            />
          </label>
          <label>
            <span>Tu correo</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              maxLength={120}
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              required
              disabled={status === "sending"}
            />
          </label>
        </div>

        <label>
          <span>Mensaje</span>
          <textarea
            name="message"
            rows={5}
            maxLength={2000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Cuéntame sobre el rol, proyecto o consulta…"
            required
            disabled={status === "sending"}
          />
        </label>

        <label className="contact-honeypot" aria-hidden="true" tabIndex={-1}>
          <span>No llenar</span>
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>

        {turnstileSiteKey ? <div ref={turnstileRef} className="contact-turnstile" /> : null}

        <div className="contact-form-actions">
          <button type="submit" className="cta-link contact-submit" disabled={status === "sending"}>
            {status === "sending" ? "Enviando…" : "Enviar mensaje →"}
          </button>
        </div>

        {status === "success" ? (
          <p className="contact-feedback contact-feedback--ok" role="status">
            Mensaje enviado. Te responderé pronto por correo o WhatsApp.
          </p>
        ) : null}
        {status === "error" && errorMsg ? (
          <p className="contact-feedback contact-feedback--err" role="alert">
            {errorMsg}
          </p>
        ) : null}
      </form>
    </div>
  );
}
