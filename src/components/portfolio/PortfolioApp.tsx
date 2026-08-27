import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MagneticButton } from "../amicro/magnetic-button";
import { BobbingDots } from "../amicro/bobbing-dots";
import TechConstellation from "../react/TechConstellation";
import CompanyGrid from "../react/CompanyGrid";
import GitHubIntel from "./GitHubIntel";
import ProfileGallery from "./ProfileGallery";
import ContactForm from "./ContactForm";
import EcommerceExpertiseSection from "./EcommerceExpertiseSection";
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
import "./PortfolioApp.css";

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
        <div className="pf-hero-copy">
          <div className="pf-hero-badges">
            {portfolioHeadline.roles.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </div>
          <h1>
            <span className="h1-line">{name.split(" ")[0]}</span>
            <span className="h1-line h1-accent">{name.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="pf-hook">{portfolioHeadline.hook}</p>
          <p className="pf-mission">{portfolioHeadline.mission}</p>
          <div className="pf-hero-actions no-print">
            <a href="#projects" className="cta-link">Ver proyectos</a>
            <MagneticButton href={`mailto:${email}`}>Hablemos →</MagneticButton>
          </div>
        </div>
        <div className="pf-hero-proof">
          <figure className="hero-portrait">
            <img src="/images/gallery/desk-ofiice.png" alt="Rigoberto Hernández trabajando en un entorno profesional" width="576" height="1024" fetchPriority="high" />
            <figcaption>
              <span>Ingeniería + operación</span>
              <strong>Disponible para nuevos retos</strong>
            </figcaption>
          </figure>
          <div className="pf-stats" aria-label="Resumen profesional">
            <div><strong>6+</strong><span>años de experiencia</span></div>
            <div><strong>4</strong><span>empresas</span></div>
            <div><strong>20+</strong><span>tecnologías</span></div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* PERFIL */}
      <section id="about" className="pf-section pf-section--paper">
        <div className="pf-split pf-split--profile">
          <div className="pf-section-copy">
            <h2>Retail complejo, sistemas claros.</h2>
            <p className="pf-lead">{summary}</p>
            <div className="pf-proof-grid">
              {["E-commerce Enterprise", "Automatización", "Liderazgo Técnico", "Event-Driven"].map((item) => (
                <div key={item} className="pf-proof-card">{item}</div>
              ))}
            </div>
          </div>
          <ProfileGallery />
        </div>
        <CompanyGrid companies={companies} compact />
      </section>

      {/* STACK */}
      <section id="skills" className="pf-section">
        <h2>El mapa detrás de cada entrega.</h2>
        <p className="pf-lead">React, Node, RabbitMQ, Magento, VTEX — cada nodo es experiencia real.</p>
        <TechConstellation technologies={technologies} compact />
      </section>

      <EcommerceExpertiseSection />

      {/* PROYECTOS */}
      <section id="projects" className="pf-section pf-section--paper">
        <p className="pf-kicker"><span>04</span> Proyectos</p>
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
          initial={false}
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
      <section id="journey" className="pf-section pf-section--paper">
        <h2>Cómo llegué hasta aquí.</h2>
        <div className="journey-track">
          {journeySteps.map((step, i) => (
            <motion.div
              key={step.step}
              className="journey-step"
              initial={false}
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
        <h3>+6 años desarrollando soluciones empresariales, eCommerce, microservicios y plataformas SaaS utilizando Node.js, React, Magento, TypeScript, Docker y Kubernetes.</h3>
        <div className="hire-grid">
          {hireSignals.map((signal, i) => (
            <motion.div
              key={signal.title}
              className="hire-card"
              initial={false}
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
      <section id="contact" className="pf-section pf-section--paper pf-contact">
        <h2>Hagamos algo que valga la pena.</h2>
        <p className="pf-lead">
          Prefiero WhatsApp antes que llamadas. El formulario es seguro: verificación anti-bots y sin solicitud de datos sensibles.
        </p>
        <ContactForm email={email} whatsappUrl={whatsappUrl} location={contact.location} />
        <div className="panel-loader no-print"><BobbingDots /></div>
      </section>
        </main>
      </div>
    </div>
  );
}
