import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  commercePerspectives,
  commercePrinciples,
  type CommercePerspective,
} from "../../data/portfolio";
import "./EcommerceExpertiseSection.css";

const stages = [
  { label: "Contexto de negocio", key: "context" },
  { label: "Riesgo operativo", key: "operationalRisk" },
  { label: "Decisión de sistema", key: "systemDecision" },
] as const;

export default function EcommerceExpertiseSection() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(commercePerspectives[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = commercePerspectives.findIndex((item) => item.id === activeId);
  const active = commercePerspectives[activeIndex] ?? commercePerspectives[0];

  const selectAt = (index: number) => {
    const nextIndex = (index + commercePerspectives.length) % commercePerspectives.length;
    setActiveId(commercePerspectives[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectAt(index + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectAt(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectAt(commercePerspectives.length - 1);
    }
  };

  return (
    <section id="ecommerce" className="pf-section commerce-section">
      <p className="pf-kicker"><span>03</span> E-commerce &amp; Domain Expertise</p>
      <h2>Del objetivo comercial al sistema que lo hace posible.</h2>
      <p className="commerce-thesis">
        Un e-commerce no es una página con productos. Es una operación conectada donde catálogo,
        clientes, pedidos, integraciones y postventa deben avanzar sin perder contexto ni confianza.
      </p>

      <div className="commerce-workbench">
        <div className="commerce-index" role="tablist" aria-label="Perspectivas del negocio e-commerce">
          <p className="commerce-index-label">Explora una tensión del negocio</p>
          {commercePerspectives.map((item, index) => {
            const selected = item.id === active.id;
            return (
              <button
                key={item.id}
                ref={(node) => { tabRefs.current[index] = node; }}
                id={`commerce-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="commerce-detail"
                tabIndex={selected ? 0 : -1}
                className={`commerce-index-item ${selected ? "is-active" : ""}`}
                onClick={() => setActiveId(item.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="commerce-index-number">0{index + 1}</span>
                <span className="commerce-index-copy">
                  <strong>{item.shortLabel}</strong>
                  <small>{item.businessNeed}</small>
                </span>
                <span className="commerce-index-arrow" aria-hidden="true">→</span>
              </button>
            );
          })}
        </div>

        <div className="commerce-detail-shell">
          <div className="commerce-signal" aria-hidden="true">
            <span /><span /><span />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={active.id}
              id="commerce-detail"
              className="commerce-detail"
              role="tabpanel"
              aria-labelledby={`commerce-tab-${active.id}`}
              initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="commerce-detail-head">
                <span>Perspectiva 0{activeIndex + 1}</span>
                <strong>{active.shortLabel}</strong>
              </div>
              <h3>{active.businessNeed}</h3>

              <div className="commerce-reasoning">
                {stages.map((stage, index) => (
                  <React.Fragment key={stage.key}>
                    <div className="commerce-reasoning-step">
                      <span>{stage.label}</span>
                      <p>{active[stage.key]}</p>
                    </div>
                    {index < stages.length - 1 ? (
                      <div className="commerce-flow" aria-hidden="true"><i /></div>
                    ) : null}
                  </React.Fragment>
                ))}
              </div>

              <footer className="commerce-evidence">
                <div>
                  <span>Evidencia aplicada</span>
                  <strong>{active.evidence}</strong>
                </div>
                <ul aria-label="Capacidades relacionadas">
                  {active.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
              </footer>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      <div className="commerce-principles" aria-label="Principios de decisión">
        <p>Cómo tomo decisiones</p>
        <ol>
          {commercePrinciples.map((principle, index) => (
            <li key={principle}><span>0{index + 1}</span>{principle}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
