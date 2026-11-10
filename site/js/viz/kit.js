// Small drawing kit shared by every visualisation. All visuals are hand built.
export const NS = 'http://www.w3.org/2000/svg';

export function s(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}
export function text(parent, x, y, str, attrs = {}) {
  const t = s('text', { x, y, class: 'lbl', fill: 'var(--ink-2)', ...attrs }, parent);
  t.textContent = str;
  return t;
}

export function inr(n, digits = 1) {
  const sign = n < 0 ? '−' : '';
  const a = Math.abs(n);
  if (a >= 1e7) return `${sign}₹${(a / 1e7).toFixed(a >= 1e9 ? 0 : digits)} cr`;
  if (a >= 1e5) return `${sign}₹${(a / 1e5).toFixed(digits)} L`;
  return `${sign}₹${Math.round(a).toLocaleString('en-IN')}`;
}
export const pct = (x, d = 0) => `${(x * 100).toFixed(d)}%`;

export function lin(d0, d1, r0, r1) {
  const f = (v) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0);
  f.invert = (p) => d0 + ((p - r0) / (r1 - r0)) * (d1 - d0);
  return f;
}
export function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}

// Axes + grid for a chart area.
export function frame(svg, { W, H, m, x, y, xTicks, yTicks, xFmt = (v) => v, yFmt = (v) => v, xLabel, yLabel }) {
  const g = s('g', {}, svg);
  const grid = s('g', { class: 'grid' }, g);
  const ax = s('g', { class: 'ax' }, g);
  yTicks.forEach((t) => {
    s('line', { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t) }, grid);
    text(ax, m.l - 8, y(t) + 4, yFmt(t), { 'text-anchor': 'end', class: '' });
  });
  xTicks.forEach((t) => text(ax, x(t), H - m.b + 18, xFmt(t), { 'text-anchor': 'middle', class: '' }));
  s('line', { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b }, ax);
  if (xLabel) text(ax, (m.l + W - m.r) / 2, H - 4, xLabel, { 'text-anchor': 'middle', class: '' });
  if (yLabel) text(ax, m.l, m.t - 10, yLabel, { 'text-anchor': 'start', class: '' });
  return g;
}

export function path(points) {
  return points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('');
}

export function ticks(max) {
  const nice = (v) => { const p = Math.pow(10, Math.floor(Math.log10(v))); return [1, 2, 2.5, 5, 10].some((m) => Math.abs(v / p - m) < 1e-9); };
  const n = [4, 5, 2].find((k) => nice(max / k)) || 4;
  return Array.from({ length: n + 1 }, (_, i) => (max * i) / n);
}

// Base class: builds the card, slider controls and a redraw loop.
export class Viz extends HTMLElement {
  connectedCallback() {
    if (this._init) return;
    this._init = true;
    this.classList.add('viz');
    this.setup();
    this.draw();
  }
  card(title, { W = 640, H = 300 } = {}) {
    this.innerHTML = '';
    if (title) { const t = document.createElement('div'); t.className = 'viz-title'; t.textContent = title; this.appendChild(t); }
    this.svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': title || 'Interactive chart' }, this);
    this.W = W; this.H = H;
    this.controls = document.createElement('div'); this.controls.className = 'controls'; this.appendChild(this.controls);
    this.readout = document.createElement('div'); this.readout.className = 'readout'; this.appendChild(this.readout);
    this.state = {};
  }
  slider(key, label, { min, max, step = 1, value, fmt = (v) => v }) {
    const l = document.createElement('label');
    l.innerHTML = `<span>${label} <span class="val"></span></span>`;
    const i = document.createElement('input');
    Object.assign(i, { type: 'range', min, max, step, value });
    const val = l.querySelector('.val');
    const set = () => { this.state[key] = Number(i.value); val.textContent = fmt(Number(i.value)); };
    i.addEventListener('input', () => { set(); this.draw(); });
    set();
    l.appendChild(i);
    this.controls.appendChild(l);
  }
  segs(key, options, value) {
    const row = document.createElement('div'); row.className = 'toggle-row';
    this.state[key] = value;
    options.forEach(([v, label]) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'seg' + (v === value ? ' on' : ''); b.textContent = label;
      b.onclick = () => { this.state[key] = v; row.querySelectorAll('.seg').forEach((x) => x.classList.remove('on')); b.classList.add('on'); this.draw(); };
      row.appendChild(b);
    });
    this.insertBefore(row, this.controls);
  }
  caption(str) { const c = document.createElement('div'); c.className = 'caption'; c.innerHTML = str; this.appendChild(c); }
  clear() { while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild); }
  read(items) { this.readout.innerHTML = items.map(([k, v]) => `<span>${k} <b>${v}</b></span>`).join(''); }
}
