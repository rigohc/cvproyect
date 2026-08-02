import React from "react";
import { TextReveal } from "../amicro/text-reveal";
import { MagneticButton } from "../amicro/magnetic-button";
import { BobbingDots } from "../amicro/bobbing-dots";
import "./HeroSection.css";

interface HeroSectionProps {
  name: string;
  title: string;
  summary: string;
  email: string;
  stats: Array<{ value: string; label: string }>;
}

export default function HeroSection({ name, title, summary, email, stats }: HeroSectionProps) {
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  return (
    <>
      <p className="eyebrow">
        <span className="status-dot" />
        Disponible · Full Stack Developer
      </p>

      <TextReveal
        text={`${firstName}\n${lastName}`}
        className="hero h1-reveal"
      />

      <h1 className="sr-only">{name}</h1>

      <p className="hero-copy">
        <span className="hero-accent">{title}.</span> {summary}
      </p>

      <div className="hero-actions no-print">
        <MagneticButton href={`mailto:${email}`}>
          Contactar →
        </MagneticButton>
        <button
          type="button"
          className="icon-button"
          style={{ width: "auto", paddingInline: 14, fontSize: 11 }}
          onClick={() => window.print()}
        >
          PDF
        </button>
      </div>

      <div className="hero-stats">
        {stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="hero-loader no-print">
        <BobbingDots />
      </div>

      
    </>
  );
}
