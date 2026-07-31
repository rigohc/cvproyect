import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BobbingDots } from "../amicro/bobbing-dots";
import { FadeUp } from "../amicro/fade-up";

export interface TechItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  category: string;
}

interface TechConstellationProps {
  technologies: TechItem[];
  compact?: boolean;
}

function polarPosition(index: number, total: number, radius: number, center: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}

export default function TechConstellation({ technologies, compact = false }: TechConstellationProps) {
  const [active, setActive] = useState<string | null>(null);
  const size = compact ? 340 : 520;
  const center = size / 2;
  const radius = compact ? 118 : 190;

  const nodes = useMemo(
    () =>
      technologies.map((tech, index) => ({
        ...tech,
        ...polarPosition(index, technologies.length, radius, center),
      })),
    [technologies],
  );

  const connections = useMemo(() => {
    const pairs: Array<{ from: (typeof nodes)[0]; to: (typeof nodes)[0]; id: string }> = [];
    for (let i = 0; i < nodes.length; i++) {
      const next = nodes[(i + 1) % nodes.length];
      pairs.push({ from: nodes[i], to: next, id: `${nodes[i].id}-${next.id}` });
      if (i % 3 === 0) {
        const jump = nodes[(i + 4) % nodes.length];
        pairs.push({ from: nodes[i], to: jump, id: `${nodes[i].id}-${jump.id}-jump` });
      }
    }
    return pairs;
  }, [nodes]);

  return (
    <FadeUp className="tech-constellation">
      <div className="tech-panel">
        <div className="tech-panel-header">
          <BobbingDots />
          <span>Stack en movimiento · {technologies.length} tecnologías</span>
        </div>

        <div className="tech-canvas-wrap">
          <svg viewBox={`0 0 ${size} ${size}`} className="tech-canvas" role="img" aria-label="Mapa de tecnologías">
            {connections.map((connection, connectionIndex) => (
              <g key={connection.id}>
                <line
                  x1={connection.from.x}
                  y1={connection.from.y}
                  x2={connection.to.x}
                  y2={connection.to.y}
                  className="tech-line"
                />
                <motion.circle
                  r="3"
                  fill="var(--accent)"
                  initial={{ opacity: 0 }}
                  animate={{
                    cx: [connection.from.x, connection.to.x],
                    cy: [connection.from.y, connection.to.y],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: (connectionIndex * 0.37) % 2,
                  }}
                />
              </g>
            ))}

            {nodes.map((node, index) => (
              <g key={node.id}>
                <motion.circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="var(--line)"
                  strokeDasharray="4 8"
                  initial={{ opacity: 0.15 }}
                  animate={{ opacity: [0.12, 0.28, 0.12], rotate: 360 }}
                  transition={{
                    opacity: { duration: 4, repeat: Infinity, delay: index * 0.1 },
                    rotate: { duration: 48, repeat: Infinity, ease: "linear" },
                  }}
                  style={{ transformOrigin: `${center}px ${center}px` }}
                />
              </g>
            ))}
          </svg>

          <div className="tech-nodes">
            {nodes.map((node) => (
              <motion.button
                key={node.id}
                type="button"
                className={`tech-node ${active === node.id ? "is-active" : ""}`}
                style={{ left: `${(node.x / size) * 100}%`, top: `${(node.y / size) * 100}%` }}
                onMouseEnter={() => setActive(node.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(node.id)}
                onBlur={() => setActive(null)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="tech-node-glow" style={{ background: `${node.color}33` }} />
                <img
                  src={`https://cdn.simpleicons.org/${node.slug}/${node.color.replace("#", "")}`}
                  alt=""
                  width={22}
                  height={22}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span className="tech-node-fallback">{node.name.slice(0, 2)}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="tech-legend">
          {technologies.map((tech, index) => (
            <motion.span
              key={tech.id}
              className={`tech-chip ${active === tech.id ? "is-active" : ""}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              onMouseEnter={() => setActive(tech.id)}
              onMouseLeave={() => setActive(null)}
            >
              {tech.name}
            </motion.span>
          ))}
        </div>
      </div>

      <style>{`
        .tech-constellation { width: 100%; }
        .tech-panel {
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          overflow: hidden;
        }
        .tech-panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--line);
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .tech-canvas-wrap {
          position: relative;
          aspect-ratio: 1;
          max-height: ${compact ? "340px" : "520px"};
          margin: 0 auto;
        }
        .tech-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .tech-line {
          stroke: var(--line-strong);
          stroke-width: 1;
          opacity: 0.55;
        }
        .tech-nodes {
          position: absolute;
          inset: 0;
        }
        .tech-node {
          position: absolute;
          display: grid;
          width: 52px;
          height: 52px;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 50%;
          background: var(--bg-raised);
          cursor: pointer;
          transform: translate(-50%, -50%);
          overflow: hidden;
        }
        .tech-node.is-active {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .tech-node-glow {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 180ms ease;
        }
        .tech-node.is-active .tech-node-glow,
        .tech-node:hover .tech-node-glow {
          opacity: 1;
        }
        .tech-node img {
          position: relative;
          z-index: 1;
        }
        .tech-node-fallback {
          position: absolute;
          font-size: 10px;
          color: var(--text-soft);
        }
        .tech-node:has(img:not([style*="display: none"])) .tech-node-fallback {
          display: none;
        }
        .tech-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 18px 20px 22px;
          border-top: 1px solid var(--line);
        }
        .tech-chip {
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 5px 12px;
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: 10px;
          transition: border-color 160ms ease, color 160ms ease, background 160ms ease;
        }
        .tech-chip.is-active,
        .tech-chip:hover {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--text);
        }
        @media (max-width: 640px) {
          .tech-canvas-wrap { max-height: 360px; }
          .tech-node { width: 44px; height: 44px; }
        }
      `}</style>
    </FadeUp>
  );
}
