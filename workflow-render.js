// Draws an n8n workflow (exported JSON) as an SVG. No dependencies.
(function (root) {
  const W = 205, H = 62, GAP = 36;
  const COLORS = { trigger: '#00857a', code: '#7f187f', http: '#2563eb', logic: '#d97706', ai: '#7c3aed', data: '#475569', other: '#64748b' };
  const LABELS = { trigger: 'Trigger', code: 'Code', http: 'HTTP / API', logic: 'Logic', ai: 'AI', data: 'Data / files', other: 'Other' };

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function shortType(t) { return String(t || '').split('.').pop().replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase()); }
  function category(t) {
    t = String(t || '').toLowerCase();
    if (/trigger|webhook|schedule|cron|form/.test(t) && !/formdata/.test(t)) return 'trigger';
    if (/langchain|lmchat|agent|openai|anthropic|ollama|llm|embedding/.test(t)) return 'ai';
    if (/\.code$|function/.test(t)) return 'code';
    if (/httprequest|\.http|graphql/.test(t)) return 'http';
    if (/\.if$|switch|merge|filter|splitinbatches|wait|noop|loop/.test(t)) return 'logic';
    if (/set$|converttofile|extractfromfile|readwrite|spreadsheet|sqlite|postgres|mysql|aggregate|itemlists|html|markdown|xml|datetime|summarize|sort|limit|removeduplicates/.test(t)) return 'data';
    return 'other';
  }
  function clip(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function wrap(text, maxChars, maxLines) {
    const out = []; let line = '';
    String(text).replace(/[#*_`>]/g, '').split(/\s+/).forEach(w => {
      if ((line + ' ' + w).trim().length > maxChars) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
    });
    if (line) out.push(line);
    return out.length > maxLines ? out.slice(0, maxLines).concat('…') : out;
  }

  // Spread positions out until no two node boxes overlap (some exports are tightly packed)
  function scaleFor(nodes) {
    const real = nodes.filter(n => !n.sticky);
    for (let s = 1; s <= 3; s += 0.1) {
      let ok = true;
      for (let i = 0; i < real.length && ok; i++) for (let j = i + 1; j < real.length; j++) {
        const dx = Math.abs(real[i].x - real[j].x) * s, dy = Math.abs(real[i].y - real[j].y) * s;
        if (dx < W + 24 && dy < H + 24) { ok = false; break; }
      }
      if (ok) return s;
    }
    return 3;
  }

  function build(wf) {
    const list = (wf.nodes || []).map(n => ({
      raw: n, name: n.name, type: n.type, x: (n.position || [0, 0])[0], y: (n.position || [0, 0])[1],
      sticky: /stickyNote$/.test(n.type || ''), disabled: !!n.disabled
    }));
    const s = scaleFor(list);
    list.forEach(n => {
      n.x = Math.round(n.x * s); n.y = Math.round(n.y * s);
      if (n.sticky) {
        n.w = Math.round((n.raw.parameters.width || 240) * s); n.h = Math.round((n.raw.parameters.height || 160) * s);
      } else { n.w = W; n.h = H; n.cat = category(n.type); }
    });
    const byName = {}; list.forEach(n => byName[n.name] = n);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    list.forEach(n => { minX = Math.min(minX, n.x); minY = Math.min(minY, n.y); maxX = Math.max(maxX, n.x + n.w); maxY = Math.max(maxY, n.y + n.h); });
    if (!isFinite(minX)) { minX = minY = 0; maxX = 400; maxY = 200; }
    const pad = 60, vb = { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };

    let edges = '', stickies = '', nodes = '';
    list.filter(n => n.sticky).forEach(n => {
      const lines = wrap(n.raw.parameters.content || '', Math.max(14, Math.floor(n.w / 7.2)), Math.max(1, Math.floor((n.h - 20) / 17)));
      stickies += `<g><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="8" fill="#fff8db" stroke="#f0d36b"/>` +
        lines.map((l, i) => `<text x="${n.x + 12}" y="${n.y + 26 + i * 17}" font-size="12" fill="#7a5c00">${esc(l)}</text>`).join('') + '</g>';
    });

    // connections
    const conns = wf.connections || {};
    Object.keys(conns).forEach(src => {
      const a = byName[src]; if (!a) return;
      Object.keys(conns[src]).forEach(type => {
        (conns[src][type] || []).forEach((outs, outIdx) => {
          (outs || []).forEach(c => {
            const b = byName[c.node]; if (!b) return;
            if (type.startsWith('ai_')) {
              // sub-nodes (models, tools, memory) hang below the agent that uses them
              const x1 = a.x + a.w / 2, y1 = a.y, x2 = b.x + b.w / 2, y2 = b.y + b.h, dy = Math.max(40, Math.abs(y2 - y1) / 2);
              edges += `<path d="M${x1},${y1} C${x1},${y1 - dy} ${x2},${y2 + dy} ${x2},${y2}" fill="none" stroke="#7c3aed" stroke-width="1.8" stroke-dasharray="5 4"/>`;
              edges += `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2}" font-size="10" fill="#7c3aed" text-anchor="middle">${esc(type.replace('ai_', ''))}</text>`;
            } else {
              const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2;
              const dx = Math.max(45, Math.abs(x2 - x1) / 2);
              edges += `<path d="M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}" fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow)"/>`;
              const isIf = /\.if$/.test(a.type || '');
              const lab = isIf ? (outIdx === 0 ? 'true' : 'false') : (/switch/i.test(a.type || '') ? 'out ' + outIdx : '');
              if (lab) edges += `<text x="${x1 + 12}" y="${y1 + (outIdx ? 14 : -6)}" font-size="10" fill="#64748b">${lab}</text>`;
            }
          });
        });
      });
    });

    list.filter(n => !n.sticky).forEach(n => {
      const col = COLORS[n.cat];
      nodes += `<g class="node" data-name="${esc(n.name)}" opacity="${n.disabled ? .45 : 1}" tabindex="0" role="button" aria-label="${esc(n.name)}">` +
        `<rect class="box" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="10" fill="#fff" stroke="#d6dae3" stroke-width="1.5"/>` +
        `<rect x="${n.x}" y="${n.y}" width="7" height="${n.h}" rx="3" fill="${col}"/>` +
        `<text x="${n.x + 20}" y="${n.y + 26}" font-size="13" font-weight="700" fill="#1e293b">${esc(clip(n.name, 25))}</text>` +
        `<text x="${n.x + 20}" y="${n.y + 45}" font-size="11" fill="#64748b">${esc(clip(shortType(n.type), 26))}${n.disabled ? ' (off)' : ''}</text></g>`;
    });

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif">` +
      `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/></marker></defs>` +
      stickies + edges + nodes + '</svg>';
    return { svg, viewBox: vb, categoriesUsed: [...new Set(list.filter(n => !n.sticky).map(n => n.cat))], count: list.filter(n => !n.sticky).length };
  }

  const api = { build, COLORS, LABELS, shortType };
  if (typeof module !== 'undefined') module.exports = api; else root.WFRender = api;
})(typeof window !== 'undefined' ? window : globalThis);
