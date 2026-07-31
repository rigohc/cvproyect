import React, { useState } from "react";
import { motion } from "motion/react";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ href, children, className = "" }: MagneticButtonProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  return (
    <motion.a
      href={href}
      className={`cta-link ${className}`}
      animate={{ x: coords.x, y: coords.y }}
      transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.4 }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCoords({
          x: (event.clientX - rect.left - rect.width / 2) * 0.18,
          y: (event.clientY - rect.top - rect.height / 2) * 0.18,
        });
      }}
      onMouseLeave={() => setCoords({ x: 0, y: 0 })}
    >
      {children}
    </motion.a>
  );
}
