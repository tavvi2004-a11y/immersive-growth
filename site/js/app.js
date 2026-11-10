import './viz/components.js';
import * as S from './store.js';
import * as E from './engine.js';
import * as T from './tutor.js';
import { generatePassphrase, checkWords, normalise } from './vault.js';
import { testToken, hasRepo } from './github.js';
import { CONFIG } from './config.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const go = (h) => { location.hash = h; };
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

/* ---------- number parsing for answers ---------- */
function parseNum(raw) {
  if (raw == null) return NaN;
  let s = String(raw).toLowerCase().replace(/₹|rs\.?|inr|,|\s+/g, ' ').trim();
  let mult = 1;
  const units = [[/(crores?|cr)$/, 1e7], [/(lakhs?|lacs?|l)$/, 1e5], [/(million|mn|m)$/, 1e6], [/(thousand|k)$/, 1e3], [/(years?|yrs?|y)$/, 1], [/%$/, 1], [/(x|times)$/, 1]];
  for (const [re, m] of units) if (re.test(s)) { s = s.replace(re, '').trim(); mult = m; break; }
  s = s.replace(/\s+/g, '').replace(/^−/, '-');
  const v = Number(s);
  return isNaN(v) ? NaN : v * mult;
}
function numericCorrect(q, raw) {
  const v = parseNum(raw);
  if (isNaN(v)) return null;
  const tol = q.tolerance ?? 0.01;
  const ok = (a) => Math.abs(v - a) <= Math.abs(a) * tol + (q.abs_tol ?? 0) + 1e-9;
  if (ok(q.answer)) return true;
  if (q.unit === '%' && ok(q.answer / 100)) return true;
  return false;
}

/* ---------- nav ---------- */
function renderNav(route) {
  if (!S.signedIn()) { nav.innerHTML = ''; return; }
  const links = [['#/map', 'Map'], ['#/account', 'Account']];
  nav.innerHTML = links.map(([h, l]) => `<a href="${h}" class="${route.startsWith(h.slice(1)) ? 'active' : ''}">${l}</a>`).join('');
}

/* ---------- home ---------- */
async function viewHome() {
  T.hide();
  let hint = '';
  let dots = '';
  if (S.signedIn()) {
    const a = E.nextAction();
    hint = a.label;
    const n = E.lessonsToday();
    dots = `<span class="today-dots" title="Today’s lessons">${Array.from({ length: E.DAILY_LESSONS }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
  }
  app.innerHTML = `
    <section class="home">
      <h1>Learn slowly.<br><em>Understand deeply.</em></h1>
      <p class="lede">A personal university for building companies, operating them, and backing them.</p>
      <button class="learn-btn" id="learn">Learn</button>
      <div class="learn-hint">${esc(hint)}${dots}</div>
    </section>`;
  document.getElementById('learn').onclick = learn;
}

async function learn() {
  if (!S.signedIn()) {
    const v = await S.findVault();
    return go(v ? '#/signin' : '#/signup');
  }
  const a = E.nextAction();
  if (a.kind === 'review') return go('#/review');
  if (a.kind === 'lesson') return go(`#/lesson/${a.id}`);
  if (a.kind === 'rest') return go('#/rest');
  return go('#/caughtup');
}

function viewRest() {
  const a = E.nextAction();
  app.innerHTML = `<div class="wrap center-note">
    <div class="eyebrow">Slow and steady</div>
    <h2>Today’s two lessons are done.</h2>
    <p class="mute">What you learned today gets stronger while you sleep. Tomorrow starts with a short review of it.</p>
    <p style="margin-top:28px"><button class="btn" id="ref">Reflect with Almanac</button> <a class="btn ghost" href="#/map">See the map</a></p>
    ${a.next ? `<p class="small mute" style="margin-top:40px">Tomorrow: ${esc(a.next.title)}. <button class="linkish" id="more">I genuinely have time for one more</button></p>` : ''}
  </div>`;
  document.getElementById('ref').onclick = () => { T.setContext(() => ({ lessonId: 'daily', note: 'End of day reflection on today’s lessons', today: S.session.progress.log.filter((e) => e.day === new Date().toLocaleDateString('en-CA')).map((e) => E.graph().lessonById[e.id]?.title) })); T.openTutor('almanac'); };
  const m = document.getElementById('more'); if (m) m.onclick = () => go(`#/lesson/${a.next.id}`);
}
function viewCaughtUp() {
  app.innerHTML = `<div class="wrap center-note"><div class="eyebrow">All caught up</div><h2>You have finished everything written so far.</h2><p class="mute">New lessons are written ahead of you. Your reviews will keep everything fresh in the meantime.</p><p style="margin-top:24px"><a class="btn" href="#/map">See the map</a></p></div>`;
}

/* ---------- sign up / sign in ---------- */
function viewSignup() {
  T.hide();
  let words = generatePassphrase();
  let stage = 1;
  const draw = () => {
    if (stage === 1) {
      app.innerHTML = `<div class="wrap">
        <div class="eyebrow">Create your account · 1 of 3</div>
        <h1 class="title">Your passphrase</h1>
        <p>These ten words are your key. You type them once on each device. They are never sent anywhere or stored. Everything personal is encrypted with them.</p>
        <div class="passphrase">${words.map((w, i) => `<span><i>${i + 1}</i>${w}</span>`).join(' ')}</div>
        <p class="small mute" style="margin-top:14px">Write them on paper and keep it somewhere safe. If the words are lost, your progress cannot be recovered by anyone, including me.</p>
        <div class="continue-row"><button class="btn ghost" id="re">Different words</button><button class="btn primary" id="ok">I have written them down</button></div>
      </div>`;
      document.getElementById('re').onclick = () => { words = generatePassphrase(); draw(); };
      document.getElementById('ok').onclick = () => { stage = 2; draw(); };
    } else if (stage === 2) {
      app.innerHTML = `<div class="wrap">
        <div class="eyebrow">Create your account · 2 of 3</div>
        <h1 class="title">Type it back</h1>
        <p>Without looking, if you can. This is exactly what signing in on a new device will feel like.</p>
        <form class="form" id="f"><textarea class="input" id="p" rows="3" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ten words separated by spaces"></textarea><div class="err" id="e"></div>
        <div class="continue-row"><button type="button" class="btn ghost" id="back">Show the words again</button><button class="btn primary">Continue</button></div></form>
      </div>`;
      document.getElementById('back').onclick = () => { stage = 1; draw(); };
      document.getElementById('f').onsubmit = (ev) => {
        ev.preventDefault();
        const v = normalise(document.getElementById('p').value);
        if (v !== words.join(' ')) {
          const c = checkWords(v);
          document.getElementById('e').textContent = c.count !== 10 ? `That is ${c.count} words. It should be 10.` : c.unknown.length ? `Check the spelling of: ${c.unknown.join(', ')}` : 'The words or their order do not match yet.';
          return;
        }
        stage = 3; draw();
      };
    } else {
      app.innerHTML = `<div class="wrap">
        <div class="eyebrow">Create your account · 3 of 3</div>
        <h1 class="title">Connect Theo and sync</h1>
        <p>Both are optional now and can be added later in Account. They are stored inside your encrypted vault.</p>
        <form class="form" id="f">
          <label>Claude API key, so Theo and Almanac can think with you
            <input class="input" id="ak" type="password" autocomplete="off" placeholder="sk-ant-…">
            <span class="small mute">Create one at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a> → API keys.</span>
          </label>
          ${hasRepo() ? `<label>GitHub token, so your progress follows you between devices
            <input class="input" id="gt" type="password" autocomplete="off" placeholder="github_pat_…">
            <span class="small mute">At <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com → Fine-grained tokens</a>: choose only the repository <b>${esc(CONFIG.owner)}/${esc(CONFIG.repo)}</b>, set <b>Contents</b> to <b>Read and write</b>, no expiry or a long one.</span>
          </label>` : ''}
          <div class="err" id="e"></div>
          <div class="continue-row"><button class="btn primary" id="go">Create account</button></div>
        </form></div>`;
      document.getElementById('f').onsubmit = async (ev) => {
        ev.preventDefault();
        const btn = document.getElementById('go'), e = document.getElementById('e');
        const anthropicKey = document.getElementById('ak').value.trim();
        const githubToken = (document.getElementById('gt')?.value || '').trim();
        btn.disabled = true; btn.textContent = 'Encrypting…'; e.textContent = '';
        try {
          if (githubToken) { const t = await testToken(githubToken); if (!t.ok) throw new Error(t.why); }
          await S.signUp(words.join(' '), { anthropicKey, githubToken, model: 'claude-sonnet-5-5' });
          toast('Account created');
          go('#/');
        } catch (err) { e.textContent = err.message; btn.disabled = false; btn.textContent = 'Create account'; }
      };
    }
  };
  (async () => {
    const v = await S.findVault();
    if (v) { app.innerHTML = `<div class="wrap center-note"><h2>An account already exists.</h2><p class="mute">Immersive Growth has one learner. Sign in with your passphrase.</p><p><a class="btn primary" href="#/signin">Sign in</a></p></div>`; return; }
    draw();
  })();
}

async function viewSignin() {
  T.hide();
  app.innerHTML = `<div class="wrap"><div class="eyebrow">Welcome back</div><h1 class="title">Sign in</h1>
    <p>Type your ten words.</p>
    <form class="form" id="f"><textarea class="input" id="p" rows="3" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ten words separated by spaces" autofocus></textarea><div class="err" id="e"></div>
    <div class="continue-row"><button class="btn primary" id="go">Unlock</button></div></form></div>`;
  document.getElementById('f').onsubmit = async (ev) => {
    ev.preventDefault();
    const e = document.getElementById('e'), btn = document.getElementById('go');
    const phrase = document.getElementById('p').value;
    const c = checkWords(phrase);
    if (c.count !== 10) { e.textContent = `That is ${c.count} words. It should be 10.`; return; }
    if (c.unknown.length) { e.textContent = `Check the spelling of: ${c.unknown.join(', ')}`; return; }
    btn.disabled = true; btn.textContent = 'Unlocking…'; e.textContent = '';
    try {
      const v = await S.findVault();
      if (!v) { e.innerHTML = 'No account found yet. <a href="#/signup">Create it</a>.'; btn.disabled = false; btn.textContent = 'Unlock'; return; }
      await S.signIn(phrase, v.doc);
      toast('Unlocked'); go('#/');
    } catch (err) { e.textContent = err.message; btn.disabled = false; btn.textContent = 'Unlock'; }
  };
}

/* ---------- lesson ---------- */
let current = null; // { lesson, state, focusQ }

function qHTML(q, idx, label, st) {
  const a = st.answers[q.id] || {};
  const solved = a.correct;
  let body = '';
  if (q.type === 'numeric') {
    body = `<div class="q-row"><input class="input" data-q="${q.id}" inputmode="decimal" autocomplete="off" value="${esc(a.value || '')}" ${solved ? 'disabled' : ''} placeholder="your answer">
      ${q.unit_label ? `<span class="unit">${esc(q.unit_label)}</span>` : ''}
      ${solved ? '' : `<button class="btn" data-check="${q.id}">Check</button>`}</div>`;
  } else if (q.type === 'choice') {
    body = `<div class="options">${q.options.map((o, i) => {
      const picked = (a.picks || []).includes(i);
      const cls = picked ? (o.correct ? 'right' : 'wrong') : (solved && o.correct ? 'right' : '');
      return `<button class="option ${cls}" data-q="${q.id}" data-opt="${i}" ${solved ? 'disabled' : ''}>${o.html}</button>`;
    }).join('')}</div>`;
  }
  let fb = '';
  if (a.lastWrong && !solved) fb = `<div class="feedback bad">Not yet.${a.lastWhy ? `<span class="why">${a.lastWhy}</span>` : ''}</div>`;
  if (solved) fb = `<div class="feedback good">Correct${a.attempts > 1 ? ` after ${a.attempts} tries` : ''}.</div>${q.solution_html ? `<div class="solution">${q.solution_html}</div>` : ''}`;
  const hintsShown = (st.hints[q.id] || 0);
  const hints = (q.hints || []).slice(0, hintsShown).map((h, i) => `<div class="hint"><b>Hint ${i + 1}.</b> ${h}</div>`).join('');
  const more = !solved && q.hints && hintsShown < q.hints.length;
  return `<div class="q card" id="q-${q.id}">
    <div class="q-num">${label} ${idx + 1}</div>
    <div class="q-prompt">${q.prompt_html}</div>
    ${body}${hints}${fb}
    ${solved ? '' : `<div class="q-actions">${more ? `<button class="linkish" data-hint="${q.id}">Hint</button>` : ''}<button class="linkish" data-theo="${q.id}">Ask Theo</button></div>`}
  </div>`;
}

function buildSteps(L) {
  const steps = [];
  if (L.warmup?.length) steps.push({ key: 'warmup', name: 'Warm up' });
  steps.push({ key: 'puzzle', name: 'Puzzle' });
  L.theory.forEach((t, i) => steps.push({ key: `theory-${i}`, name: t.title, i }));
  steps.push({ key: 'explain', name: 'Explain it back' });
  steps.push({ key: 'practice', name: 'Practice' });
  steps.push({ key: 'reflect', name: 'Reflect' });
  steps.push({ key: 'done', name: 'Mastered' });
  return steps;
}

function allSolved(qs, st) { return (qs || []).every((q) => st.answers[q.id]?.correct); }

function stepHTML(step, L, st, isLast) {
  const cont = (label = 'Continue', disabled = false, note = '') => isLast && step.key !== 'done'
    ? `<div class="continue-row">${note ? `<span class="small mute">${note}</span>` : ''}<button class="btn primary" data-next ${disabled ? 'disabled' : ''}>${label}</button></div>` : '';
  if (step.key === 'warmup') {
    const ok = allSolved(L.warmup, st);
    return `<div class="eyebrow">Warm up · from earlier lessons</div><h2 class="section">Before we start</h2>
      <p class="mute">Pulling something back out of memory is what makes it stay. Answer from memory first.</p>
      ${L.warmup.map((q, i) => qHTML(q, i, 'Recall', st)).join('')}${cont('Continue', !ok, ok ? '' : 'Answer these to continue')}`;
  }
  if (step.key === 'puzzle') return `<div class="eyebrow">Puzzle</div><div class="puzzle">${L.puzzle}</div>${cont('Let’s figure it out')}`;
  if (step.key.startsWith('theory')) {
    const t = L.theory[step.i];
    return `<div class="eyebrow">Theory · ${step.i + 1} of ${L.theory.length}</div><h2 class="section">${esc(t.title)}</h2><div class="prose">${t.html}</div>${cont()}`;
  }
  if (step.key === 'explain') {
    const ex = st.explainResult;
    const passed = st.explainPassed;
    const key = T.hasTutorKey();
    return `<div class="eyebrow">Explain it back</div><h2 class="section">Teach it in plain words</h2>
      <p>${L.explain.prompt_html}</p>
      <p class="small mute">If you can only say it with jargon, you don’t understand it yet. That is useful to discover.</p>
      <textarea class="input" id="explain" ${passed ? 'disabled' : ''} placeholder="Write as if to a curious twelve year old…">${esc(st.explain || '')}</textarea>
      ${ex ? `<div class="card" style="margin-top:14px"><div class="eyebrow" style="margin-bottom:6px">Theo</div><div class="prose small">${ex}</div></div>` : ''}
      ${!key && !passed ? `<div class="card" style="margin-top:14px"><div class="small" style="margin-bottom:8px">Check yourself. Does your explanation cover:</div>${L.explain.rubric.map((r, i) => `<label class="small" style="display:flex;gap:8px;align-items:flex-start;margin:6px 0"><input type="checkbox" data-rub="${i}"> <span>${esc(r)}</span></label>`).join('')}</div>` : ''}
      ${isLast ? `<div class="continue-row">
        ${passed ? '<span class="badge good">Clear explanation</span><button class="btn primary" data-next>Continue</button>'
          : key ? `<button class="btn primary" id="check-ex">Ask Theo to check it</button>${(st.explainTries || 0) >= 3 ? '<button class="btn ghost" data-next>Move on and revisit later</button>' : ''}`
          : '<button class="btn primary" id="self-ex">My explanation covers all of these</button>'}
      </div>` : ''}`;
  }
  if (step.key === 'practice') {
    const ok = allSolved(L.practice, st);
    return `<div class="eyebrow">Practice</div><h2 class="section">Now you do it</h2>
      <p class="mute">Get each one right to master the lesson. Hints climb a ladder. Theo will never just hand you the answer.</p>
      ${L.practice.map((q, i) => qHTML(q, i, 'Question', st)).join('')}${cont('Continue', !ok, ok ? '' : `${L.practice.filter((q) => st.answers[q.id]?.correct).length} of ${L.practice.length} solved`)}`;
  }
  if (step.key === 'reflect') {
    const r = S.session.progress.reflections[L.id] || {};
    const words = (r.text || '').trim().split(/\s+/).filter(Boolean).length;
    return `<div class="eyebrow">Reflect · with Almanac</div><h2 class="section">What does this mean for you?</h2>
      <p>${L.almanac.prompt_html}</p>
      <textarea class="input" id="reflect" placeholder="Think on the page…">${esc(r.text || '')}</textarea>
      ${r.reply ? `<div class="card" style="margin-top:14px"><div class="eyebrow" style="margin-bottom:6px">Almanac</div><div class="prose small">${r.reply}</div></div>` : ''}
      ${isLast ? `<div class="continue-row">${T.hasTutorKey() ? '<button class="btn" id="almanac">Discuss with Almanac</button>' : ''}<button class="btn primary" data-next id="finish" ${words < 15 ? 'disabled' : ''}>Finish the lesson</button></div>` : ''}`;
  }
  if (step.key === 'done') {
    const G = E.graph();
    return `<div class="center-note" style="padding:30px 0 10px"><div class="eyebrow">Mastered</div><h2>${esc(L.title)}</h2>
      <p class="mute">${esc(L.summary)}</p>
      <p class="small mute">${L.review.length} ideas from this lesson will come back for review, spaced further apart each time you remember them.</p></div>
      ${L.leads_to.length ? `<div class="small mute" style="text-align:center">This lesson leads to</div><div class="chips" style="justify-content:center">${L.leads_to.map((l) => `<span class="chip">${esc(l.title)}</span>`).join('')}</div>` : ''}
      <div class="continue-row" style="justify-content:center"><a class="btn primary" href="#/">Home</a></div>`;
  }
  return '';
}

async function viewLesson(id) {
  const G = E.graph();
  const meta = G.lessonById[id];
  if (!meta) return viewMissing();
  const state = E.lessonState(id);
  if (state === 'locked') {
    app.innerHTML = `<div class="wrap center-note"><div class="eyebrow">Locked</div><h2>${esc(meta.title)}</h2><p class="mute">This builds on lessons you haven’t mastered yet: ${meta.builds_on.filter((b) => !E.isMastered(b)).map((b) => esc(G.lessonById[b]?.title)).join(', ') || 'earlier courses'}.</p><p><a class="btn" href="#/">Home</a></p></div>`;
    return;
  }
  const L = await E.fetchLesson(id);
  const st = E.startLesson(id);
  st.hints ||= {};
  S.save();
  const steps = buildSteps(L);
  if (st.status === 'mastered') st.step = steps.length - 1;
  current = { L, st, steps, focusQ: null };

  T.setContext(() => {
    const q = current.focusQ ? [...(L.warmup || []), ...L.practice].find((x) => x.id === current.focusQ) : null;
    const step = steps[Math.min(st.step, steps.length - 1)];
    return {
      lessonId: L.id,
      lesson: L.title, course: G.courseById[L.course].title, summary: L.summary,
      current_step: step.name,
      builds_on: L.builds_on.map((b) => ({ title: b.title, summary: b.summary })),
      leads_to: L.leads_to.map((b) => b.title),
      lesson_text: L.text,
      explain_rubric: L.explain.rubric,
      question: q ? {
        prompt: q.prompt_text, type: q.type, solved: !!st.answers[q.id]?.correct,
        attempts: st.answers[q.id]?.attempts || 0, wrong_answers: st.answers[q.id]?.wrong || [],
        hints_given: st.hints[q.id] || 0, solution: q.solution_text,
        options: q.options?.map((o) => o.text),
      } : null,
      onHint: () => { if (q) { st.hints[q.id] = (st.hints[q.id] || 0) + 1; } },
      writtenHint: () => {
        if (!q) return 'Pick a question first (use “Ask Theo” under it), and I will give you the written hints for it.';
        const n = (st.hints[q.id] || 1) - 1;
        return q.hints?.[Math.min(n, q.hints.length - 1)] ? `Hint: ${q.hints_text[Math.min(n, q.hints.length - 1)]}` : 'No more written hints for this one. Try reasoning from the definition in the theory section.';
      },
    };
  });
  drawLesson(true);
}

function drawLesson(scrollTop = false) {
  const { L, st, steps } = current;
  const G = E.graph();
  const n = Math.min(st.step, steps.length - 1);
  const course = G.courseById[L.course];
  app.innerHTML = `<div class="wrap">
    <div class="lesson-head">
      <div class="eyebrow"><a href="#/course/${course.id}" style="color:inherit;text-decoration:none">${esc(course.title)}</a> · ${esc(L.chapter_title)}</div>
      <h1 class="title">${esc(L.title)}</h1>
      <div class="small mute">About ${L.minutes} minutes</div>
      ${L.builds_on.length ? `<div class="chips"><span class="small mute" style="align-self:center">Builds on</span>${L.builds_on.map((b) => `<a class="chip" href="#/lesson/${b.id}">${esc(b.title)}</a>`).join('')}</div>` : ''}
      <div class="rail">${steps.map((s, i) => `<span class="${i < n ? 'done' : i === n ? 'now' : ''}" title="${esc(s.name)}"></span>`).join('')}</div>
      <div class="rail-label">${esc(steps[n].name)}</div>
    </div>
    ${steps.slice(0, n + 1).map((s, i) => `<section class="step" data-step="${s.key}">${stepHTML(s, L, st, i === n)}</section>`).join('')}
  </div>`;
  bindLesson();
  if (scrollTop) window.scrollTo(0, 0);
}

function bindLesson() {
  const { L, st, steps } = current;
  const allQ = [...(L.warmup || []), ...L.practice];
  const findQ = (id) => allQ.find((q) => q.id === id);
  const keepScroll = (fn) => { const y = window.scrollY; fn(); window.scrollTo(0, y); };

  app.querySelectorAll('[data-next]').forEach((b) => (b.onclick = () => {
    if (steps[st.step]?.key === 'reflect') {
      E.masterLesson(L.id);
      toast('Lesson mastered');
    }
    st.step = Math.min(st.step + 1, steps.length - 1);
    S.save();
    drawLesson();
    const last = app.querySelector('.step:last-of-type');
    if (last) last.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  const check = (q, raw) => {
    const a = (st.answers[q.id] ||= { attempts: 0, wrong: [] });
    const r = numericCorrect(q, raw);
    current.focusQ = q.id;
    if (r === null) { toast('Enter a number, like 2.5 lakh or 250000'); return; }
    a.attempts++; a.value = raw;
    if (r) { a.correct = true; a.lastWrong = false; }
    else { a.lastWrong = true; a.lastWhy = q.wrong_feedback || ''; a.wrong.push(raw); if (a.wrong.length > 6) a.wrong.shift(); }
    S.save(); keepScroll(() => drawLesson());
  };
  app.querySelectorAll('input[data-q]').forEach((i) => {
    i.onkeydown = (e) => { if (e.key === 'Enter') check(findQ(i.dataset.q), i.value); };
    i.onfocus = () => { current.focusQ = i.dataset.q; };
  });
  app.querySelectorAll('[data-check]').forEach((b) => (b.onclick = () => {
    const q = findQ(b.dataset.check);
    check(q, app.querySelector(`input[data-q="${q.id}"]`).value);
  }));
  app.querySelectorAll('.option[data-opt]').forEach((b) => (b.onclick = () => {
    const q = findQ(b.dataset.q); const i = Number(b.dataset.opt);
    const a = (st.answers[q.id] ||= { attempts: 0, wrong: [], picks: [] });
    a.picks ||= [];
    current.focusQ = q.id;
    if (a.picks.includes(i)) return;
    a.picks.push(i); a.attempts++;
    if (q.options[i].correct) { a.correct = true; a.lastWrong = false; }
    else { a.lastWrong = true; a.lastWhy = q.options[i].why_html || ''; a.wrong.push(q.options[i].text); }
    S.save(); keepScroll(() => drawLesson());
  }));
  app.querySelectorAll('[data-hint]').forEach((b) => (b.onclick = () => {
    st.hints[b.dataset.hint] = (st.hints[b.dataset.hint] || 0) + 1; current.focusQ = b.dataset.hint;
    S.save(); keepScroll(() => drawLesson());
  }));
  app.querySelectorAll('[data-theo]').forEach((b) => (b.onclick = () => { current.focusQ = b.dataset.theo; T.openTutor('theo'); }));

  const ex = document.getElementById('explain');
  if (ex) ex.oninput = () => { st.explain = ex.value; S.save(); };
  const chk = document.getElementById('check-ex');
  if (chk) chk.onclick = async () => {
    const words = (st.explain || '').trim().split(/\s+/).filter(Boolean).length;
    if (words < 40) { toast(`Write a little more first (${words} of about 40 words)`); return; }
    chk.disabled = true; chk.textContent = 'Theo is reading…';
    try {
      const r = await T.checkExplanation(L.explain.prompt_text, L.explain.rubric, st.explain);
      st.explainResult = r.html; st.explainTries = (st.explainTries || 0) + 1;
      if (r.verdict === 'pass') st.explainPassed = true;
    } catch (e) { toast(e.message); }
    S.save(); drawLesson();
  };
  const self = document.getElementById('self-ex');
  if (self) self.onclick = () => {
    const words = (st.explain || '').trim().split(/\s+/).filter(Boolean).length;
    const boxes = [...app.querySelectorAll('[data-rub]')];
    if (words < 40) { toast(`Write a little more first (${words} of about 40 words)`); return; }
    if (!boxes.every((b) => b.checked)) { toast('Tick each point only once your explanation really covers it'); return; }
    st.explainPassed = true; S.save(); drawLesson();
  };

  const rf = document.getElementById('reflect');
  if (rf) {
    const r = (S.session.progress.reflections[L.id] ||= {});
    const fin = document.getElementById('finish');
    rf.oninput = () => {
      r.text = rf.value; S.save();
      if (fin) fin.disabled = rf.value.trim().split(/\s+/).filter(Boolean).length < 15;
    };
    const al = document.getElementById('almanac');
    if (al) al.onclick = async () => {
      if ((r.text || '').trim().split(/\s+/).length < 15) { toast('Write a few sentences first'); return; }
      al.disabled = true; al.textContent = 'Almanac is thinking…';
      try { r.reply = await T.reflect(L.almanac.prompt_text, r.text); } catch (e) { toast(e.message); }
      S.save(); drawLesson();
    };
  }
}

/* ---------- review ---------- */
function viewReview() {
  T.hide();
  let queue = E.dueCards();
  let shown = false;
  const total = queue.length;
  const draw = () => {
    if (!queue.length) {
      app.innerHTML = `<div class="wrap center-note"><div class="eyebrow">Review</div><h2>Done.</h2><p class="mute">${total} card${total === 1 ? '' : 's'} reviewed. Each one will come back just before you would forget it.</p><p><button class="btn primary" id="on">Continue</button></p></div>`;
      document.getElementById('on').onclick = learn;
      return;
    }
    const card = queue[0];
    const c = E.cardContent(card.id);
    if (!c) { delete S.session.progress.reviews[card.id]; queue.shift(); return draw(); }
    app.innerHTML = `<div class="wrap"><div class="eyebrow">Review · ${total - queue.length + 1} of ${total}</div>
      <div class="small mute" style="margin:6px 0 18px">From: ${esc(c.lesson.title)}</div>
      <div class="card review-card"><div class="front">${c.q_html}</div>
      ${shown ? `<div class="back prose">${c.a_html}</div>
        <div class="grade-row">${[['Forgot', 0], ['Hard', 1], ['Good', 2], ['Easy', 3]].map(([l, g]) => `<button class="btn" data-g="${g}">${l}<small>${E.preview(card.id, g)}</small></button>`).join('')}</div>`
        : `<p class="small mute">Answer in your head, or out loud, before revealing.</p><div class="continue-row"><button class="btn primary" id="show">Show answer</button></div>`}
      </div></div>`;
    const sh = document.getElementById('show'); if (sh) sh.onclick = () => { shown = true; draw(); };
    app.querySelectorAll('[data-g]').forEach((b) => (b.onclick = () => {
      const g = Number(b.dataset.g);
      E.gradeCard(card.id, g);
      queue.shift();
      if (g === 0) queue.push({ ...card });
      shown = false; S.save(); draw();
    }));
  };
  draw();
}

/* ---------- map ---------- */
function courseStatus(co) {
  const { done, total } = E.courseProgress(co.id);
  if (E.courseMastered(co.id)) return 'mastered';
  if (!E.courseWritten(co) && !E.courseLessons(co).length) return E.courseUnlocked(co.id) ? 'writing' : 'locked';
  if (done > 0 || E.courseLessons(co).some((l) => E.lp(l.id))) return 'progress';
  return E.courseUnlocked(co.id) ? 'available' : 'locked';
}

function viewMap() {
  T.hide();
  const G = E.graph();
  const cols = G.curriculums;
  const W = 1080, colW = W / cols.length, nodeW = colW - 22, nodeH = 72, gap = 18, top = 60;
  const pos = {};
  cols.forEach((cu, ci) => cu.courses.forEach((co, ki) => { pos[co.id] = { x: ci * colW + 11, y: top + ki * (nodeH + gap) }; }));
  const H = top + Math.max(...cols.map((c) => c.courses.length)) * (nodeH + gap) + 20;
  const col = { mastered: 'var(--accent)', progress: 'var(--warm)', available: 'var(--ink-2)', locked: 'var(--line-2)', writing: 'var(--line-2)' };
  let edges = '';
  cols.forEach((cu) => cu.courses.forEach((co) => co.requires.forEach((r) => {
    const a = pos[r], b = pos[co.id];
    if (!a || !b) return;
    const x1 = a.x + nodeW, y1 = a.y + nodeH / 2, x2 = b.x, y2 = b.y + nodeH / 2;
    let d;
    if (Math.abs(a.x - b.x) < 2) d = `M${a.x + nodeW - 14},${a.y + nodeH} C${a.x + nodeW + 4},${(a.y + b.y + nodeH) / 2} ${b.x + nodeW + 4},${(a.y + b.y + nodeH) / 2} ${b.x + nodeW - 14},${b.y}`;
    else if (a.x > b.x) d = `M${a.x},${y1} C${a.x - 40},${y1} ${b.x + nodeW + 40},${y2} ${b.x + nodeW},${y2}`;
    else d = `M${x1},${y1} C${x1 + 40},${y1} ${x2 - 40},${y2} ${x2},${y2}`;
    edges += `<path d="${d}" fill="none" stroke="${E.courseMastered(r) ? 'var(--accent)' : 'var(--line-2)'}" stroke-width="1.2" opacity=".8"/>`;
  })));
  const nodes = cols.map((cu, ci) => `<text x="${ci * colW + 11}" y="30" class="lbl" style="font-size:13px;letter-spacing:.08em;text-transform:uppercase" fill="var(--muted)">${esc(cu.title)}</text>` +
    cu.courses.map((co) => {
      const p = pos[co.id], stt = courseStatus(co), pr = E.courseProgress(co.id);
      const lines = []; let cur = '';
      for (const w of co.title.split(' ')) { if ((cur + ' ' + w).trim().length > 21 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
      lines.push(cur);
      if (lines.length > 2) { lines[1] = lines.slice(1).join(' ').slice(0, 19) + '…'; lines.length = 2; }
      return `<g class="map-node" data-c="${co.id}" transform="translate(${p.x},${p.y})">
        <rect width="${nodeW}" height="${nodeH}" rx="10" fill="var(--card)" stroke="${col[stt]}" stroke-width="${stt === 'locked' || stt === 'writing' ? 1 : 1.6}" ${stt === 'writing' ? 'stroke-dasharray="4 4"' : ''}/>
        <title>${esc(co.title)}</title>
        ${lines.map((ln, i) => `<text x="12" y="${22 + i * 16}" class="lbl" style="font-size:13px" fill="${stt === 'locked' ? 'var(--muted)' : 'var(--ink)'}">${esc(ln)}</text>`).join('')}
        <text x="12" y="${nodeH - 16}" class="lbl" style="font-size:11px" fill="var(--muted)">${stt === 'writing' ? 'being written' : stt === 'locked' && !E.courseLessons(co).length ? 'being written' : `${pr.done} of ${pr.total} lessons`}</text>
        <rect x="12" y="${nodeH - 8}" width="${nodeW - 24}" height="2" rx="1" fill="var(--line)"/>
        <rect x="12" y="${nodeH - 8}" width="${(nodeW - 24) * (pr.done / Math.max(1, pr.total))}" height="2" rx="1" fill="var(--accent)"/>
      </g>`;
    }).join('')).join('');
  const total = Object.keys(G.lessonById).length;
  const mastered = Object.keys(G.lessonById).filter(E.isMastered).length;
  app.innerHTML = `<div class="wide"><div class="eyebrow">The map</div><h1 class="title">Everything connects</h1>
    <p class="mute">${mastered} of ${total} written lessons mastered · ${G.plannedCount} more being written. Lines show what each course builds on.</p>
    <div class="map-legend"><span><i style="background:var(--accent)"></i>Mastered</span><span><i style="background:var(--warm)"></i>In progress</span><span><i style="border:1.5px solid var(--ink-2)"></i>Open</span><span><i style="border:1px dashed var(--line-2)"></i>Being written or locked</span></div>
    <div style="overflow-x:auto"><svg class="map-svg" viewBox="0 0 ${W} ${H}" style="min-width:900px">${edges}${nodes}</svg></div></div>`;
  app.querySelectorAll('.map-node').forEach((n) => (n.onclick = () => go(`#/course/${n.dataset.c}`)));
}

function viewCourse(id) {
  T.hide();
  const G = E.graph();
  const co = G.courseById[id];
  if (!co) return viewMissing();
  const cu = G.currById[co.curriculum];
  app.innerHTML = `<div class="wrap"><div class="eyebrow"><a href="#/map" style="color:inherit;text-decoration:none">${esc(cu.title)}</a></div>
    <h1 class="title">${esc(co.title)}</h1><p class="mute">${esc(co.blurb || '')}</p>
    ${co.requires.length ? `<div class="chips"><span class="small mute" style="align-self:center">Builds on</span>${co.requires.map((r) => `<a class="chip" href="#/course/${r}">${esc(G.courseById[r].title)}</a>`).join('')}</div>` : ''}
    ${co.leads_to?.length ? `<div class="chips"><span class="small mute" style="align-self:center">Leads to</span>${co.leads_to.map((r) => `<a class="chip" href="#/course/${r}">${esc(G.courseById[r].title)}</a>`).join('')}</div>` : ''}
    <div class="course-list">${co.chapters.map((ch, ci) => `<div class="chapter"><div class="eyebrow">Chapter ${ci + 1}</div><h3>${esc(ch.title)}</h3>
      ${ch.lessons ? ch.lessons.map((l) => {
        const s = E.lessonState(l.id);
        const meta = { mastered: 'Mastered', started: 'In progress', available: 'Open', locked: 'Locked' }[s];
        const inner = `<span class="dot">${s === 'mastered' ? '✓' : ''}</span><span>${esc(l.title)}</span><span class="meta">${meta}</span>`;
        return s === 'locked' ? `<div class="lesson-row locked">${inner}</div>` : `<a class="lesson-row ${s}" href="#/lesson/${l.id}">${inner}</a>`;
      }).join('') : ch.plan.map((p) => `<div class="lesson-row planned"><span class="dot"></span><span>${esc(p)}</span><span class="meta">Being written</span></div>`).join('')}
    </div>`).join('')}</div></div>`;
}

/* ---------- account ---------- */
function viewAccount() {
  T.hide();
  const sec = S.session.secrets;
  const G = E.graph();
  const p = S.session.progress;
  const mastered = Object.values(p.lessons).filter((l) => l.status === 'mastered').length;
  const cards = Object.keys(p.reviews).length;
  const mask = (k) => (k ? `${k.slice(0, 10)}…${k.slice(-4)}` : 'Not set');
  app.innerHTML = `<div class="wrap"><div class="eyebrow">Account</div><h1 class="title">Tanvi</h1>
    <dl class="kv">
      <dt>Lessons mastered</dt><dd>${mastered} of ${Object.keys(G.lessonById).length} written</dd>
      <dt>Review cards</dt><dd>${cards} scheduled · ${E.dueCards(999).length} due now</dd>
      <dt>Security</dt><dd>Encrypted with your 10 word passphrase. This device remembers you until you sign out.</dd>
      <dt>Sync</dt><dd id="sync">${sec.githubToken && hasRepo() ? `Saving to ${esc(CONFIG.owner)}/${esc(CONFIG.repo)} · ${S.session.syncState}${S.session.syncError ? ` <span class="err">${esc(S.session.syncError)}</span>` : ''}` : 'This device only. Add a GitHub token to sync.'}</dd>
    </dl>
    <hr class="soft">
    <h2 class="section">Theo and Almanac</h2>
    <form class="form" id="keys">
      <label>Claude API key <span class="small mute">(${mask(sec.anthropicKey)})</span><input class="input" id="ak" type="password" placeholder="Paste a new key to replace it" autocomplete="off"></label>
      <label>Model
        <select class="input" id="model">
          ${[['claude-sonnet-5-5', 'Claude Sonnet 5.5 · balanced (recommended)'], ['claude-opus-5-5', 'Claude Opus 5.5 · deepest, costs more'], ['claude-haiku-5-5', 'Claude Haiku 5.5 · fastest, cheapest']].map(([v, l]) => `<option value="${v}" ${sec.model === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select></label>
      ${hasRepo() ? `<label>GitHub token <span class="small mute">(${mask(sec.githubToken)})</span><input class="input" id="gt" type="password" placeholder="github_pat_…" autocomplete="off">
        <span class="small mute">Fine-grained token for <b>${esc(CONFIG.owner)}/${esc(CONFIG.repo)}</b> only, with Contents: Read and write. <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Create one</a>.</span></label>` : ''}
      <div class="err" id="ke"></div>
      <div class="continue-row"><button class="btn primary">Save</button></div>
    </form>
    <hr class="soft">
    <h2 class="section">Passphrase</h2>
    <p class="small mute">Replace your ten words with new ones. Every device will need the new words.</p>
    <div id="pp"><button class="btn" id="newpp">Make a new passphrase</button></div>
    <hr class="soft">
    <h2 class="section">Your data</h2>
    <div class="continue-row" style="justify-content:flex-start">
      <button class="btn" id="export">Download my progress</button>
      <button class="btn" id="out">Sign out of this device</button>
      <button class="btn ghost" id="reset">Reset all progress</button>
    </div>
    <p class="small mute" style="margin-top:40px">Build ${esc(G.build)}</p>
  </div>`;
  S.onSync(() => { const el = document.getElementById('sync'); if (el) el.innerHTML = `Saving to ${esc(CONFIG.owner)}/${esc(CONFIG.repo)} · ${S.session.syncState}${S.session.syncError ? ` <span class="err">${esc(S.session.syncError)}</span>` : ''}`; });
  document.getElementById('keys').onsubmit = async (ev) => {
    ev.preventDefault();
    const e = document.getElementById('ke'); e.textContent = '';
    const patch = { model: document.getElementById('model').value };
    const ak = document.getElementById('ak').value.trim(); if (ak) patch.anthropicKey = ak;
    const gt = (document.getElementById('gt')?.value || '').trim();
    try {
      if (gt) { const t = await testToken(gt); if (!t.ok) throw new Error(t.why); patch.githubToken = gt; }
      await S.updateSecrets(patch); toast('Saved'); viewAccount();
    } catch (err) { e.textContent = err.message; }
  };
  document.getElementById('newpp').onclick = () => {
    const words = generatePassphrase();
    document.getElementById('pp').innerHTML = `<div class="passphrase">${words.map((w, i) => `<span><i>${i + 1}</i>${w}</span>`).join(' ')}</div>
      <form class="form" id="ppf" style="margin-top:14px"><label>Type the new words back<textarea class="input" id="ppi" rows="2" autocomplete="off" spellcheck="false"></textarea></label><div class="err" id="ppe"></div><div class="continue-row"><button class="btn primary">Switch to these words</button></div></form>`;
    document.getElementById('ppf').onsubmit = async (ev) => {
      ev.preventDefault();
      if (normalise(document.getElementById('ppi').value) !== words.join(' ')) { document.getElementById('ppe').textContent = 'The words do not match yet.'; return; }
      try { await S.changePassphrase(words.join(' ')); toast('Passphrase changed'); viewAccount(); } catch (err) { document.getElementById('ppe').textContent = err.message; }
    };
  };
  document.getElementById('export').onclick = () => {
    const blob = new Blob([JSON.stringify(S.session.progress, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `immersive-growth-progress-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };
  document.getElementById('out').onclick = async () => {
    if (!confirmInline('out', 'Sign out? You will need your ten words to come back on this device.')) return;
    await S.save(true).catch(() => {}); await S.signOut(); go('#/');
  };
  document.getElementById('reset').onclick = async () => {
    if (!confirmInline('reset', 'This erases every lesson, review and reflection. Press again to confirm.')) return;
    S.session.progress = S.emptyProgress(); await S.save(true); toast('Progress reset'); viewAccount();
  };
}
const armed = {};
function confirmInline(k, msg) {
  if (armed[k] && Date.now() - armed[k] < 6000) { armed[k] = 0; return true; }
  armed[k] = Date.now(); toast(msg); return false;
}

function viewMissing() { app.innerHTML = `<div class="wrap center-note"><h2>Not found</h2><p><a class="btn" href="#/">Home</a></p></div>`; }

/* ---------- router ---------- */
const PUBLIC = ['/signin', '/signup', '/'];
async function route() {
  const h = location.hash.replace(/^#/, '') || '/';
  const [, a, b] = h.split('/');
  const r = '/' + (a || '');
  document.getElementById('topbar').classList.toggle('lined', r !== '/');
  if (!S.signedIn() && !PUBLIC.includes(r)) { go('#/signin'); return; }
  renderNav(r);
  if (r === '/') return viewHome();
  if (r === '/signup') return viewSignup();
  if (r === '/signin') return S.signedIn() ? go('#/') : viewSignin();
  if (r === '/lesson') return viewLesson(b);
  if (r === '/review') return viewReview();
  if (r === '/map') return viewMap();
  if (r === '/course') return viewCourse(b);
  if (r === '/account') return viewAccount();
  if (r === '/rest') return viewRest();
  if (r === '/caughtup') return viewCaughtUp();
  viewMissing();
}

(async function boot() {
  app.innerHTML = '';
  await E.loadGraph();
  await S.resume().catch(() => false);
  window.addEventListener('hashchange', route);
  route();
})();
