// Interactive visualisations for the Wealth, leverage and judgment course.
import { Viz, s, text, inr, pct, lin, niceMax, frame, path, ticks } from './kit.js';

const C = { a: 'var(--accent)', w: 'var(--warm)', g: 'var(--gold)', m: 'var(--muted)', l: 'var(--line-2)', ink: 'var(--ink)' };

/* 1. The sleep test: what keeps paying when you stop working? */
class SleepTest extends Viz {
  setup() {
    this.card('The sleep test', { W: 640, H: 250 });
    this.segs('mode', [['awake', 'Both working'], ['asleep', 'Both stop working for a year']], 'awake');
    this.controls.remove();
    this.people = [
      { name: 'Priya, consultant', streams: [['Consulting fees', 30e5, true]] },
      { name: 'Kabir, studio owner', streams: [['Salary', 8e5, true], ['Studio profits', 14e5, false], ['Rent', 3e5, false], ['Funds', 1e5, false]] },
    ];
    this.caption('Bars show yearly income. Orange needs the person’s time. Green arrives whether they work or not: Kabir’s share of studio profits, rent from a flat, and index fund dividends. Wealth is whatever is still standing when you stop.');
  }
  draw() {
    this.clear();
    const asleep = this.state.mode === 'asleep';
    const x = lin(0, 30e5, 170, 610);
    this.people.forEach((p, i) => {
      const y = 40 + i * 100;
      text(this.svg, 0, y + 22, p.name, { fill: 'var(--ink)', 'font-size': 14 });
      let cx = 170, total = 0;
      p.streams.forEach(([label, v, labour]) => {
        const val = asleep && labour ? 0 : v;
        const w = x(val) - 170;
        const r = s('rect', { x: cx, y, width: Math.max(0, w), height: 34, rx: 4, fill: labour ? C.w : C.a, opacity: 0.85 }, this.svg);
        r.style.transition = 'width .6s ease, x .6s ease';
        if (w > label.length * 6.5 + 10) text(this.svg, cx + 6, y + 21, label, { fill: '#fff', 'font-size': 11 });
        cx += w; total += val;
      });
      text(this.svg, 170, y + 56, `${inr(total)} a year${asleep ? ' while not working' : ''}`, { fill: 'var(--ink-2)' });
    });
    s('line', { x1: 170, x2: 170, y1: 30, y2: 200, stroke: C.l }, this.svg);
    const kab = asleep ? 18e5 : 26e5, pri = asleep ? 0 : 30e5;
    this.read([['Priya', inr(pri)], ['Kabir', inr(kab)], ['Who is wealthier?', asleep ? 'Kabir, clearly' : 'Looks like Priya…']]);
  }
}

/* 2. Renting time vs owning equity */
class TimeEquity extends Viz {
  setup() {
    this.card('Renting your time vs owning a piece', { W: 640, H: 320 });
    this.slider('rate', 'Your hourly rate', { min: 500, max: 10000, step: 250, value: 2000, fmt: (v) => inr(v) });
    this.slider('hours', 'Hours a week', { min: 10, max: 80, step: 5, value: 45, fmt: (v) => `${v} h` });
    this.slider('stake', 'Equity you own', { min: 0.5, max: 20, step: 0.5, value: 2, fmt: (v) => `${v}%` });
    this.slider('growth', 'Company value growth a year', { min: 0, max: 80, step: 5, value: 35, fmt: (v) => `${v}%` });
    this.caption('Company starts at ₹20 cr. Wage line assumes 48 working weeks a year. The dashed line is the most you could earn by working 100 hours every week, the hard ceiling on renting time.');
  }
  draw() {
    this.clear();
    const { rate, hours, stake, growth } = this.state;
    const W = this.W, H = this.H, m = { l: 64, r: 20, t: 28, b: 40 };
    const wage = (t) => rate * hours * 48 * t;
    const ceil = (t) => rate * 100 * 48 * t;
    const eq = (t) => 20e7 * Math.pow(1 + growth / 100, t) * (stake / 100);
    const maxY = niceMax(Math.max(ceil(10), eq(10), wage(10)));
    const x = lin(0, 10, m.l, W - m.r), y = lin(0, maxY, H - m.b, m.t);
    frame(this.svg, { W, H, m, x, y, xTicks: [0, 2, 4, 6, 8, 10], yTicks: ticks(maxY), xFmt: (v) => `yr ${v}`, yFmt: (v) => inr(v, 0), yLabel: 'Total value to you' });
    const pts = (f) => Array.from({ length: 41 }, (_, i) => { const t = i / 4; return [x(t), y(f(t))]; });
    s('path', { d: path(pts(ceil)), fill: 'none', stroke: C.w, 'stroke-width': 1.5, 'stroke-dasharray': '5 5', opacity: 0.6 }, this.svg);
    s('path', { d: path(pts(wage)), fill: 'none', stroke: C.w, 'stroke-width': 2.5 }, this.svg);
    s('path', { d: path(pts(eq)), fill: 'none', stroke: C.a, 'stroke-width': 2.5 }, this.svg);
    text(this.svg, x(10) - 4, y(wage(10)) - 8, 'Wages earned', { 'text-anchor': 'end', fill: C.w });
    text(this.svg, x(10) - 4, y(eq(10)) - 8, 'Value of your stake', { 'text-anchor': 'end', fill: C.a });
    this.read([['Wages after 10 yrs', inr(wage(10))], ['Stake after 10 yrs', inr(eq(10))], ['Wage ceiling', inr(ceil(10))]]);
  }
}

/* 3. Compounding */
class Compound extends Viz {
  setup() {
    this.card('Linear vs compound growth', { W: 640, H: 320 });
    this.segs('scale', [['lin', 'Normal scale'], ['log', 'Log scale']], 'lin');
    this.slider('p', 'Starting amount', { min: 1e5, max: 50e5, step: 1e5, value: 1e5, fmt: (v) => inr(v) });
    this.slider('r', 'Return a year', { min: 1, max: 30, step: 1, value: 12, fmt: (v) => `${v}%` });
    this.slider('n', 'Years', { min: 5, max: 40, step: 1, value: 30, fmt: (v) => `${v}` });
    this.caption('Simple growth adds the same amount every year. Compound growth adds a percentage of whatever you already have. Dots mark each doubling. On the log scale a compounding curve becomes a straight line, which is how you spot it in the wild.');
  }
  draw() {
    this.clear();
    const { p, r, n, scale } = this.state;
    const W = this.W, H = this.H, m = { l: 64, r: 20, t: 28, b: 40 };
    const comp = (t) => p * Math.pow(1 + r / 100, t);
    const simp = (t) => p * (1 + (r / 100) * t);
    const maxV = comp(n);
    const x = lin(0, n, m.l, W - m.r);
    let y, yt;
    if (scale === 'log') {
      const lo = Math.log10(p), hi = Math.log10(maxV) + 0.05;
      const yy = lin(lo, hi, H - m.b, m.t);
      y = (v) => yy(Math.log10(Math.max(v, p)));
      yt = []; for (let k = 0; ; k++) { const v = p * Math.pow(2, k); if (v > maxV * 1.05) break; yt.push(v); }
      if (yt.length > 7) yt = yt.filter((_, i) => i % Math.ceil(yt.length / 6) === 0);
    } else { const mx = niceMax(maxV); y = lin(0, mx, H - m.b, m.t); yt = ticks(mx); }
    const step = n <= 10 ? 1 : 5;
    const xt = []; for (let t = 0; t <= n; t += step) xt.push(t);
    frame(this.svg, { W, H, m, x, y, xTicks: xt, yTicks: yt, xFmt: (v) => `${v}`, yFmt: (v) => inr(v, 0), xLabel: 'years' });
    const pts = (f) => Array.from({ length: 101 }, (_, i) => { const t = (i / 100) * n; return [x(t), y(f(t))]; });
    s('path', { d: path(pts(simp)), fill: 'none', stroke: C.w, 'stroke-width': 2.5 }, this.svg);
    s('path', { d: path(pts(comp)), fill: 'none', stroke: C.a, 'stroke-width': 2.5 }, this.svg);
    const dt = Math.log(2) / Math.log(1 + r / 100);
    for (let k = 1; k * dt <= n; k++) s('circle', { cx: x(k * dt), cy: y(p * Math.pow(2, k)), r: 3.5, fill: C.a }, this.svg);
    text(this.svg, x(n) - 4, y(comp(n)) + 16, 'Compound', { 'text-anchor': 'end', fill: C.a });
    text(this.svg, x(n) - 4, y(simp(n)) - 8, 'Simple', { 'text-anchor': 'end', fill: C.w });
    this.read([['Simple', inr(simp(n))], ['Compound', inr(comp(n))], ['Doubles every', `${dt.toFixed(1)} yrs`], ['Rule of 72 says', `${(72 / r).toFixed(1)} yrs`]]);
  }
}

/* 4. The chessboard legend */
class Chessboard extends Viz {
  setup() {
    this.card('Grains of wheat on the chessboard', { W: 640, H: 300 });
    this.slider('sq', 'Fill up to square', { min: 1, max: 64, step: 1, value: 20 });
    this.caption('One grain on the first square, two on the second, four on the third, doubling each time. A grain of wheat weighs about 0.065 g. The world harvests very roughly 800 million tonnes of wheat a year.');
  }
  draw() {
    this.clear();
    const n = this.state.sq, size = 32, ox = 20, oy = 20;
    for (let i = 0; i < 64; i++) {
      const r = Math.floor(i / 8), c = i % 8;
      const on = i < n;
      const shade = on ? 0.25 + 0.75 * (i / 63) : 0;
      s('rect', { x: ox + c * size, y: oy + (7 - r) * size, width: size - 2, height: size - 2, rx: 3, fill: on ? C.g : ((r + c) % 2 ? 'var(--paper-2)' : 'var(--line)'), opacity: on ? shade : 1 }, this.svg);
    }
    const onSq = Math.pow(2, n - 1), total = Math.pow(2, n) - 1;
    const tonnes = (total * 0.065) / 1e6;
    const fmt = (v) => (v < 1e6 ? Math.round(v).toLocaleString('en-IN') : v.toExponential(2).replace('e+', ' × 10^'));
    const tx = 310;
    text(this.svg, tx, 50, `Square ${n}`, { fill: 'var(--ink)', 'font-size': 16 });
    text(this.svg, tx, 82, `Grains on this square: ${fmt(onSq)}`, { 'font-size': 14 });
    text(this.svg, tx, 108, `Grains on the board: ${fmt(total)}`, { 'font-size': 14 });
    text(this.svg, tx, 134, `Weight: ${tonnes < 1 ? (tonnes * 1000).toFixed(tonnes * 1000 < 10 ? 2 : 0) + ' kg' : fmt(tonnes) + ' tonnes'}`, { 'font-size': 14 });
    const years = tonnes / 8e8;
    text(this.svg, tx, 160, years >= 0.01 ? `≈ ${years < 10 ? years.toFixed(2) : Math.round(years).toLocaleString('en-IN')} years of world wheat` : 'Still fits in a granary', { 'font-size': 14, fill: C.a });
    text(this.svg, tx, 200, 'The last square alone holds more', { fill: 'var(--muted)' });
    text(this.svg, tx, 218, 'than all the squares before it.', { fill: 'var(--muted)' });
  }
}

/* 5. Surplus: where the value in a trade goes */
class Surplus extends Viz {
  setup() {
    this.card('One trade, two winners', { W: 640, H: 200 });
    this.slider('value', 'What the session is worth to the client', { min: 500, max: 5000, step: 100, value: 2500, fmt: (v) => inr(v) });
    this.slider('cost', 'What it costs the studio to deliver', { min: 200, max: 4000, step: 100, value: 900, fmt: (v) => inr(v) });
    this.slider('price', 'Price', { min: 200, max: 5000, step: 100, value: 1500, fmt: (v) => inr(v) });
    this.caption('Value created by a trade = what it is worth to the buyer − what it costs the seller. Price only decides how that value is split. If the price is outside the range, nobody trades and nothing is created.');
  }
  draw() {
    this.clear();
    const { value, cost, price } = this.state;
    const x = lin(0, 5000, 30, 610), y = 80;
    s('line', { x1: x(0), x2: x(5000), y1: y, y2: y, stroke: C.l, 'stroke-width': 2 }, this.svg);
    const trade = price >= cost && price <= value;
    if (value > cost) {
      if (trade) {
        s('rect', { x: x(cost), y: y - 18, width: x(price) - x(cost), height: 36, fill: C.w, opacity: 0.8, rx: 3 }, this.svg);
        s('rect', { x: x(price), y: y - 18, width: x(value) - x(price), height: 36, fill: C.a, opacity: 0.8, rx: 3 }, this.svg);
      } else {
        s('rect', { x: x(cost), y: y - 18, width: x(value) - x(cost), height: 36, fill: 'none', stroke: C.m, 'stroke-dasharray': '4 4', rx: 3 }, this.svg);
      }
    }
    const mark = (v, label, col, dy) => {
      s('line', { x1: x(v), x2: x(v), y1: y - 28, y2: y + 28, stroke: col, 'stroke-width': 2 }, this.svg);
      text(this.svg, x(v), y + dy, label, { 'text-anchor': 'middle', fill: col });
    };
    mark(cost, `cost ${inr(cost)}`, 'var(--ink-2)', 48);
    mark(value, `worth ${inr(value)}`, 'var(--ink-2)', 48);
    mark(price, `price ${inr(price)}`, 'var(--ink)', -36);
    if (trade) {
      text(this.svg, (x(cost) + x(price)) / 2, y + 4, 'studio', { 'text-anchor': 'middle', fill: '#fff' });
      text(this.svg, (x(price) + x(value)) / 2, y + 4, 'client', { 'text-anchor': 'middle', fill: '#fff' });
    }
    const made = trade ? value - cost : 0;
    this.read(trade
      ? [['Studio gains', inr(price - cost)], ['Client gains', inr(value - price)], ['Value created', inr(made)]]
      : [['No trade', value <= cost ? 'it costs more than it is worth' : price > value ? 'price above what it is worth' : 'price below cost'], ['Value created', '₹0']]);
  }
}

/* 6. Output = judgment × leverage × effort */
class Output extends Viz {
  setup() {
    this.card('Effort adds. Leverage multiplies. Judgment points.', { W: 640, H: 210 });
    this.slider('effort', 'Effort (hours a week)', { min: 10, max: 80, step: 5, value: 40, fmt: (v) => `${v} h` });
    this.slider('lev', 'Leverage', { min: 0, max: 4, step: 1, value: 0, fmt: (v) => `×${Math.pow(10, v).toLocaleString('en-IN')}` });
    this.slider('judg', 'Judgment (direction)', { min: -1, max: 1, step: 0.1, value: 0.6, fmt: (v) => (v > 0 ? `+${v.toFixed(1)} right way` : v < 0 ? `${v.toFixed(1)} wrong way` : '0, random') });
    this.caption('Output is drawn on a log scale, each gridline is ten times the last. Doubling effort barely moves the bar. One notch of leverage moves it as much as working ten times harder. Flip judgment negative and leverage becomes a machine for losing.');
  }
  draw() {
    this.clear();
    const { effort, lev, judg } = this.state;
    const L = Math.pow(10, lev);
    const out = judg * L * effort;
    const mid = 320, half = 290;
    const sc = (v) => (v === 0 ? 0 : Math.sign(v) * (Math.log10(Math.abs(v) + 1) / 6.2) * half);
    for (let k = 0; k <= 6; k++) {
      const px = (k / 6.2) * half;
      s('line', { x1: mid + px, x2: mid + px, y1: 40, y2: 150, stroke: 'var(--line)', 'stroke-dasharray': '2 4' }, this.svg);
      s('line', { x1: mid - px, x2: mid - px, y1: 40, y2: 150, stroke: 'var(--line)', 'stroke-dasharray': '2 4' }, this.svg);
    }
    s('line', { x1: mid, x2: mid, y1: 30, y2: 160, stroke: 'var(--ink-2)' }, this.svg);
    const w = sc(out);
    s('rect', { x: Math.min(mid, mid + w), y: 70, width: Math.abs(w), height: 46, rx: 4, fill: out >= 0 ? C.a : 'var(--bad)', opacity: 0.85 }, this.svg);
    text(this.svg, mid - 10, 26, 'value destroyed', { 'text-anchor': 'end', fill: 'var(--muted)' });
    text(this.svg, mid + 10, 26, 'value created', { fill: 'var(--muted)' });
    text(this.svg, mid, 185, `output = ${judg.toFixed(1)} × ${L.toLocaleString('en-IN')} × ${effort} = ${Math.round(out).toLocaleString('en-IN')} units`, { 'text-anchor': 'middle', fill: 'var(--ink)', 'font-size': 14 });
    this.read([['Output', `${Math.round(out).toLocaleString('en-IN')} units`], ['If you doubled effort', `${Math.round(out * 2).toLocaleString('en-IN')}`], ['If you added one notch of leverage', `${Math.round(out * 10).toLocaleString('en-IN')}`]]);
  }
}

/* 7. Archimedes' lever */
class Lever extends Viz {
  setup() {
    this.card('Give me a place to stand', { W: 640, H: 240 });
    this.slider('arm', 'Your side of the lever', { min: 0.5, max: 5, step: 0.25, value: 2, fmt: (v) => `${v} m` });
    this.slider('push', 'How hard you push (in kg of weight)', { min: 10, max: 100, step: 5, value: 60, fmt: (v) => `${v} kg` });
    this.caption('The rock sits 0.5 m from the pivot. A balanced lever obeys push × your distance = load × its distance. Making your side longer multiplies your strength, at the cost of moving your end further.');
  }
  draw() {
    this.clear();
    const { arm, push } = this.state;
    const load = (push * arm) / 0.5;
    const px = 200, py = 170, scale = 70;
    s('polygon', { points: `${px - 18},${py + 34} ${px + 18},${py + 34} ${px},${py}`, fill: 'var(--ink-2)' }, this.svg);
    const lx = px + arm * scale, rx = px - 0.5 * scale;
    s('line', { x1: rx - 20, y1: py, x2: Math.min(lx, 630), y2: py, stroke: 'var(--ink)', 'stroke-width': 5, 'stroke-linecap': 'round' }, this.svg);
    const rock = Math.min(70, 16 + Math.sqrt(load) * 2.2);
    s('ellipse', { cx: rx, cy: py - rock / 2 - 2, rx: rock * 0.75, ry: rock / 2, fill: C.m }, this.svg);
    text(this.svg, rx, py - rock - 10, `${Math.round(load)} kg`, { 'text-anchor': 'middle', fill: 'var(--ink)', 'font-size': 14 });
    const hx = Math.min(lx, 620);
    s('line', { x1: hx, y1: py - 60, x2: hx, y2: py - 10, stroke: C.w, 'stroke-width': 3, 'marker-end': '' }, this.svg);
    s('polygon', { points: `${hx - 7},${py - 18} ${hx + 7},${py - 18} ${hx},${py - 6}`, fill: C.w }, this.svg);
    text(this.svg, hx, py - 68, `you: ${push} kg`, { 'text-anchor': 'middle', fill: C.w });
    text(this.svg, (px + hx) / 2, py + 54, `${arm} m`, { 'text-anchor': 'middle', fill: 'var(--muted)' });
    text(this.svg, (px + rx) / 2, py + 54, '0.5 m', { 'text-anchor': 'middle', fill: 'var(--muted)' });
    this.read([['You can lift', `${Math.round(load)} kg`], ['Multiplier', `×${(arm / 0.5).toFixed(1)}`], ['Your end moves', `${(arm / 0.5).toFixed(1)}× further than the rock`]]);
  }
}

/* 8. Team size and coordination */
class Team extends Viz {
  setup() {
    this.card('Every person you add adds conversations', { W: 640, H: 300 });
    this.slider('n', 'People on the team', { min: 1, max: 30, step: 1, value: 6 });
    this.slider('c', 'Cost of each communication line (share of a person)', { min: 0, max: 0.1, step: 0.005, value: 0.04, fmt: (v) => v.toFixed(3) });
    this.caption('With n people there are n(n − 1)/2 pairs who may need to talk. Output here = n − c × pairs. Labour leverage is real, but it bends back on itself unless you organise the team so that most pairs never need to talk.');
  }
  draw() {
    this.clear();
    const { n, c } = this.state;
    const cx = 140, cy = 150, R = 110;
    const pts = Array.from({ length: n }, (_, i) => [cx + R * Math.cos((2 * Math.PI * i) / n - Math.PI / 2), cy + R * Math.sin((2 * Math.PI * i) / n - Math.PI / 2)]);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) s('line', { x1: pts[i][0], y1: pts[i][1], x2: pts[j][0], y2: pts[j][1], stroke: C.w, 'stroke-width': 0.6, opacity: 0.45 }, this.svg);
    pts.forEach(([x, y]) => s('circle', { cx: x, cy: y, r: 6, fill: C.a }, this.svg));
    const W = 640, m = { l: 330, r: 20, t: 30, b: 40 }, H = 300;
    const out = (k) => k - c * (k * (k - 1)) / 2;
    const maxY = niceMax(Math.max(...Array.from({ length: 30 }, (_, i) => out(i + 1)), 1));
    const x = lin(1, 30, m.l + 30, W - m.r), y = lin(0, maxY, H - m.b, m.t);
    const yy = (v) => y(Math.max(0, v));
    frame(this.svg, { W, H, m: { ...m, l: m.l + 30 }, x, y, xTicks: [1, 10, 20, 30], yTicks: ticks(maxY), xFmt: (v) => v, yFmt: (v) => Math.round(v), xLabel: 'team size', yLabel: 'useful output' });
    s('path', { d: path(Array.from({ length: 30 }, (_, i) => [x(i + 1), yy(out(i + 1))])), fill: 'none', stroke: C.a, 'stroke-width': 2.5 }, this.svg);
    s('circle', { cx: x(n), cy: yy(out(n)), r: 5, fill: C.w }, this.svg);
    const best = c > 0 ? Math.round(1 / c + 0.5) : Infinity;
    this.read([['Pairs', (n * (n - 1)) / 2], ['Useful output', `${out(n).toFixed(1)} people’s worth`], ['Best size at this cost', isFinite(best) ? `${best} people` : 'unlimited']]);
  }
}

/* 9. Borrowed money */
class Debt extends Viz {
  setup() {
    this.card('Capital leverage cuts both ways', { W: 640, H: 300 });
    this.slider('debt', 'Borrowed on top of your ₹10 L', { min: 0, max: 90e5, step: 5e5, value: 40e5, fmt: (v) => inr(v, 0) });
    this.slider('i', 'Interest rate', { min: 6, max: 18, step: 0.5, value: 10, fmt: (v) => `${v}%` });
    this.slider('ret', 'What the investment actually returns', { min: -10, max: 30, step: 1, value: 15, fmt: (v) => `${v}%` });
    this.caption('Return on your own money = (return × everything invested − interest × debt) ÷ your money. The steeper line is you with debt. Where the two lines cross, the investment earns exactly the interest rate and debt stops helping.');
  }
  draw() {
    this.clear();
    const { debt, i, ret } = this.state;
    const E = 10e5;
    const roe = (r, D) => ((r / 100) * (E + D) - (i / 100) * D) / E;
    const W = this.W, H = this.H, m = { l: 56, r: 20, t: 24, b: 40 };
    const lo = Math.min(roe(-10, debt), -0.1), hi = Math.max(roe(30, debt), 0.3);
    const x = lin(-10, 30, m.l, W - m.r), y = lin(lo, hi, H - m.b, m.t);
    const yt = []; const st = (hi - lo) > 2 ? 0.5 : 0.2;
    for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) yt.push(+v.toFixed(2));
    frame(this.svg, { W, H, m, x, y, xTicks: [-10, 0, 10, 20, 30], yTicks: yt, xFmt: (v) => `${v}%`, yFmt: (v) => pct(v), xLabel: 'what the investment returns', yLabel: 'return on your own ₹10 L' });
    s('line', { x1: m.l, x2: W - m.r, y1: y(0), y2: y(0), stroke: 'var(--ink-2)', 'stroke-width': 0.8 }, this.svg);
    const line = (D, col) => s('line', { x1: x(-10), y1: y(roe(-10, D)), x2: x(30), y2: y(roe(30, D)), stroke: col, 'stroke-width': 2.5 }, this.svg);
    line(0, C.m); line(debt, C.w);
    s('circle', { cx: x(ret), cy: y(roe(ret, debt)), r: 5, fill: roe(ret, debt) >= 0 ? C.a : 'var(--bad)' }, this.svg);
    const r = roe(ret, debt);
    this.read([['With debt', pct(r, 1)], ['Without debt', pct(ret / 100, 1)], ['In rupees', inr(r * E)]]);
  }
}

/* 10. Marginal cost: studio vs app */
class Marginal extends Viz {
  setup() {
    this.card('What does one more customer cost?', { W: 640, H: 300 });
    this.slider('u', 'Customers served in a year', { min: 2, max: 6, step: 0.1, value: 4, fmt: (v) => Math.round(Math.pow(10, v)).toLocaleString('en-IN') });
    this.caption('Studio: ₹20 L a year fixed, plus ₹800 for every session (a coach’s time, a room, towels). App: ₹50 L a year fixed, plus ₹5 per user (servers). Average cost = fixed ÷ customers + marginal cost. Both axes are log scales.');
  }
  draw() {
    this.clear();
    const u = Math.pow(10, this.state.u);
    const st = (q) => 20e5 / q + 800, ap = (q) => 50e5 / q + 5;
    const W = this.W, H = this.H, m = { l: 64, r: 20, t: 24, b: 40 };
    const x = lin(2, 6, m.l, W - m.r), ly = lin(0, 5, H - m.b, m.t);
    const y = (v) => ly(Math.log10(Math.max(1, v)));
    frame(this.svg, { W, H, m, x, y: (v) => ly(v), xTicks: [2, 3, 4, 5, 6], yTicks: [0, 1, 2, 3, 4, 5], xFmt: (v) => Math.pow(10, v).toLocaleString('en-IN'), yFmt: (v) => inr(Math.pow(10, v), 0), xLabel: 'customers (log)', yLabel: 'average cost per customer (log)' });
    const pts = (f) => Array.from({ length: 81 }, (_, i) => { const lq = 2 + (i / 80) * 4; return [x(lq), y(f(Math.pow(10, lq)))]; });
    s('path', { d: path(pts(st)), fill: 'none', stroke: C.w, 'stroke-width': 2.5 }, this.svg);
    s('path', { d: path(pts(ap)), fill: 'none', stroke: C.a, 'stroke-width': 2.5 }, this.svg);
    s('line', { x1: x(this.state.u), x2: x(this.state.u), y1: m.t, y2: H - m.b, stroke: 'var(--ink-2)', 'stroke-dasharray': '3 3' }, this.svg);
    text(this.svg, x(6) - 4, y(st(1e6)) - 8, 'Studio', { 'text-anchor': 'end', fill: C.w });
    text(this.svg, x(6) - 4, y(ap(1e6)) - 8, 'App', { 'text-anchor': 'end', fill: C.a });
    this.read([['Studio, per customer', inr(st(u))], ['App, per customer', inr(ap(u))], ['Studio floor', '₹800 forever'], ['App floor', '₹5']]);
  }
}

/* 11. Sundial's decision */
class Sundial extends Viz {
  setup() {
    this.card('Sundial: three ways to grow, three years out', { W: 640, H: 320 });
    this.slider('subs', 'App: paying subscribers by end of year 3', { min: 200, max: 10000, step: 100, value: 1500, fmt: (v) => v.toLocaleString('en-IN') });
    this.slider('d', 'Coaches: share of new early and late slots that fill', { min: 0.2, max: 1, step: 0.05, value: 0.6, fmt: (v) => pct(v) });
    this.caption('Assumptions are in the lesson. Studio 2 needs a ₹20 L bank loan at 12%. The app costs ₹35 L to build plus ₹10 L a year and earns ₹3,348 a year per subscriber. Coaches cost ₹30 L a year and earn ₹1,300 per filled session, 400 new slots a month.');
  }
  model() {
    const { subs, d } = this.state;
    const A = { name: 'Second studio', kind: 'capital + labour', cum: 12e5 + 24e5 + 24e5 - 60e5 - 3 * 2.4e5, run: 24e5 - 2.4e5 };
    const c = 3348;
    const B = { name: 'Sleep app', kind: 'code', cum: c * subs * (0.05 + 0.25 + 0.7) - 35e5 - 30e5, run: c * subs - 10e5 };
    const yr = (f) => 400 * 12 * f * 1300 - 30e5;
    const Cc = { name: 'Hire 4 coaches', kind: 'labour', cum: yr(0.5 * d) + 2 * yr(d), run: yr(d) };
    return [A, B, Cc];
  }
  draw() {
    this.clear();
    const opts = this.model();
    const W = this.W, H = this.H, m = { l: 64, r: 20, t: 30, b: 50 };
    const vals = opts.flatMap((o) => [o.cum, o.run]);
    const vmax = Math.max(...vals, 10e5), vmin = Math.min(...vals, 0);
    const st = niceMax((vmax - vmin) / 5);
    const lo = Math.floor(vmin / st) * st, hi = Math.ceil(vmax / st) * st;
    const y = lin(lo, hi, H - m.b, m.t);
    const yt = []; for (let v = lo; v <= hi + 1; v += st) yt.push(v);
    const gw = (W - m.l - m.r) / 3;
    frame(this.svg, { W, H, m, x: () => 0, y, xTicks: [], yTicks: yt, yFmt: (v) => inr(v, 0) });
    s('line', { x1: m.l, x2: W - m.r, y1: y(0), y2: y(0), stroke: 'var(--ink-2)' }, this.svg);
    opts.forEach((o, i) => {
      const gx = m.l + i * gw + gw / 2;
      [[o.cum, C.g, -34], [o.run, C.a, 6]].forEach(([v, col, dx]) => {
        s('rect', { x: gx + dx, y: Math.min(y(0), y(v)), width: 28, height: Math.abs(y(v) - y(0)), fill: col, rx: 3, opacity: v < 0 ? 0.55 : 0.9 }, this.svg);
        text(this.svg, gx + dx + 14, v >= 0 ? y(v) - 6 : y(v) + 14, inr(v, 1), { 'text-anchor': 'middle', 'font-size': 11 });
      });
      text(this.svg, gx, H - m.b + 20, o.name, { 'text-anchor': 'middle', fill: 'var(--ink)', 'font-size': 13 });
      text(this.svg, gx, H - m.b + 36, o.kind, { 'text-anchor': 'middle', fill: 'var(--muted)' });
    });
    s('rect', { x: m.l + 4, y: 6, width: 10, height: 10, fill: C.g, rx: 2 }, this.svg);
    text(this.svg, m.l + 20, 15, 'cash made over 3 years, after paying for it', {});
    s('rect', { x: m.l + 300, y: 6, width: 10, height: 10, fill: C.a, rx: 2 }, this.svg);
    text(this.svg, m.l + 316, 15, 'yearly profit it adds by year 3', {});
    const be = Math.ceil(65e5 / 3348);
    this.read([['App 3 year breakeven', `${be.toLocaleString('en-IN')} subscribers`], ['Coaches breakeven fill', pct(90 / 156, 0)]]);
  }
}

const defs = {
  'viz-sleep-test': SleepTest, 'viz-time-equity': TimeEquity, 'viz-compound': Compound, 'viz-chessboard': Chessboard,
  'viz-surplus': Surplus, 'viz-output': Output, 'viz-lever': Lever, 'viz-team': Team, 'viz-debt': Debt,
  'viz-marginal': Marginal, 'viz-sundial': Sundial,
};
for (const [k, v] of Object.entries(defs)) if (!customElements.get(k)) customElements.define(k, v);
