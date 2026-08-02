import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Experience } from "../../data/cv";
import "./ExperienceAccordion.css";

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

      
    </div>
  );
}
