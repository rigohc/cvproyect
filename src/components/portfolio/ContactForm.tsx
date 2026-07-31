import React, { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "../icons/WhatsAppIcon";

interface ContactFormProps {
  email: string;
  whatsappUrl: string;
  location: string;
}

type FormStatus = "idle" | "sending" | "success" | "error";

const MIN_SUBMIT_MS = 4000;
const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 2000;

const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

function sanitize(value: string): string {
  return value.replace(/[<>\u0000-\u001F]/g, "").trim();
}

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
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = renderWidget;
    document.head.appendChild(script);

    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  const resetTurnstile = () => {
    if (widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      setTurnstileToken("");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");

    if (honeypot) return;

    const elapsed = Date.now() - loadedAt.current;
    if (elapsed < MIN_SUBMIT_MS) {
      setErrorMsg("Espera un momento antes de enviar.");
      setStatus("error");
      return;
    }

    const cleanName = sanitize(name);
    const cleanEmail = sanitize(fromEmail);
    const cleanMessage = sanitize(message);

    if (!cleanName || cleanName.length > MAX_NAME) {
      setErrorMsg("Indica un nombre válido.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > MAX_EMAIL) {
      setErrorMsg("Indica un correo válido.");
      setStatus("error");
      return;
    }
    if (cleanMessage.length < 20 || cleanMessage.length > MAX_MESSAGE) {
      setErrorMsg("El mensaje debe tener entre 20 y 2000 caracteres.");
      setStatus("error");
      return;
    }

    if (turnstileSiteKey && !turnstileToken) {
      setErrorMsg("Completa la verificación anti-bots.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          message: cleanMessage,
          website: honeypot,
          loadedAt: loadedAt.current,
          turnstileToken,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "No se pudo enviar el mensaje.");
      }

      setStatus("success");
      setName("");
      setFromEmail("");
      setMessage("");
      resetTurnstile();
      loadedAt.current = Date.now();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar.");
      resetTurnstile();
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
              maxLength={MAX_NAME}
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
              maxLength={MAX_EMAIL}
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
            maxLength={MAX_MESSAGE}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Cuéntame sobre el rol, proyecto o consulta…"
            required
            disabled={status === "sending"}
          />
        </label>

        {/* Honeypot — oculto para bots, no para lectores de pantalla legítimos */}
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

      <style>{`
        .contact-block {
          display: grid;
          gap: 28px;
        }
        .contact-channels {
          display: grid;
          gap: 12px;
        }
        .whatsapp-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border: 1px solid color-mix(in srgb, #25d366 40%, var(--line));
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(37, 211, 102, 0.12), var(--bg-card));
          color: var(--text);
          transition: border-color 160ms ease, transform 160ms ease;
        }
        .whatsapp-btn:hover {
          border-color: #25d366;
          transform: translateY(-1px);
        }
        .whatsapp-btn-icon {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border-radius: 50%;
          background: #25d366;
          color: white;
          flex-shrink: 0;
        }
        .whatsapp-btn-text {
          display: grid;
          gap: 2px;
          text-align: left;
        }
        .whatsapp-btn-text strong {
          font-family: var(--font-display);
          font-size: 15px;
        }
        .whatsapp-btn-text small {
          color: var(--text-faint);
          font-size: 12px;
        }
        .contact-email-link {
          color: var(--text-soft);
          font-family: var(--font-mono);
          font-size: 13px;
        }
        .contact-email-link:hover { color: var(--accent); }
        .contact-location {
          color: var(--text-faint);
          font-size: 13px;
        }
        .contact-form {
          display: grid;
          gap: 14px;
          padding: 24px;
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          background: var(--bg-card);
        }
        .contact-form-note {
          margin: 0;
          color: var(--text-faint);
          font-size: 12px;
          line-height: 1.5;
        }
        .contact-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .contact-form label {
          display: grid;
          gap: 6px;
        }
        .contact-form label span {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-faint);
        }
        .contact-form input,
        .contact-form textarea {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          background: var(--bg-raised);
          font-size: 14px;
          resize: vertical;
          outline: none;
          transition: border-color 160ms ease;
        }
        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: var(--accent);
        }
        .contact-honeypot {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
        }
        .contact-turnstile { min-height: 65px; }
        .contact-form-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .contact-submit {
          border: none;
          cursor: pointer;
        }
        .contact-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .contact-feedback {
          margin: 0;
          font-size: 13px;
        }
        .contact-feedback--ok { color: var(--accent-2); }
        .contact-feedback--err { color: #ff6b6b; }
        @media (max-width: 600px) {
          .contact-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
