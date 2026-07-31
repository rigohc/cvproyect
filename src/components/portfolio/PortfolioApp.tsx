import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MagneticButton } from "../amicro/magnetic-button";
import { BobbingDots } from "../amicro/bobbing-dots";
import TechConstellation from "../react/TechConstellation";
import CompanyGrid from "../react/CompanyGrid";
import PortfolioAssistant from "./PortfolioAssistant";
import GitHubIntel from "./GitHubIntel";
import ProfileGallery from "./ProfileGallery";
import ContactForm from "./ContactForm";
import type { Contact, Recommendation, TechItem, CompanyItem } from "../../data/cv";
import {
  commandSections,
  featuredProjects,
  hireSignals,
  journeySteps,
  marqueeItems,
  portfolioHeadline,
  type PortfolioProject,
} from "../../data/portfolio";

interface PortfolioAppProps {
  name: string;
  title: string;
  summary: string;
  tagline: string;
  email: string;
  contact: Contact;
  companies: CompanyItem[];
  technologies: TechItem[];
  recommendations: Recommendation[];
}

function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={`${item}-${i}`}>{item} · </span>
        ))}
      </div>
    </div>
  );
}

function ArchitectureFlow({ project }: { project: PortfolioProject }) {
  return (
    <div className="arch-flow">
      {project.architecture.map((node, i) => (
        <React.Fragment key={node.step}>
          <motion.div
            className="arch-node"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            style={{ borderColor: project.accent }}
          >
            <em>{node.step}</em>
            <strong>{node.title}</strong>
            <span>{node.detail}</span>
          </motion.div>
          {i < project.architecture.length - 1 ? <div className="arch-arrow">→</div> : null}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function PortfolioApp({
  name,
  title,
  summary,
  tagline,
  email,
  contact,
  companies,
  technologies,
  recommendations,
}: PortfolioAppProps) {
  const [activeSection, setActiveSection] = useState("command");
  const [activeProject, setActiveProject] = useState(featuredProjects[0].id);

  useEffect(() => {
    const ids = commandSections.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const project = featuredProjects.find((p) => p.id === activeProject) ?? featuredProjects[0];
  const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`;

  return (
    <div className="portfolio-app">
      <div className="portfolio-layout">
        <aside className="command-rail no-print" aria-label="Navegación">
          <p className="rail-label">Secciones</p>
          <nav className="command-nav">
            {commandSections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={activeSection === id ? "is-active" : ""}
                onClick={() => setActiveSection(id)}
              >
                <span className="rail-dot" />
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="portfolio-main">
      {/* INICIO */}
      <section id="command" className="pf-section pf-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="pf-hero-badges">
          {portfolioHeadline.roles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>
        <h1>
          <span className="h1-line">{name.split(" ")[0]}</span>
          <span className="h1-line h1-gradient">{name.split(" ").slice(1).join(" ")}</span>
        </h1>
        <p className="pf-hook">{portfolioHeadline.hook}</p>
        <p className="pf-mission">{portfolioHeadline.mission}</p>
        <div className="pf-hero-actions no-print">
          <a href="#projects" className="cta-link">Ver proyectos</a>
          <MagneticButton href={`mailto:${email}`}>Hablemos →</MagneticButton>
        </div>
        <div className="pf-stats">
          <div><strong>6+</strong><span>años exp.</span></div>
          <div><strong>4</strong><span>empresas</span></div>
          <div><strong>20+</strong><span>tecnologías</span></div>
        </div>
      </section>

      <Marquee />

      {/* PERFIL */}
      <section id="about" className="pf-section">
        <p className="pf-kicker"><span>01</span> Perfil</p>
        <h2>Retail complejo, sistemas claros.</h2>
        <p className="pf-lead">{summary}</p>
        <ProfileGallery />
        <div className="pf-proof-grid">
          {["E-commerce Enterprise", "Automatización", "Liderazgo Técnico", "Event-Driven"].map((item) => (
            <div key={item} className="pf-proof-card">{item}</div>
          ))}
        </div>
        <CompanyGrid companies={companies} compact />
      </section>

      {/* STACK */}
      <section id="skills" className="pf-section">
        <p className="pf-kicker"><span>02</span> Stack</p>
        <h2>El mapa detrás de cada entrega.</h2>
        <p className="pf-lead">React, Node, RabbitMQ, Magento, VTEX — cada nodo es experiencia real.</p>
        <TechConstellation technologies={technologies} compact />
      </section>

      {/* PROYECTOS */}
      <section id="projects" className="pf-section">
        <p className="pf-kicker"><span>03</span> Proyectos</p>
        <h2>Arquitectura que se puede explicar.</h2>
        <div className="project-tabs no-print">
          {featuredProjects.map((p) => (
            <button
              key={p.id}
              type="button"
              className={activeProject === p.id ? "is-active" : ""}
              onClick={() => setActiveProject(p.id)}
              style={{ "--tab-accent": p.accent } as React.CSSProperties}
            >
              {p.name}
            </button>
          ))}
        </div>
        <motion.article
          key={project.id}
          className="project-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ "--project-accent": project.accent } as React.CSSProperties}
        >
          <div className="project-card-head">
            <div>
              <h3>{project.name}</h3>
              <p className="project-tagline">{project.tagline}</p>
            </div>
            <div className="project-tags">
              {project.tech.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
          <p className="project-desc">{project.description}</p>
          <p className="project-impact">▸ {project.impact}</p>
          <h4 className="arch-title">Arquitectura del sistema</h4>
          <ArchitectureFlow project={project} />
        </motion.article>
      </section>

      {/* GITHUB */}
      <section id="github" className="pf-section">
        <p className="pf-kicker"><span>04</span> GitHub</p>
        <h2>Actividad verificable en código.</h2>
        <p className="pf-lead">
          Datos en vivo desde{" "}
          <a href="https://github.com/rigohc" target="_blank" rel="noopener noreferrer" className="inline-link">
            github.com/rigohc
          </a>
        </p>
        <GitHubIntel />
      </section>

      {/* TRAYECTORIA */}
      <section id="journey" className="pf-section">
        <p className="pf-kicker"><span>05</span> Trayectoria</p>
        <h2>Cómo llegué hasta aquí.</h2>
        <div className="journey-track">
          {journeySteps.map((step, i) => (
            <motion.div
              key={step.step}
              className="journey-step"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="journey-num">{step.step}</span>
              <div>
                <em>{step.phase}</em>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
                <span className="journey-proof">{step.proof}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTRATAR */}
      <section id="hire" className="pf-section">
        <p className="pf-kicker"><span>06</span> Por qué yo</p>
        <h2>Señales que un reclutador puede validar.</h2>
        <div className="hire-grid">
          {hireSignals.map((signal, i) => (
            <motion.div
              key={signal.title}
              className="hire-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="hire-metric">
                <strong>{signal.metric}</strong>
                <span>{signal.label}</span>
              </div>
              <h3>{signal.title}</h3>
              <p>{signal.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="signal-cards">
          {recommendations.map((rec) => (
            <blockquote key={rec.name} className="signal-card">
              <p>"{rec.text}"</p>
              <footer>{rec.name} · {rec.company}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contact" className="pf-section pf-contact">
        <p className="pf-kicker"><span>07</span> Contacto</p>
        <h2>Hagamos algo que valga la pena.</h2>
        <p className="pf-lead">
          Prefiero WhatsApp antes que llamadas. El formulario es seguro: verificación anti-bots y sin solicitud de datos sensibles.
        </p>
        <ContactForm email={email} whatsappUrl={whatsappUrl} location={contact.location} />
        <div className="panel-loader no-print"><BobbingDots /></div>
      </section>
        </main>
      </div>

      <PortfolioAssistant />

      <style>{`
        .portfolio-layout {
          display: grid;
          grid-template-columns: 200px minmax(0, 1fr);
          max-width: 1180px;
          margin-inline: auto;
          min-height: calc(100vh - 64px);
        }
        .command-rail {
          position: sticky;
          top: 64px;
          align-self: start;
          height: calc(100vh - 64px);
          padding: 28px 0 28px 28px;
          border-right: 1px solid var(--line);
        }
        .rail-label {
          margin: 0 0 16px;
          padding-left: 14px;
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .command-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .command-nav a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          color: var(--text-faint);
          font-size: 13px;
          font-weight: 500;
          transition: color 160ms ease, background 160ms ease;
        }
        .command-nav a:hover { color: var(--text-soft); }
        .rail-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--line-strong);
          transition: background 160ms ease, transform 160ms ease;
        }
        .command-nav a.is-active {
          background: var(--accent-soft);
          color: var(--text);
        }
        .command-nav a.is-active .rail-dot {
          background: var(--gradient);
          transform: scale(1.3);
        }
        .portfolio-main {
          min-width: 0;
          width: 100%;
          max-width: 900px;
          padding-right: 28px;
        }
        .pf-section {
          scroll-margin-top: 88px;
          padding: 64px 0 64px 48px;
          border-bottom: 1px solid var(--line);
        }
        .pf-hero {
          position: relative;
          min-height: 78vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 48px;
          isolation: isolate;
        }
        .pf-hero-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }
        .pf-hero-badges span {
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 5px 12px;
          background: var(--bg-raised);
          color: var(--text-soft);
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .pf-hero h1 {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin: 0;
        }
        .h1-line {
          font-family: var(--font-display);
          font-size: clamp(48px, 9vw, 88px);
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: 0.92;
        }
        .h1-gradient {
          background: var(--gradient);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .pf-hook {
          margin: 24px 0 0;
          color: var(--text);
          font-family: var(--font-display);
          font-size: clamp(16px, 2.5vw, 20px);
          font-weight: 600;
          line-height: 1.4;
          max-width: 520px;
        }
        .pf-mission {
          margin: 14px 0 0;
          color: var(--text-soft);
          font-size: 14px;
          line-height: 1.75;
          max-width: 580px;
        }
        .pf-hero-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          flex-wrap: wrap;
        }
        .pf-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 40px;
        }
        .pf-stats div {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 88px;
          padding: 12px 16px;
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          background: var(--bg-card);
        }
        .pf-stats strong {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          background: var(--gradient);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .pf-stats span {
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .marquee-wrap {
          overflow: hidden;
          border-block: 1px solid var(--line);
          padding: 14px 0;
          background: var(--bg-raised);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .marquee-track span { padding-right: 32px; white-space: nowrap; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .pf-kicker {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 12px;
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .pf-kicker span {
          color: var(--accent);
          font-weight: 500;
        }
        .pf-section h2 {
          margin: 0 0 16px;
          font-family: var(--font-display);
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .pf-lead {
          margin: 0 0 28px;
          color: var(--text-soft);
          font-size: 14px;
          line-height: 1.7;
          max-width: 600px;
        }
        .inline-link {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .inline-link:hover { color: var(--accent-2); }
        .pf-proof-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 28px;
        }
        .pf-proof-card {
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: 14px 16px;
          background: var(--bg-card);
          font-size: 12px;
          font-weight: 500;
          color: var(--text-soft);
        }
        .project-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .project-tabs button {
          padding: 8px 16px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: var(--bg-raised);
          color: var(--text-soft);
          font-size: 12px;
          cursor: pointer;
          transition: border-color 160ms ease, background 160ms ease;
        }
        .project-tabs button.is-active {
          border-color: var(--tab-accent, var(--accent));
          background: color-mix(in srgb, var(--tab-accent, var(--accent)) 14%, transparent);
          color: var(--tab-accent, var(--accent));
        }
        .project-card {
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 28px;
          background: linear-gradient(160deg, color-mix(in srgb, var(--project-accent) 10%, transparent), var(--bg-card) 55%);
        }
        .project-card-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .project-card h3 { margin: 0; font-family: var(--font-display); font-size: 20px; font-weight: 700; }
        .project-tagline { margin: 4px 0 0; color: var(--text-faint); font-family: var(--font-mono); font-size: 11px; }
        .project-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .project-tags span {
          border-radius: 999px;
          padding: 3px 10px;
          background: var(--bg-soft);
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: 10px;
        }
        .project-desc { color: var(--text-soft); font-size: 14px; line-height: 1.65; margin: 0; }
        .project-impact { margin: 12px 0 0; color: var(--accent); font-size: 13px; font-weight: 500; }
        .arch-title { margin: 28px 0 14px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-faint); }
        .arch-flow {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          gap: 6px;
        }
        .arch-node {
          flex: 1;
          min-width: 110px;
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: 12px;
          background: var(--bg-raised);
        }
        .arch-node em { color: var(--accent); font-family: var(--font-mono); font-size: 10px; font-style: normal; }
        .arch-node strong { display: block; margin-top: 4px; font-size: 12px; font-weight: 600; }
        .arch-node span { display: block; margin-top: 4px; color: var(--text-faint); font-size: 10px; line-height: 1.45; }
        .arch-arrow { display: flex; align-items: center; color: var(--accent-2); font-size: 16px; flex: none; padding: 0 2px; }
        .journey-track { display: grid; gap: 14px; }
        .journey-step {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 16px;
          padding: 20px;
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          background: var(--bg-card);
        }
        .journey-num {
          display: grid;
          width: 40px;
          height: 40px;
          place-items: center;
          border-radius: var(--radius-sm);
          background: var(--gradient);
          color: white;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
        }
        .journey-step em { color: var(--accent); font-family: var(--font-mono); font-size: 10px; font-style: normal; text-transform: uppercase; letter-spacing: 0.06em; }
        .journey-step strong { display: block; margin-top: 4px; font-family: var(--font-display); font-size: 15px; font-weight: 700; }
        .journey-step p { margin: 8px 0 0; color: var(--text-soft); font-size: 13px; line-height: 1.6; }
        .journey-proof { display: block; margin-top: 8px; color: var(--accent-2); font-family: var(--font-mono); font-size: 11px; }
        .hire-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }
        .hire-card {
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 20px;
          background: var(--bg-card);
        }
        .hire-metric strong {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 800;
          background: var(--gradient);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .hire-metric span { display: block; margin-top: 2px; color: var(--text-faint); font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
        .hire-card h3 { margin: 12px 0 6px; font-family: var(--font-display); font-size: 14px; font-weight: 700; }
        .hire-card p { margin: 0; color: var(--text-soft); font-size: 12px; line-height: 1.6; }
        .signal-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .signal-card {
          margin: 0;
          border: 1px solid var(--line);
          border-left: 3px solid var(--accent);
          border-radius: var(--radius-sm);
          padding: 18px;
          background: var(--bg-raised);
        }
        .signal-card p { margin: 0; font-size: 12px; color: var(--text-soft); line-height: 1.65; font-style: italic; }
        .signal-card footer { margin-top: 10px; color: var(--text-faint); font-size: 11px; font-style: normal; }
        .pf-contact { padding-bottom: 120px; }
        .contact-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .cta-link--outline {
          background: transparent !important;
          border: 1px solid var(--line-strong) !important;
          color: var(--text) !important;
        }
        .cta-link--outline:hover {
          border-color: var(--accent) !important;
        }
        .contact-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: 12px;
        }
        .panel-loader { display: flex; margin-top: 28px; }
        @media (max-width: 900px) {
          .portfolio-layout { grid-template-columns: 1fr; }
          .command-rail {
            position: sticky;
            top: 64px;
            z-index: 40;
            height: auto;
            padding: 12px 20px;
            border-right: 0;
            border-bottom: 1px solid var(--line);
            background: var(--header);
            backdrop-filter: blur(20px);
          }
          .rail-label { display: none; }
          .command-nav {
            flex-direction: row;
            overflow-x: auto;
            scrollbar-width: none;
            gap: 4px;
          }
          .command-nav::-webkit-scrollbar { display: none; }
          .command-nav a {
            flex: none;
            padding: 6px 12px;
            font-size: 12px;
            white-space: nowrap;
          }
          .rail-dot { display: none; }
          .portfolio-main { max-width: none; padding-right: 0; }
          .pf-section { padding: 48px 20px; }
          .pf-hero { min-height: auto; padding-top: 32px; }
        }
        @media (max-width: 600px) {
          .pf-proof-grid, .hire-grid, .signal-cards { grid-template-columns: 1fr; }
          .arch-flow { flex-direction: column; }
          .arch-arrow { transform: rotate(90deg); justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
