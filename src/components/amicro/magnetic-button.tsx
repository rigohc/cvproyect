import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ href, children, className = "" }: MagneticButtonProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [magneticEnabled, setMagneticEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setMagneticEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <motion.a
      href={href}
      className={`cta-link ${className}`}
      animate={magneticEnabled ? { x: coords.x, y: coords.y } : { x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.4 }}
      onMouseMove={
        magneticEnabled
          ? (event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setCoords({
                x: (event.clientX - rect.left - rect.width / 2) * 0.18,
                y: (event.clientY - rect.top - rect.height / 2) * 0.18,
              });
            }
          : undefined
      }
      onMouseLeave={magneticEnabled ? () => setCoords({ x: 0, y: 0 }) : undefined}
    >
      {children}
    </motion.a>
  );
}
