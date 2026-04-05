import { useMemo, useState } from "react";
import { analyzeRepository } from "./api";

function Section({ title, children, subtitle }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {subtitle ? <p className="muted section-subtitle">{subtitle}</p> : null}
      {children}
    </section>
  );
}

function List({ items }) {
  if (!items?.length) {
    return <p className="muted">No items found.</p>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function cleanDisplayText(value) {
  if (!value) return "";
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function FlowchartCanvas({ graph }) {
  const width = 980;
  const height = 460;

  const positioned = useMemo(() => {
    const nodes = graph?.nodes || [];
    const edges = graph?.edges || [];
    if (!nodes.length) {
      return { nodes: [], edges: [], width, height };
    }

    const pos = new Map();

    if (graph.layout === "pipeline") {
      const columns = ["root", "framework", "module", "dependency", "critical"];
      const groups = new Map(columns.map((col) => [col, []]));

      nodes.forEach((node) => {
        const type = columns.includes(node.type) ? node.type : "module";
        groups.get(type).push(node);
      });

      columns.forEach((column, colIndex) => {
        const group = groups.get(column);
        group.forEach((node, rowIndex) => {
          pos.set(node.id, {
            ...node,
            x: 70 + colIndex * 180,
            y: 40 + rowIndex * 78
          });
        });
      });
    } else {
      const root = nodes.find((node) => node.type === "root") || nodes[0];
      const others = nodes.filter((node) => node.id !== root.id);
      pos.set(root.id, { ...root, x: width / 2 - 80, y: height / 2 - 24 });

      const radius = 160;
      others.forEach((node, index) => {
        const angle = (2 * Math.PI * index) / Math.max(others.length, 1);
        const x = width / 2 + radius * Math.cos(angle) - 75;
        const y = height / 2 + radius * Math.sin(angle) - 20;
        pos.set(node.id, { ...node, x, y });
      });
    }

    return {
      nodes: [...pos.values()],
      edges,
      width,
      height
    };
  }, [graph]);

  if (!positioned.nodes.length) {
    return <p className="muted">Unable to build flowchart for this repository.</p>;
  }

  return (
    <div className="flowchart-shell">
      <svg viewBox={`0 0 ${positioned.width} ${positioned.height}`} className="flowchart-svg" role="img">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
        </defs>

        {positioned.edges.map((edge, index) => {
          const from = positioned.nodes.find((node) => node.id === edge.from);
          const to = positioned.nodes.find((node) => node.id === edge.to);
          if (!from || !to) return null;

          return (
            <line
              key={`${edge.from}-${edge.to}-${index}`}
              x1={from.x + 75}
              y1={from.y + 22}
              x2={to.x + 75}
              y2={to.y + 22}
              className="flow-line"
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {positioned.nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={150}
              height={44}
              rx={9}
              className={`flow-node node-${node.type || "module"}`}
            />
            <text x={node.x + 75} y={node.y + 26} textAnchor="middle" className="node-text small">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function TabButton({ active, label, onClick }) {
  return (
    <button type="button" className={`tab-btn ${active ? "active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

function MiniBarChart({ title, data, valueKey, labelKey }) {
  const maxValue = Math.max(1, ...data.map((item) => item[valueKey] || 0));

  return (
    <div className="graph-card">
      <h3>{title}</h3>
      {data.length ? (
        <div className="bars">
          {data.map((item, index) => (
            <div key={`${item[labelKey]}-${index}`} className="bar-row" title={`${item[labelKey]}: ${item[valueKey]}`}>
              <span className="bar-label">{item[labelKey]}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${((item[valueKey] || 0) / maxValue) * 100}%` }} />
              </div>
              <span className="bar-value">{item[valueKey] || 0}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">No graph data available.</p>
      )}
    </div>
  );
}

function ContributorList({ contributors }) {
  return (
    <div className="graph-card">
      <h3>Top Contributors</h3>
      {contributors?.length ? (
        <div className="contributors-list">
          {contributors.map((contributor) => (
            <a
              key={contributor.login}
              href={contributor.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="contributor-item"
            >
              <img src={contributor.avatarUrl} alt={contributor.login} />
              <div>
                <strong>{contributor.login}</strong>
                <span>{contributor.contributions} contributions</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="muted">Contributor data unavailable.</p>
      )}
    </div>
  );
}

function ContributionHeatmap({ weeks }) {
  const rows = [0, 1, 2, 3, 4, 5, 6];
  const columns = Math.max(1, weeks?.length || 0);

  return (
    <div className="graph-card compact-card">
      <h3>Contribution Activity</h3>
      {weeks?.length ? (
        <div className="heatmap-center">
          <div
            className="heatmap-grid"
            role="img"
            aria-label="Contribution heatmap"
            style={{ gridTemplateColumns: `repeat(${columns}, 12px)` }}
          >
            {rows.map((row) =>
              weeks.map((week, col) => {
                const day = week.days?.find((item) => item.day === row);
                const level = day?.level ?? 0;
                return (
                  <span
                    key={`${row}-${col}`}
                    className={`heat-cell level-${level}`}
                    data-tooltip={day ? `${day.count} contributions on ${day.date}` : "0 contributions"}
                    title={day ? `${day.count} contributions on ${day.date}` : "0 contributions"}
                  />
                );
              })
            )}
          </div>
        </div>
      ) : (
        <p className="muted">No contribution graph data available.</p>
      )}
    </div>
  );
}

function RepositoryPulseCard({ stats }) {
  const commits = stats?.weeklyCommits || [];
  const pushes = stats?.weeklyPushes || [];
  const prs = stats?.pullRequestStats || {};

  const totalCommits = commits.reduce((sum, item) => sum + (item.commits || 0), 0);
  const avgWeeklyCommits = commits.length ? (totalCommits / commits.length).toFixed(1) : "0.0";
  const bestWeek = commits.reduce(
    (best, item) => ((item.commits || 0) > (best.commits || 0) ? item : best),
    { week: "-", commits: 0 }
  );
  const mergedRate = prs.total ? Math.round(((prs.merged || 0) / prs.total) * 100) : 0;
  const activePushWeeks = pushes.filter((item) => (item.pushes || 0) > 0).length;

  return (
    <div className="graph-card compact-card pulse-card">
      <h3>Repository Pulse</h3>
      <div className="pulse-grid">
        <div>
          <span>Avg Weekly Commits</span>
          <strong>{avgWeeklyCommits}</strong>
        </div>
        <div>
          <span>Best Week</span>
          <strong>{bestWeek.commits}</strong>
        </div>
        <div>
          <span>PR Merge Rate</span>
          <strong>{mergedRate}%</strong>
        </div>
        <div>
          <span>Active Push Weeks</span>
          <strong>{activePushWeeks}</strong>
        </div>
      </div>
      <p className="muted pulse-footnote">
        Peak week: {bestWeek.week} with {bestWeek.commits} commits.
      </p>
    </div>
  );
}

export default function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const healthScore = useMemo(() => {
    if (!result) return null;
    if (Number.isFinite(result.healthScore)) return result.healthScore;
    return 70;
  }, [result]);

  const projectAgenda = useMemo(() => {
    if (!result) return "";
    if (result.projectPurpose?.trim()) return cleanDisplayText(result.projectPurpose);
    if (result.summary?.trim()) return cleanDisplayText(result.summary);
    return "This repository contains application code and configuration for delivering a software product.";
  }, [result]);

  const fallbackGraph = useMemo(() => {
    if (!result) return null;
    const fallbackNodes = [];
    fallbackNodes.push({ id: "repo", label: result.repoName || "Repository", type: "root" });

    (result.frameworks || []).slice(0, 3).forEach((item, index) => {
      fallbackNodes.push({ id: `framework-${index}`, label: item, type: "framework" });
    });

    (result.modules || []).slice(0, 4).forEach((item, index) => {
      fallbackNodes.push({ id: `module-${index}`, label: item, type: "module" });
    });

    if ((result.criticalIssues || []).length) {
      fallbackNodes.push({ id: "security", label: "Security Review", type: "critical" });
    }

    const fallbackEdges = [];
    fallbackNodes.forEach((node) => {
      if (node.id !== "repo") fallbackEdges.push({ from: "repo", to: node.id });
    });

    return {
      layout: "hub",
      nodes: fallbackNodes,
      edges: fallbackEdges
    };
  }, [result]);

  const flowGraph = result?.flowchartGraph || fallbackGraph;

  async function handleAnalyze(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await analyzeRepository(repoUrl.trim());
      setResult(data);
      setActiveTab("overview");
    } catch (requestError) {
      setError(requestError.message || "Unable to analyze this repository right now.");
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "stack", label: "Stack" },
    { id: "modules", label: "Modules" },
    { id: "issues", label: "Issues" },
    { id: "improve", label: "Improve" }
  ];

  function renderTabContent() {
    if (!result) return null;

    if (activeTab === "overview") {
      return (
        <Section title="Project Overview" subtitle="What this project does and its current health.">
          <p>{projectAgenda}</p>
          <div className="kpis">
            <div>
              <span>Health Score</span>
              <strong>{healthScore}/100</strong>
            </div>
            <div>
              <span>Frameworks</span>
              <strong>{result.frameworks?.length || 0}</strong>
            </div>
            <div>
              <span>Modules</span>
              <strong>{result.modules?.length || 0}</strong>
            </div>
          </div>
          <h3>Repository Summary</h3>
          <p>{cleanDisplayText(result.summary)}</p>
          <h3>Quick Highlights</h3>
          <List items={result.overviewHighlights} />
          <h3>Repository Key Files</h3>
          <List items={result.keyFiles} />
        </Section>
      );
    }

    if (activeTab === "stack") {
      return (
        <Section title="Tech Stack">
          <h3>Frameworks</h3>
          <List items={result.frameworks} />
          <h3>Dependencies</h3>
          <List items={(result.dependencies || []).slice(0, 30)} />
          <h3>Stack Insights</h3>
          <List items={result.stackInsights} />
        </Section>
      );
    }

    if (activeTab === "modules") {
      return (
        <Section title="Module Breakdown">
          <List items={result.modules} />
          <h3>Module Insights</h3>
          <List items={result.moduleInsights} />
        </Section>
      );
    }

    if (activeTab === "issues") {
      return (
        <Section title="Issues and Risks">
          <h3>Potential Issues</h3>
          <List items={result.issues} />
          <h3>Version or Package Conflicts</h3>
          <List items={result.versionConflicts} />
          <h3>Critical Security Issues</h3>
          <List items={result.criticalIssues} />
          <h3>Future Risk Forecast</h3>
          <List items={result.riskForecast} />
          <h3>Risk Summary</h3>
          <p className="muted">
            Total findings: {(result.issues?.length || 0) + (result.versionConflicts?.length || 0) +
              (result.criticalIssues?.length || 0)}
          </p>
          <h3>Issue Insights</h3>
          <List items={result.issueInsights} />
        </Section>
      );
    }

    if (activeTab === "improve") {
      return (
        <Section title="Improvement Suggestions">
          <h3>Improvement Tips</h3>
          <List items={result.improvements} />
          <h3>Code Suggestions</h3>
          <List items={result.codeSuggestions} />
          <h3>Extra Insights</h3>
          <List items={result.uniqueInsights} />
          <h3>Action Priority</h3>
          <p className="muted">
            Start with critical security issues, then version conflicts, then performance improvements.
          </p>
        </Section>
      );
    }

    return (
      <Section title="Project Overview" subtitle="Default overview section.">
        <p>{projectAgenda}</p>
      </Section>
    );
  }

  return (
    <div className="app-shell">
      <main>
        <header className="hero">
          <p className="badge">Code Summerizer</p>
          <h1>Repository Intelligence</h1>
          <p>Analyze architecture, stack, risks, and improvements from a GitHub link.</p>
          <form onSubmit={handleAnalyze} className="analyze-form">
            <input
              type="url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/owner/repository"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Summarize"}
            </button>
          </form>
          {error ? <p className="error">{error}</p> : null}
        </header>

        {result ? (
          <div className="dashboard-grid">
            <div className="workspace-panel">
              <div className="tabs-row">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    label={tab.label}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
              </div>
              <div className="tab-content">{renderTabContent()}</div>
            </div>

            <aside className="analytics-panel">
              <div className="graph-card metrics-card">
                <h3>GitHub Snapshot</h3>
                <div className="metric-grid">
                  <div>
                    <span>Stars</span>
                    <strong>{result.githubStats?.stars || 0}</strong>
                  </div>
                  <div>
                    <span>Forks</span>
                    <strong>{result.githubStats?.forks || 0}</strong>
                  </div>
                  <div>
                    <span>Watchers</span>
                    <strong>{result.githubStats?.watchers || 0}</strong>
                  </div>
                  <div>
                    <span>Repo Age</span>
                    <strong>{result.githubStats?.repoAgeDays || 0}d</strong>
                  </div>
                </div>
              </div>

              <MiniBarChart
                title="Weekly Commits"
                data={result.githubStats?.weeklyCommits || []}
                valueKey="commits"
                labelKey="week"
              />

              <MiniBarChart
                title="Push Frequency"
                data={result.githubStats?.weeklyPushes || []}
                valueKey="pushes"
                labelKey="week"
              />

              <div className="dual-graph-row">
                <ContributionHeatmap weeks={result.githubStats?.contributionHeatmap || []} />
                <RepositoryPulseCard stats={result.githubStats} />
              </div>

              <div className="graph-card">
                <h3>Repository Flowchart</h3>
                <FlowchartCanvas graph={flowGraph} />
              </div>

              <div className="graph-card">
                <h3>Pull Request Status</h3>
                <ul>
                  <li>Open: {result.githubStats?.pullRequestStats?.open || 0}</li>
                  <li>Closed: {result.githubStats?.pullRequestStats?.closed || 0}</li>
                  <li>Merged: {result.githubStats?.pullRequestStats?.merged || 0}</li>
                  <li>Total sampled: {result.githubStats?.pullRequestStats?.total || 0}</li>
                </ul>
                <h3>Activity Insights</h3>
                <List items={result.activityInsights} />
              </div>

              <ContributorList contributors={result.githubStats?.topContributors || []} />
            </aside>
          </div>
        ) : (
          <section className="card preview-card">
            <h2>How It Works</h2>
            <ul>
              <li>Paste a GitHub repository URL.</li>
                  <li>Switch tabs to view stack, modules, issues, and recommendations.</li>
              <li>Track contributors, commit trends, and pull request activity in side graphs.</li>
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
