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

  return (
    <>
      <button type="button" className="assistant-fab no-print" onClick={() => setOpen((v) => !v)} aria-label="Asistente IA">
        {open ? "×" : "AI"}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="assistant-panel no-print"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            <header>
              <strong>Asistente de Rigoberto</strong>
              <span>IA + respuestas locales sobre el portafolio</span>
            </header>
            <div className="assistant-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`assistant-msg assistant-msg--${msg.role}`}>
                  {msg.text}
                  {msg.role === "assistant" && msg.source === "local" && i > 0 ? (
                    <em className="assistant-tag">respuesta local</em>
                  ) : null}
                </div>
              ))}
              {isLoading ? <div className="assistant-msg assistant-msg--assistant">Escribiendo…</div> : null}
              <div ref={endRef} />
            </div>
            <div className="assistant-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="¿Qué construiste en Andromeda?"
                disabled={isLoading}
              />
              <button type="button" onClick={send} disabled={isLoading} aria-label="Enviar mensaje">
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
