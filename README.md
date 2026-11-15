# WF-trendCompAgent

Wayfair rug market and competitor agents: HTML outputs plus the n8n workflows that build them. Hosted on GitHub Pages.

## Files

```
index.html              hub page (cards, tabs, search)
report.html             opens one HTML output inside the site frame
workflow.html           draws one n8n workflow from its JSON
workflow-render.js      the code that draws the workflow
data.js                 the list of everything on the site (edit this to add items)
style.css
reports/                your 4 HTML outputs
workflows/              your 4 n8n JSON files
```

## Put your files in these names

GitHub Pages is case-sensitive and spaces/parentheses in names cause broken links, so rename the files like this:

| File | Report Type / Workflow |
|---|---|
| reports/outdoor-rug-trend-report.html | Market Trend Report |
| reports/competitor-analysis-report.html | Competitor Analysis Report|
| reports/ai-insights-content-report.html | Market Synthesis Report |
| reports/category-intelligence-dashboard.html | Rug Market Dashboard |
| workflows/market-trend-agent.json | Market Trend Workflow |
| workflows/competitor-monitoring-agent.json | Competitor Analysis Workflow |
| workflows/marketing-synthesis-agent.json | Market Synthesis Workflow  |
| workflows/html-dashboard-builder.json | Dashboard Builder Workflow  |

