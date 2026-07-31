import React from "react";
import { motion } from "motion/react";

export function BobbingDots({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-[var(--accent)]"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
