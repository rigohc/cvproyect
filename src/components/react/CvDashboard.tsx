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
import "./CvDashboard.css";

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

      
    </div>
  );
}
