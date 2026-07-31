import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { githubUsername } from "../../data/portfolio";

interface GitHubStats {
  repos: number;
  stars: number;
  forks: number;
  followers: number;
  topLanguages: Array<{ name: string; percent: number }>;
  topRepos: Array<{ name: string; stars: number; language: string | null }>;
}

const fallbackStats: GitHubStats = {
  repos: 0,
  stars: 0,
  forks: 0,
  followers: 0,
  topLanguages: [
    { name: "TypeScript", percent: 35 },
    { name: "JavaScript", percent: 28 },
    { name: "PHP", percent: 20 },
    { name: "Python", percent: 10 },
  ],
  topRepos: [],
};

export default function GitHubIntel() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [status, setStatus] = useState<"loading" | "live" | "offline">("loading");

  useEffect(() => {
    if (!githubUsername) {
      setStats(fallbackStats);
      setStatus("offline");
      return;
    }

    async function load() {
      try {
        const userRes = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (!userRes.ok) throw new Error("user");
        const user = await userRes.json();

        const reposRes = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`);
        const repos = reposRes.ok ? await reposRes.json() : [];

        const langs: Record<string, number> = {};
        let totalStars = 0;
        let totalForks = 0;

        for (const repo of repos) {
          totalStars += repo.stargazers_count ?? 0;
          totalForks += repo.forks_count ?? 0;
          if (repo.language) langs[repo.language] = (langs[repo.language] ?? 0) + 1;
        }

        const langTotal = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
        const topLanguages = Object.entries(langs)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([name, count]) => ({ name, percent: Math.round((count / langTotal) * 100) }));

        const topRepos = [...repos]
          .sort((a: { stargazers_count: number }, b: { stargazers_count: number }) => b.stargazers_count - a.stargazers_count)
          .slice(0, 4)
          .map((r: { name: string; stargazers_count: number; language: string | null }) => ({
            name: r.name,
            stars: r.stargazers_count,
            language: r.language,
          }));

        setStats({
          repos: user.public_repos ?? repos.length,
          stars: totalStars,
          forks: totalForks,
          followers: user.followers ?? 0,
          topLanguages,
          topRepos,
        });
        setStatus("live");
      } catch {
        setStats(fallbackStats);
        setStatus("offline");
      }
    }

    load();
  }, []);

  const data = stats ?? fallbackStats;

  return (
    <div className="github-intel">
      <div className="github-status">
        {status === "loading" ? "Conectando con GitHub…" : status === "live" ? "● En vivo · rigohc" : "○ Sin conexión a GitHub"}
      </div>

      <div className="github-metrics">
        {[
          { label: "Repos públicos", value: data.repos },
          { label: "Stars", value: data.stars },
          { label: "Forks", value: data.forks },
          { label: "Followers", value: data.followers },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            className="github-metric"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <strong>{m.value}</strong>
            <span>{m.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="github-panels">
        <div className="github-panel">
          <h4>Lenguajes</h4>
          {data.topLanguages.map((lang) => (
            <div key={lang.name} className="lang-bar">
              <span>{lang.name}</span>
              <div className="lang-track"><motion.div className="lang-fill" initial={{ width: 0 }} whileInView={{ width: `${lang.percent}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} /></div>
              <em>{lang.percent}%</em>
            </div>
          ))}
        </div>
        {data.topRepos.length > 0 ? (
          <div className="github-panel">
            <h4>Top repos</h4>
            {data.topRepos.map((repo) => (
              <div key={repo.name} className="repo-row">
                <span>{repo.name}</span>
                <em>★ {repo.stars} · {repo.language ?? "—"}</em>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <style>{`
        .github-intel { display: grid; gap: 16px; }
        .github-status { color: var(--text-faint); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
        .github-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }
        .github-metric {
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: 16px;
          background: var(--bg-card);
          text-align: center;
        }
        .github-metric strong {
          display: block;
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 800;
          background: var(--gradient);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .github-metric span { color: var(--text-faint); font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
        .github-panels { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .github-panel {
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 18px;
          background: var(--bg-card);
        }
        .github-panel h4 { margin: 0 0 12px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); }
        .lang-bar { display: grid; grid-template-columns: 72px 1fr 36px; gap: 8px; align-items: center; margin-bottom: 8px; font-size: 11px; }
        .lang-track { height: 6px; border-radius: 999px; background: var(--bg-soft); overflow: hidden; }
        .lang-fill { height: 100%; background: var(--gradient); border-radius: 999px; }
        .lang-bar em, .repo-row em { color: var(--text-faint); font-style: normal; font-size: 9px; }
        .repo-row { display: flex; justify-content: space-between; gap: 8px; padding: 4px 0; font-size: 11px; border-bottom: 1px solid var(--line); }
        @media (max-width: 720px) {
          .github-metrics { grid-template-columns: repeat(2, 1fr); }
          .github-panels { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
