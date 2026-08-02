import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import "./AudioPlayerWidget.css";

interface AudioPlayerWidgetProps {
  text: string;
  onClose: () => void;
}

export default function AudioPlayerWidget({ text, onClose }: AudioPlayerWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (!text || !synthRef.current) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX";
    utterance.rate = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setTimeout(() => onClose(), 3000);
    };
    utterance.onerror = () => setIsPlaying(false);

    synthRef.current.speak(utterance);

    return () => {
      synthRef.current?.cancel();
    };
  }, [text, onClose]);

  const handleClose = () => {
    synthRef.current?.cancel();
    onClose();
  };

  if (!text) return null;

  return (
    <motion.div
      className="audio-widget no-print"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.22 }}
    >
      <div className={`audio-indicator ${isPlaying ? "playing" : ""}`}>
        {isPlaying ? "🔊" : "🔈"}
      </div>

      <div className={`audio-visualizer ${isPlaying ? "is-playing" : ""}`}>
        {[1, 2, 3, 4].map((bar) => (
          <div key={bar} className="bar" />
        ))}
      </div>

      <div className="audio-text">{text}</div>

      <button type="button" className="audio-close" onClick={handleClose} aria-label="Cerrar audio">
        ×
      </button>
    </motion.div>
  );
}
