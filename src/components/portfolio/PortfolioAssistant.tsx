import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { assistantKnowledge } from "../../data/portfolio";

interface Message {
  role: "user" | "assistant";
  text: string;
  source?: "ai" | "local";
}

function findLocalAnswer(input: string): string | null {
  const normalized = input.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  for (const entry of assistantKnowledge) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return entry.answer;
    }
  }
  return null;
}

export default function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const result = (await response.json()) as { text?: string; error?: string; source?: string };

      if (response.ok && result.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: result.text, source: "ai" },
        ]);
        return;
      }

      const local = findLocalAnswer(text);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: local ?? result.error ?? "Puedo contarte sobre Andromeda, HEB, Magento, VTEX, mi stack o contacto. ¿Qué te interesa?",
          source: "local",
        },
      ]);
    } catch {
      const local = findLocalAnswer(text);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: local ?? "No pude conectar con el asistente remoto. Intenta WhatsApp o el formulario de contacto.",
          source: "local",
        },
      ]);
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
              <button type="button" onClick={send} disabled={isLoading} aria-label="Enviar mensaje">→</button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style>{`
        .assistant-fab {
          position: fixed;
          z-index: 100;
          right: 24px;
          bottom: 24px;
          width: 54px;
          height: 54px;
          border: none;
          border-radius: var(--radius-md);
          background: var(--gradient);
          color: white;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: var(--shadow);
          transition: transform 160ms ease;
        }
        .assistant-fab:hover { transform: translateY(-2px); }
        .assistant-panel {
          position: fixed;
          z-index: 99;
          right: 24px;
          bottom: 92px;
          display: grid;
          grid-template-rows: auto 1fr auto;
          width: min(380px, calc(100vw - 48px));
          height: 440px;
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .assistant-panel header {
          padding: 14px 16px;
          border-bottom: 1px solid var(--line);
        }
        .assistant-panel header strong { display: block; font-size: 13px; }
        .assistant-panel header span { color: var(--text-faint); font-size: 10px; }
        .assistant-messages {
          overflow-y: auto;
          padding: 12px;
          display: grid;
          gap: 8px;
          align-content: start;
        }
        .assistant-msg {
          max-width: 90%;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 11px;
          line-height: 1.55;
        }
        .assistant-msg--assistant {
          justify-self: start;
          background: var(--bg-soft);
          color: var(--text-soft);
        }
        .assistant-msg--user {
          justify-self: end;
          background: var(--accent-soft);
          color: var(--text);
        }
        .assistant-tag {
          display: block;
          margin-top: 4px;
          color: var(--text-faint);
          font-size: 9px;
          font-style: normal;
          font-family: var(--font-mono);
        }
        .assistant-input {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid var(--line);
        }
        .assistant-input input {
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          background: var(--bg-raised);
          font-size: 12px;
          outline: none;
        }
        .assistant-input input:focus { border-color: var(--accent); }
        .assistant-input button {
          width: 40px;
          border: 0;
          border-radius: var(--radius-sm);
          background: var(--gradient);
          color: white;
          cursor: pointer;
          font-size: 16px;
        }
        .assistant-input input:disabled,
        .assistant-input button:disabled { cursor: wait; opacity: 0.7; }
      `}</style>
    </>
  );
}
