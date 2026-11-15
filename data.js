// ONE place to list everything on the site. To add an item, add an entry here and drop the file in reports/ or workflows/.
// "file" is the path inside the repo. "related" links a workflow to the report it produces (and vice versa).
const HUB = {
  reports: [
    {
      id: "outdoor-rug-trend-report",
      title: "Outdoor Rug Trend Report",
      kind: "Market Trend",
      category: "Outdoor Rugs",
      description: "Emerging consumer preferences, seasonal style shifts, color palettes, and material trends across outdoor rugs.",
      file: "reports/outdoor-rug-trend-report.html",
      related: "market-trend-agent"
    },
    {
      id: "competitor-analysis-report",
      title: "Competitor Analysis Report",
      kind: "Competitor Analysis",
      category: "Outdoor Rugs",
      description: "Wayfair vs Amazon vs Walmart: pricing positioning, assortment, ratings, and whitespace opportunities.",
      file: "reports/competitor-analysis-report.html",
      related: "competitor-monitoring-agent"
    },
    {
      id: "ai-insights-content-report",
      title: "AI Insights & Content Report",
      kind: "Content Strategy",
      category: "Outdoor Rugs",
      description: "Combines the trend and competitor reports into content ideas, campaigns, captions, and priorities.",
      file: "reports/ai-insights-content-report.html",
      related: "marketing-synthesis-agent"
    },
    {
      id: "category-intelligence-dashboard",
      title: "Category Intelligence Dashboard",
      kind: "Dashboard",
      category: "Outdoor Rugs",
      description: "Executive view combining product performance metrics, trend signals, and competitor takeaways.",
      file: "reports/category-intelligence-dashboard.html",
      related: "html-dashboard-builder"
    }
  ],
  workflows: [
    {
      id: "market-trend-agent",
      title: "Market Trend Agent",
      kind: "n8n Workflow",
      category: "Market facts",
      description: "Builds the market trend report: market size, growth, and trend signals for a rug category.",
      file: "workflows/market-trend-agent.json",
      related: "outdoor-rug-trend-report"
    },
    {
      id: "competitor-monitoring-agent",
      title: "Competitor Monitoring Agent",
      kind: "n8n Workflow",
      category: "Competitors",
      description: "Pulls Wayfair, Amazon, and Walmart products and writes the competitor analysis report.",
      file: "workflows/competitor-monitoring-agent.json",
      related: "competitor-analysis-report"
    },
    {
      id: "marketing-synthesis-agent",
      title: "Marketing Synthesis Report Agent",
      kind: "n8n Workflow",
      category: "Content strategy",
      description: "Reads the trend and competitor reports, calls a local LLM, and produces the AI Insights & Content Report.",
      file: "workflows/marketing-synthesis-agent.json",
      related: "ai-insights-content-report"
    },
    {
      id: "html-dashboard-builder",
      title: "HTML Dashboard Builder",
      kind: "n8n Workflow",
      category: "Dashboard",
      description: "Turns the trend and competitor reports into the category dashboard page.",
      file: "workflows/html-dashboard-builder.json",
      related: "category-intelligence-dashboard"
    }
  ]
};
HUB.find = id => HUB.reports.concat(HUB.workflows).find(x => x.id === id);
