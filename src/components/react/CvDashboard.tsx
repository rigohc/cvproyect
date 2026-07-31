import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BobbingDots } from "../amicro/bobbing-dots";
import { MagneticButton } from "../amicro/magnetic-button";
import CompanyGrid from "./CompanyGrid";
import TechConstellation from "./TechConstellation";
import ExperienceAccordion from "./ExperienceAccordion";
import type {
  Certification,
  CompanyItem,
  Contact,
  Education,
  Experience,
  Recommendation,
  TechItem,
} from "../../data/cv";

type TabId = "ahora" | "empresas" | "stack" | "experiencia" | "mas";

interface CvDashboardProps {
  profile: {
    name: string;
    title: string;
    tagline: string;
    summary: string;
  };
  contact: Contact;
  stats: Array<{ value: string; label: string }>;
  companies: CompanyItem[];
  technologies: TechItem[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  recommendations: Recommendation[];
}

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "ahora", label: "Ahora" },
  { id: "empresas", label: "Empresas" },
  { id: "stack", label: "Stack" },
  { id: "experiencia", label: "Experiencia" },
  { id: "mas", label: "Más" },
];

export default function CvDashboard({
  profile,
  contact,
  stats,
  companies,
  technologies,
  experience,
  education,
  certifications,
  recommendations,
}: CvDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("ahora");

  return (
    <div className="cv-dashboard">
      <section className="dashboard-hero">
        <div className="hero-glow" aria-hidden="true" />
        <p className="eyebrow">
          <span className="status-dot" />
          Disponible · {profile.title}
        </p>
        <h1>{profile.name}</h1>
        <p className="hero-copy">
          <span className="hero-accent">{profile.tagline}</span>
        </p>

        <div className="meta-rows">
          {stats.map((stat) => (
            <div key={stat.label} className="meta-row">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        <div className="hero-actions no-print">
          <MagneticButton href={`mailto:${contact.email}`}>Contactar →</MagneticButton>
          <button type="button" className="icon-button" style={{ width: "auto", paddingInline: 14, fontSize: 11 }} onClick={() => window.print()}>
            PDF
          </button>
        </div>
      </section>

      <nav className="tab-nav no-print" aria-label="Secciones del CV">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-pill ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="panel-shell">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="panel-content"
          >
            {activeTab === "ahora" ? (
              <>
                <p className="panel-lead">{profile.summary}</p>
                <div className="focus-grid">
                  <div className="focus-item">
                    <span>Enfoque</span>
                    <p>E-commerce, automatizaciones y arquitectura orientada a eventos</p>
                  </div>
                  <div className="focus-item">
                    <span>Actual</span>
                    <p>{experience[0]?.company} · {experience[0]?.role}</p>
                  </div>
                  <div className="focus-item">
                    <span>Contacto</span>
                    <p>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </p>
                  </div>
                  <div className="focus-item">
                    <span>Ubicación</span>
                    <p>{contact.location}</p>
                  </div>
                </div>
                <div className="panel-loader no-print">
                  <BobbingDots />
                </div>
              </>
            ) : null}

            {activeTab === "empresas" ? (
              <>
                <p className="panel-lead">Empresas donde he colaborado en retail y plataformas digitales.</p>
                <CompanyGrid companies={companies} compact />
              </>
            ) : null}

            {activeTab === "stack" ? (
              <>
                <p className="panel-lead">Tecnologías con las que construyo — pasa el cursor sobre cada nodo.</p>
                <TechConstellation technologies={technologies} compact />
              </>
            ) : null}

            {activeTab === "experiencia" ? (
              <>
                <p className="panel-lead">Historial laboral — expande cada entrada para ver detalle.</p>
                <ExperienceAccordion jobs={experience} />
              </>
            ) : null}

            {activeTab === "mas" ? (
              <div className="mas-grid">
                <div>
                  <h3 className="mas-title">Formación</h3>
                  {education.map((item) => (
                    <div key={item.degree} className="mas-item">
                      <span>{item.period}</span>
                      <strong>{item.degree}</strong>
                      <p>{item.institution}</p>
                    </div>
                  ))}
                  {certifications.map((item) => (
                    <div key={item.name} className="mas-item">
                      <span>{item.date}</span>
                      <strong>{item.name}</strong>
                      <p>{item.provider}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="mas-title">Referencias</h3>
                  {recommendations.map((rec) => (
                    <blockquote key={rec.name} className="mas-quote">
                      <p>"{rec.text}"</p>
                      <footer>
                        <strong>{rec.name}</strong>
                        <span>{rec.company}</span>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .cv-dashboard {
          display: flex;
          min-height: calc(100dvh - 76px);
          flex-direction: column;
        }
        .dashboard-hero {
          position: relative;
          padding: 36px 40px 28px;
          border-bottom: 1px solid var(--line);
          isolation: isolate;
        }
        .dashboard-hero h1 {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -0.05em;
          line-height: 1;
        }
        .dashboard-hero .eyebrow { margin-bottom: 16px; }
        .dashboard-hero .hero-copy {
          max-width: 620px;
          margin: 12px 0 0;
          color: var(--text-soft);
          font-size: 13px;
          line-height: 1.6;
        }
        .meta-rows {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0;
          margin-top: 20px;
          border: 1px solid var(--line);
          border-radius: 4px;
          overflow: hidden;
        }
        .meta-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 12px;
          border-right: 1px solid var(--line);
          background: var(--bg-raised);
        }
        .meta-row:last-child { border-right: 0; }
        .meta-row span {
          color: var(--text-faint);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .meta-row strong {
          font-family: var(--font-grid);
          font-size: 14px;
          font-weight: 400;
        }
        .hero-actions {
          display: flex;
          gap: 8px;
          margin-top: 18px;
        }
        .tab-nav {
          display: flex;
          gap: 6px;
          padding: 14px 40px;
          border-bottom: 1px solid var(--line);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tab-nav::-webkit-scrollbar { display: none; }
        .tab-pill {
          flex: none;
          padding: 8px 14px;
          border: 1px solid var(--line);
          border-radius: 99px;
          background: var(--bg-raised);
          color: var(--text-soft);
          font-size: 11px;
          cursor: pointer;
          transition: border-color 160ms ease, color 160ms ease, background 160ms ease;
          white-space: nowrap;
        }
        .tab-pill:hover { color: var(--text); border-color: var(--line-strong); }
        .tab-pill.is-active {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
        }
        .panel-shell {
          flex: 1;
          padding: 24px 40px 32px;
          overflow: hidden;
        }
        .panel-content {
          max-width: 920px;
          margin-inline: auto;
        }
        .panel-lead {
          margin: 0 0 18px;
          color: var(--text-soft);
          font-size: 12px;
          line-height: 1.65;
        }
        .focus-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .focus-item {
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 12px 14px;
          background: var(--bg-card);
        }
        .focus-item span {
          color: var(--text-faint);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .focus-item p {
          margin: 6px 0 0;
          color: var(--text-soft);
          font-size: 12px;
          line-height: 1.55;
        }
        .focus-item a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
        .panel-loader { margin-top: 20px; }
        .mas-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }
        .mas-title {
          margin: 0 0 12px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .mas-item {
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 8px;
          background: var(--bg-card);
        }
        .mas-item span {
          color: var(--text-faint);
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .mas-item strong {
          display: block;
          margin-top: 4px;
          font-size: 12px;
        }
        .mas-item p {
          margin: 4px 0 0;
          color: var(--text-soft);
          font-size: 11px;
        }
        .mas-quote {
          margin: 0 0 10px;
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 12px;
          background: var(--bg-card);
        }
        .mas-quote p {
          margin: 0;
          color: var(--text-soft);
          font-size: 11px;
          line-height: 1.6;
        }
        .mas-quote footer {
          display: grid;
          gap: 2px;
          margin-top: 8px;
        }
        .mas-quote strong { font-size: 11px; }
        .mas-quote span { color: var(--text-faint); font-size: 10px; }
        @media (max-width: 820px) {
          .dashboard-hero, .tab-nav, .panel-shell { padding-inline: 20px; }
          .meta-rows { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .meta-row:nth-child(2) { border-right: 0; }
          .meta-row:nth-child(3), .meta-row:nth-child(4) { border-top: 1px solid var(--line); }
          .focus-grid, .mas-grid { grid-template-columns: 1fr; }
        }
        @media print {
          .panel-shell { display: block !important; }
          .panel-content { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
