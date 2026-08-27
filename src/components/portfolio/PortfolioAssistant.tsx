import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { assistantAnswerService } from "../../lib/assistant/AssistantAnswerService";
import AudioPlayerWidget from "./AudioPlayerWidget";
import "./PortfolioAssistant.css";

interface Message {
  role: "user" | "assistant";
  text: string;
  source?: "ai" | "local";
}

const quickQuestions = ["¿Qué puedes contarme?", "Ver proyectos", "¿Cuál es tu stack?"];

function RobotMark({ active = false }: { active?: boolean }) {
  return (
    <span className={`assistant-robot${active ? " is-active" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img">
        <path className="assistant-robot__signal" d="M24 10V6" />
        <circle className="assistant-robot__signal-dot" cx="24" cy="4" r="2.25" />
        <rect className="assistant-robot__head" x="9" y="11" width="30" height="25" rx="9" />
        <path className="assistant-robot__ear" d="M9 21H6v7h3M39 21h3v7h-3" />
        <circle className="assistant-robot__eye" cx="18" cy="23" r="2.5" />
        <circle className="assistant-robot__eye" cx="30" cy="23" r="2.5" />
        <path className="assistant-robot__mouth" d="M18 30c1.8 1.3 3.8 2 6 2s4.2-.7 6-2" />
        <path className="assistant-robot__base" d="M17 36v4h14v-4" />
      </svg>
    </span>
  );
}

export default function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioText, setAudioText] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hola — soy el asistente de Rigoberto. Pregúntame sobre proyectos, stack, experiencia o contacto.",
      source: "local",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsLoading(true);
    setAudioText(null);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const result = (await response.json()) as { text?: string; error?: string; source?: string };

      if (response.ok && result.text) {
        setMessages((prev) => [...prev, { role: "assistant", text: result.text!, source: "ai" }]);
        setAudioText(result.text);
        return;
      }

      const fallbackText =
        assistantAnswerService.findLocalAnswer(text) ??
        result.error ??
        "Puedo contarte sobre Andromeda, HEB, Magento, VTEX, mi stack o contacto. ¿Qué te interesa?";

      setMessages((prev) => [...prev, { role: "assistant", text: fallbackText, source: "local" }]);
      setAudioText(fallbackText);
    } catch {
      const catchText =
        assistantAnswerService.findLocalAnswer(text) ??
        "No pude conectar con el asistente remoto. Intenta WhatsApp o el formulario de contacto.";

      setMessages((prev) => [...prev, { role: "assistant", text: catchText, source: "local" }]);
      setAudioText(catchText);
    } finally {
      setIsLoading(false);
    }
  };

  const askQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      <button
        type="button"
        className={`assistant-fab no-print${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar asistente IA" : "Abrir asistente IA"}
        aria-expanded={open}
        aria-controls="portfolio-assistant-panel"
      >
        <RobotMark active={open} />
        <span className="assistant-fab__label">Pregúntame</span>
        <span className="assistant-fab__status" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="portfolio-assistant-panel"
            className="assistant-panel no-print"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            <header className="assistant-header">
              <RobotMark active />
              <div className="assistant-header__copy">
                <strong>Conoce mi trabajo</strong>
                <span><i aria-hidden="true" /> Asistente IA disponible</span>
              </div>
              <button type="button" className="assistant-close" onClick={() => setOpen(false)} aria-label="Cerrar asistente">
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <div className="assistant-messages">
              {messages.length === 1 ? (
                <div className="assistant-suggestions" aria-label="Preguntas sugeridas">
                  <span>Prueba con una pregunta</span>
                  <div>
                    {quickQuestions.map((question) => (
                      <button type="button" key={question} onClick={() => askQuickQuestion(question)}>
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {messages.map((msg, i) => (
                <div key={i} className={`assistant-msg assistant-msg--${msg.role}`}>
                  {msg.text}
                  {msg.role === "assistant" && msg.source === "local" && i > 0 ? (
                    <em className="assistant-tag">respuesta local</em>
                  ) : null}
                </div>
              ))}
              {isLoading ? (
                <div className="assistant-msg assistant-msg--assistant assistant-typing" aria-label="El asistente está escribiendo">
                  <span /><span /><span />
                </div>
              ) : null}
              <div ref={endRef} />
            </div>
            <div className="assistant-input">
              <label htmlFor="assistant-question">Pregunta sobre mi experiencia</label>
              <input
                id="assistant-question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="¿Qué construiste en Andromeda?"
                aria-disabled={isLoading}
              />
              <button type="button" onClick={send} disabled={isLoading || !input.trim()} aria-label="Enviar mensaje">
                →
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {audioText ? <AudioPlayerWidget text={audioText} onClose={() => setAudioText(null)} /> : null}
    </>
  );
}
