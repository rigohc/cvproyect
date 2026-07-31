import React from "react";
import { motion } from "motion/react";
import { FadeUp } from "../amicro/fade-up";

export interface CompanyItem {
  id: string;
  name: string;
  partner?: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  initials: string;
  accent: string;
  logo?: string;
  current?: boolean;
}

interface CompanyGridProps {
  companies: CompanyItem[];
  compact?: boolean;
}

export default function CompanyGrid({ companies, compact = false }: CompanyGridProps) {
  return (
    <div className={compact ? "card-grid card-grid--compact" : "card-grid"}>
      {companies.map((company, index) => (
        <FadeUp key={company.id} delay={index * 0.06}>
          <motion.article
            className={`cv-card ${company.current ? "is-current" : ""}`}
            style={{ "--card-accent": company.accent } as React.CSSProperties}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            {company.current ? <span className="featured-corner">✦</span> : null}

            <div className="card-topline">
              <div className="company-logo">
                {company.logo ? (
                  <img src={company.logo} alt="" width={28} height={28} loading="lazy" />
                ) : (
                  company.initials
                )}
              </div>
              <h3>{company.name}</h3>
            </div>

            <div className="card-body">
              <p>{company.description}</p>
              <span className="card-badge">{company.current ? "Actual" : company.period}</span>
              {company.partner ? (
                <p style={{ marginTop: 10, fontSize: 11, color: "var(--text-faint)" }}>
                  {company.partner}
                </p>
              ) : null}
            </div>

            <div className="card-footer">
              <div className="tags">
                {company.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </motion.article>
        </FadeUp>
      ))}
    </div>
  );
}
