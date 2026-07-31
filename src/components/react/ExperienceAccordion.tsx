import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Experience } from "../../data/cv";

interface ExperienceAccordionProps {
  jobs: Experience[];
}

export default function ExperienceAccordion({ jobs }: ExperienceAccordionProps) {
  const [openId, setOpenId] = useState(jobs[0]?.id ?? "");
  const [showPrevious, setShowPrevious] = useState(false);

  const current = jobs.find((job) => job.current) ?? jobs[0];
  const previous = jobs.filter((job) => job.id !== current?.id);

  return (
    <div className="exp-accordion">
      {current ? (
        <article className="exp-entry is-current">
          <button
            type="button"
            className="exp-trigger"
            onClick={() => setOpenId(openId === current.id ? "" : current.id)}
            aria-expanded={openId === current.id}
          >
            <div>
              <span className="exp-date">Actual · {current.period}</span>
              <strong>{current.role}</strong>
              <span className="exp-company">{current.company}</span>
            </div>
            <span className="exp-toggle">{openId === current.id ? "−" : "+"}</span>
          </button>

          <AnimatePresence initial={false}>
            {openId === current.id ? (
              <motion.div
                key={current.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="exp-panel"
              >
                {current.summary ? <p>{current.summary}</p> : null}
                <ul>
                  {current.highlights.slice(0, 4).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {current.tech ? (
                  <div className="exp-tags">
                    {current.tech.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </article>
      ) : null}

      {previous.length > 0 ? (
        <div className="exp-previous">
          <button
            type="button"
            className="exp-previous-toggle"
            onClick={() => setShowPrevious((value) => !value)}
            aria-expanded={showPrevious}
          >
            <span>Anteriormente</span>
            <span>{showPrevious ? "−" : "+"}</span>
          </button>

          <AnimatePresence initial={false}>
            {showPrevious ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="exp-previous-list"
              >
                {previous.map((job) => (
                  <article key={job.id} className="exp-entry">
                    <button
                      type="button"
                      className="exp-trigger"
                      onClick={() => setOpenId(openId === job.id ? "" : job.id)}
                      aria-expanded={openId === job.id}
                    >
                      <div>
                        <span className="exp-date">{job.period}</span>
                        <strong>{job.role}</strong>
                        <span className="exp-company">{job.company}</span>
                      </div>
                      <span className="exp-toggle">{openId === job.id ? "−" : "+"}</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {openId === job.id ? (
                        <motion.div
                          key={job.id}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="exp-panel"
                        >
                          {job.summary ? <p>{job.summary}</p> : null}
                          <ul>
                            {job.highlights.slice(0, 3).map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </article>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      <style>{`
        .exp-accordion { display: grid; gap: 8px; }
        .exp-entry {
          border: 1px solid var(--line);
          border-radius: 4px;
          background: var(--bg-card);
          overflow: hidden;
        }
        .exp-entry.is-current {
          border-color: color-mix(in srgb, var(--accent) 35%, var(--line));
        }
        .exp-trigger {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          border: 0;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }
        .exp-trigger:hover strong { color: var(--accent); }
        .exp-trigger div {
          display: grid;
          gap: 2px;
          min-width: 0;
        }
        .exp-date {
          color: var(--text-faint);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .exp-trigger strong {
          font-size: 13px;
          font-weight: 650;
          transition: color 160ms ease;
        }
        .exp-company {
          color: var(--text-soft);
          font-size: 11px;
        }
        .exp-toggle {
          color: var(--accent);
          font-size: 18px;
          line-height: 1;
        }
        .exp-panel {
          overflow: hidden;
          border-top: 1px solid var(--line);
          padding: 0 16px 14px;
        }
        .exp-panel p {
          margin: 12px 0 0;
          color: var(--text-soft);
          font-size: 12px;
          line-height: 1.6;
        }
        .exp-panel ul {
          margin: 10px 0 0;
          padding-left: 16px;
          color: var(--text-soft);
          font-size: 11px;
        }
        .exp-panel li + li { margin-top: 4px; }
        .exp-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 10px;
        }
        .exp-tags span {
          border: 1px solid var(--line);
          border-radius: 2px;
          padding: 2px 5px;
          color: var(--text-faint);
          font-size: 9px;
        }
        .exp-previous-toggle {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          padding: 12px 2px;
          border: 0;
          border-bottom: 1px solid var(--line);
          background: transparent;
          color: var(--text-soft);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .exp-previous-toggle:hover { color: var(--accent); }
        .exp-previous-list {
          display: grid;
          gap: 8px;
          overflow: hidden;
          padding-top: 8px;
        }
      `}</style>
    </div>
  );
}
