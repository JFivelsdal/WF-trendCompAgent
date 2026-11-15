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

| Your file | Save it as |
|---|---|
| Outdoor Rug Trend Report FC.html | reports/outdoor-rug-trend-report.html |
| Agent Wayfair Competitor Analysis Report - Outdoor Rug FC.html | reports/competitor-analysis-report.html |
| AI Insights & Content Report _ Wayfair Outdoor Rug FC.html | reports/ai-insights-content-report.html |
| Outdoor Rug - Category Intelligence Dashboard FC.html | reports/category-intelligence-dashboard.html |
| Market Trend Agent (Market Facts) Ud.json | workflows/market-trend-agent.json |
| Wayfair Competitor Monitoring Agent Ud Final.json | workflows/competitor-monitoring-agent.json |
| Marketing Synthesis Report Agent FC.json | workflows/marketing-synthesis-agent.json |
| HTML Dashboard Builder FC.json | workflows/html-dashboard-builder.json |

## Publish

1. Create a repo on GitHub and upload everything in this folder (keep the folder structure).
2. Repo Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. After a minute the site is at `https://<your-username>.github.io/<repo-name>/`.

## Test on your computer first

Opening index.html by double-click will not load the workflows (browsers block that). Run this in the folder instead and open http://localhost:8000

```
python -m http.server 8000
```

## Check the JSON before you make the repo public

n8n exports can contain API keys, tokens, or private URLs typed into nodes. The workflow viewer hides values under keys like "apiKey", "token", or "authorization", but the downloadable JSON file is not redacted. Search first:

```
grep -rniE "api[_-]?key|bearer|authorization|token|secret|password|sk-" workflows/
```

## Add another report or workflow

Drop the file in `reports/` or `workflows/` and add one entry to `data.js`. Set `related` to link a workflow and its output to each other.
