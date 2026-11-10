// Theo (a Feynman inspired tutor) and Almanac (a reflection advisor inspired by
// Naval Ravikant's published ideas). Both live in one small chat widget.
import { session, save } from './store.js';

const MODEL_DEFAULT = 'claude-sonnet-5-5';

const THEO = `You are Theo, the tutor inside Immersive Growth, Tanvi's personal university for business, startups, the wellness industry and venture capital. Your teaching style is inspired by Richard Feynman: start from what she already knows, build ideas from first principles, prefer concrete examples and plain words, and treat confusion as the interesting part. You are not Feynman and never claim to be him.

Hard rules:
1. Never give the final answer, the number, or a full worked solution to an unsolved practice question, even if she asks directly or repeatedly. Decline warmly and give the next rung of the hint ladder instead.
2. Hint ladder. Rung 1: point at what to notice. Rung 2: a guiding question, a simpler version of the problem, or an analogy. Rung 3: the structure of the method with the key step left blank. Climb one rung at a time; the context tells you how many hints she has had.
3. Once a question is marked solved, you may discuss its solution freely and go deeper.
4. When she shows working, find the exact step where the reasoning breaks and ask about that step.
5. Connect ideas. When useful, name the earlier lessons listed under builds_on and show how they apply.
6. Be brief: usually two to six sentences. Ask a question back often. Use rupees and Indian examples when natural. Use lakh and crore correctly (1 lakh = 100,000, 1 crore = 10 million).
7. If you notice a genuine misconception, add a final line exactly like: [[misconception: short description]]
8. When asked to check an explain-it-back answer, compare it with the rubric. Say what is clear, what is missing, and any jargon used without explanation. End with exactly one line: [[explain: pass]] if every rubric point is covered in plain words, otherwise [[explain: revise]].`;

const ALMANAC = `You are Almanac, the reflection advisor inside Immersive Growth, Tanvi's personal university. Your way of thinking is inspired by the publicly shared ideas of Naval Ravikant, as collected in The Almanack of Naval Ravikant by Eric Jorgenson, his 2018 "How to Get Rich (without getting lucky)" thread, and his podcasts: specific knowledge, leverage, judgment, accountability, equity over wages, long term games with long term people, reading and learning for love, and happiness and peace as skills.

Rules:
1. You are not Naval and never speak as him or claim to be him.
2. Never invent quotes. Attribute an idea to Naval only when you are confident it is one he has publicly expressed, and say "Naval argues" rather than quoting unless you are certain of the exact words. Otherwise give the view as your own.
3. Style: calm, clear and compressed. Short sentences. No hype, no flattery.
4. Your job is application: help her turn the lesson into judgment about her own career, future companies and future investing. Ask one sharp question at a time.
5. Be honest. Push back when her reasoning is weak or comfortable. Keep replies under about 150 words.`;

function md(src) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<i>$2</i>');
  const out = []; let list = null;
  for (const raw of src.split('\n')) {
    const line = raw.trimEnd();
    const ul = line.match(/^\s*[-*]\s+(.*)/), ol = line.match(/^\s*\d+[.)]\s+(.*)/);
    if (ul || ol) {
      const t = ul ? 'ul' : 'ol';
      if (!list || list.t !== t) { if (list) out.push(`</${list.t}>`); list = { t }; out.push(`<${t}>`); }
      out.push(`<li>${inline((ul || ol)[1])}</li>`);
      continue;
    }
    if (list) { out.push(`</${list.t}>`); list = null; }
    if (line.trim()) out.push(`<p>${inline(line)}</p>`);
  }
  if (list) out.push(`</${list.t}>`);
  return out.join('');
}

let ctxFn = () => null;
let mode = 'theo';
let open = false;
let busy = false;
const root = () => document.getElementById('tutor-root');

export function setContext(fn) { ctxFn = fn || (() => null); render(); }
export function hide() { open = false; ctxFn = () => null; root().innerHTML = ''; }

const chatKey = (m) => `${(ctxFn() || {}).lessonId || 'general'}:${m}`;
function history(m) {
  const p = session.progress;
  if (!p) return [];
  p.chats[chatKey(m)] ||= [];
  return p.chats[chatKey(m)];
}

export function openTutor(m = 'theo', prefill = '') {
  mode = m; open = true; render();
  if (prefill) { const ta = document.querySelector('.tutor-input textarea'); if (ta) { ta.value = prefill; ta.focus(); } }
}

function render() {
  const r = root();
  if (!r) return;
  const ctx = ctxFn();
  if (!ctx) { r.innerHTML = ''; return; }
  if (!open) {
    r.innerHTML = `<button class="tutor-fab" id="tfab"><span class="face">T</span>Ask Theo</button>`;
    r.querySelector('#tfab').onclick = () => openTutor('theo');
    return;
  }
  const msgs = history(mode);
  const hasKey = Boolean(session.secrets?.anthropicKey);
  const sub = mode === 'theo'
    ? 'Hints, not answers. Inspired by Richard Feynman.'
    : 'Reflection and judgment. Inspired by the ideas of Naval Ravikant.';
  const quick = mode === 'theo'
    ? ['Give me a hint', 'Check my reasoning', 'Explain it another way', 'How does this connect to earlier lessons?']
    : ['What does this mean for my career?', 'Push back on my thinking', 'Give me one question to sit with'];
  r.innerHTML = `
    <section class="tutor-panel" role="dialog" aria-label="Tutor">
      <div class="tutor-head">
        <div class="tutor-tabs">
          <button data-m="theo" class="${mode === 'theo' ? 'on' : ''}">Theo</button>
          <button data-m="almanac" class="${mode === 'almanac' ? 'on' : ''}">Almanac</button>
        </div>
        <button class="x" aria-label="Close">×</button>
      </div>
      <div class="tutor-sub">${sub}</div>
      <div class="tutor-log" id="tlog">
        ${msgs.length ? '' : `<div class="msg note">${mode === 'theo'
          ? `I can see the lesson and where you are in it.${ctx.question ? ' Stuck on a question? Ask for a hint, or show me your working.' : ''}`
          : 'Bring me what you just learned. We will work out what it means for you.'}</div>`}
        ${msgs.map((m) => m.role === 'user'
          ? `<div class="msg user">${md(m.content)}</div>`
          : `<div class="msg bot"><div class="who">${mode === 'theo' ? 'Theo' : 'Almanac'}</div>${md(m.content)}</div>`).join('')}
        ${hasKey ? '' : `<div class="msg note">Add your Claude API key in <a href="#/account">Account</a> to talk with ${mode === 'theo' ? 'Theo' : 'Almanac'}. ${mode === 'theo' ? 'Until then, the hint button on each question gives written hints.' : ''}</div>`}
      </div>
      <div class="tutor-quick">${quick.map((q) => `<button>${q}</button>`).join('')}</div>
      <form class="tutor-input"><textarea placeholder="${mode === 'theo' ? 'Ask Theo…' : 'Think out loud…'}" rows="1"></textarea><button type="submit">Send</button></form>
    </section>`;
  r.querySelectorAll('.tutor-tabs button').forEach((b) => (b.onclick = () => { mode = b.dataset.m; render(); }));
  r.querySelector('.x').onclick = () => { open = false; render(); };
  r.querySelectorAll('.tutor-quick button').forEach((b) => (b.onclick = () => send(b.textContent)));
  const form = r.querySelector('form'), ta = r.querySelector('textarea');
  form.onsubmit = (e) => { e.preventDefault(); send(ta.value); };
  ta.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(ta.value); } };
  ta.oninput = () => { ta.style.height = 'auto'; ta.style.height = Math.min(140, ta.scrollHeight) + 'px'; };
  const log = r.querySelector('#tlog'); log.scrollTop = log.scrollHeight;
}

function contextBlock() {
  const ctx = ctxFn() || {};
  const p = session.progress || {};
  const c = { ...ctx };
  c.recent_misconceptions = (p.misconceptions || []).slice(-8).map((m) => m.note);
  if (c.question && !c.question.solved) c.question.hidden_solution_never_reveal = c.question.solution;
  if (c.question) delete c.question.solution;
  return `\n\n<context>\n${JSON.stringify(c, null, 1).slice(0, 16000)}\n</context>`;
}

async function callClaude(system, messages, onDelta) {
  const key = session.secrets?.anthropicKey;
  if (!key) throw new Error('No API key yet. Add one in Account.');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model: session.secrets.model || MODEL_DEFAULT, max_tokens: 900, system, messages, stream: true }),
  });
  if (!r.ok) {
    let why = `${r.status}`;
    try { why = (await r.json()).error?.message || why; } catch {}
    throw new Error(`Claude API: ${why}`);
  }
  const reader = r.body.getReader(); const dec = new TextDecoder();
  let buf = '', text = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line.startsWith('data:')) continue;
      try {
        const ev = JSON.parse(line.slice(5));
        if (ev.type === 'content_block_delta' && ev.delta?.text) { text += ev.delta.text; onDelta && onDelta(text); }
      } catch {}
    }
  }
  return text;
}

function stripTags(text) {
  const tags = { misconceptions: [], explain: null };
  const clean = text.replace(/\[\[misconception:\s*([^\]]+)\]\]/g, (_, m) => { tags.misconceptions.push(m.trim()); return ''; })
    .replace(/\[\[explain:\s*(pass|revise)\]\]/g, (_, v) => { tags.explain = v; return ''; }).trim();
  return { clean, tags };
}

// Send a message in the open panel.
async function send(text) {
  text = (text || '').trim();
  if (!text || busy) return;
  const msgs = history(mode);
  const ctx = ctxFn() || {};
  if (mode === 'theo' && /hint/i.test(text) && ctx.onHint) ctx.onHint();
  msgs.push({ role: 'user', content: text });
  if (!session.secrets?.anthropicKey) {
    const fallback = ctx.writtenHint ? ctx.writtenHint() : null;
    msgs.push({ role: 'assistant', content: fallback || 'I need an API key to think out loud with you. Add it in Account. Meanwhile, use the hint button under each question.' });
    render(); save(); return;
  }
  busy = true; render();
  const log = document.getElementById('tlog');
  const live = document.createElement('div');
  live.className = 'msg bot';
  live.innerHTML = `<div class="who">${mode === 'theo' ? 'Theo' : 'Almanac'}</div><span class="typing"><i></i><i></i><i></i></span>`;
  log.appendChild(live); log.scrollTop = log.scrollHeight;
  try {
    const sys = (mode === 'theo' ? THEO : ALMANAC) + contextBlock();
    const full = await callClaude(sys, msgs.slice(-20).map(({ role, content }) => ({ role, content })), (t) => {
      live.innerHTML = `<div class="who">${mode === 'theo' ? 'Theo' : 'Almanac'}</div>${md(stripTags(t).clean)}`;
      log.scrollTop = log.scrollHeight;
    });
    const { clean, tags } = stripTags(full);
    tags.misconceptions.forEach((m) => session.progress.misconceptions.push({ note: m, lessonId: ctx.lessonId, at: Date.now() }));
    msgs.push({ role: 'assistant', content: clean });
    if (msgs.length > 40) msgs.splice(0, msgs.length - 40);
  } catch (e) {
    msgs.pop();
    msgs.push({ role: 'user', content: text });
    msgs.push({ role: 'assistant', content: `I couldn't reach Claude just now. ${e.message}` });
  }
  busy = false; render(); save();
}

// One shot evaluation of an explain-it-back answer.
export async function checkExplanation(prompt, rubric, answer) {
  const ctx = ctxFn() || {};
  const sys = THEO + contextBlock();
  const msg = `Please check my explain-it-back answer.\n\nPrompt: ${prompt}\n\nRubric (what a complete plain-words explanation covers):\n${rubric.map((r) => `- ${r}`).join('\n')}\n\nMy answer:\n${answer}`;
  const full = await callClaude(sys, [{ role: 'user', content: msg }]);
  const { clean, tags } = stripTags(full);
  tags.misconceptions.forEach((m) => session.progress.misconceptions.push({ note: m, lessonId: ctx.lessonId, at: Date.now() }));
  const h = history('theo');
  h.push({ role: 'user', content: `Check my explanation:\n\n${answer}` }, { role: 'assistant', content: clean });
  return { feedback: clean, verdict: tags.explain || 'revise', html: md(clean) };
}

export async function reflect(prompt, answer) {
  const sys = ALMANAC + contextBlock();
  const msg = `Reflection prompt: ${prompt}\n\nMy reflection:\n${answer}`;
  const full = await callClaude(sys, [{ role: 'user', content: msg }]);
  const h = history('almanac');
  h.push({ role: 'user', content: answer }, { role: 'assistant', content: full.trim() });
  return md(full.trim());
}

export const hasTutorKey = () => Boolean(session.secrets?.anthropicKey);
export { md };
