// Builds the site into dist/ and validates the learning graph.
// Fails loudly if any lesson is disconnected, missing, or malformed.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import yaml from 'js-yaml';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'dist');
const errors = [];
const fail = (m) => errors.push(m);

marked.setOptions({ gfm: true, breaks: false });
const md = (s) => (s == null ? '' : marked.parse(String(s)).trim().replace(/<p>\s*(<viz-[a-z-]+><\/viz-[a-z-]+>)\s*<\/p>/g, '$1'));
const mdInline = (s) => (s == null ? '' : marked.parseInline(String(s)).trim());
const plain = (html) => html.replace(/<viz-[^>]*><\/viz-[^>]*>/g, '[interactive visual]').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n{3,}/g, '\n\n').trim();

function parseLesson(id) {
  const file = path.join(ROOT, 'content/lessons', `${id}.md`);
  if (!fs.existsSync(file)) { fail(`Lesson file missing: content/lessons/${id}.md`); return null; }
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) { fail(`${id}: missing frontmatter`); return null; }
  let fm;
  try { fm = yaml.load(m[1]); } catch (e) { fail(`${id}: bad YAML: ${e.message}`); return null; }
  const blocks = [];
  const re = /^:::(\w+)(?:[ \t]+(.*))?\n([\s\S]*?)^:::\s*$/gm;
  let b;
  while ((b = re.exec(m[2]))) blocks.push({ kind: b[1], title: (b[2] || '').trim(), body: b[3] });
  return { fm, blocks };
}

function q(qq, lid, i, prefix) {
  const out = { id: qq.id || `${lid}-${prefix}${i + 1}`, type: qq.type };
  if (!['numeric', 'choice'].includes(qq.type)) fail(`${lid}: question ${out.id} has unknown type ${qq.type}`);
  out.prompt_html = md(qq.prompt); out.prompt_text = plain(out.prompt_html);
  out.solution_html = md(qq.solution); out.solution_text = plain(out.solution_html);
  if (!qq.solution) fail(`${lid}: question ${out.id} needs a solution (Theo uses it to guide hints)`);
  out.hints = (qq.hints || []).map(mdInline); out.hints_text = (qq.hints || []).map((h) => plain(mdInline(h)));
  if ((qq.hints || []).length < 2) fail(`${lid}: question ${out.id} needs at least two written hints`);
  if (qq.type === 'numeric') {
    if (typeof qq.answer !== 'number') fail(`${lid}: numeric question ${out.id} needs a numeric answer`);
    Object.assign(out, { answer: qq.answer, tolerance: qq.tolerance ?? 0.01, abs_tol: qq.abs_tol, unit: qq.unit, unit_label: qq.unit_label, wrong_feedback: mdInline(qq.wrong_feedback || '') });
  } else {
    out.options = (qq.options || []).map((o) => ({ text: o.text, html: mdInline(o.text), correct: !!o.correct, why_html: mdInline(o.why || '') }));
    if (out.options.filter((o) => o.correct).length !== 1) fail(`${lid}: choice question ${out.id} needs exactly one correct option`);
  }
  return out;
}

// ---------- load curriculum ----------
const cur = yaml.load(fs.readFileSync(path.join(ROOT, 'content/curriculum.yaml'), 'utf8'));
const lessonIds = new Set(), courseIds = new Set();
const allLessons = [];
let plannedCount = 0;
for (const cu of cur.curriculums) for (const co of cu.courses) {
  if (courseIds.has(co.id)) fail(`Duplicate course id ${co.id}`);
  courseIds.add(co.id);
  co.requires ||= [];
  for (const ch of co.chapters) {
    if (ch.lessons) for (const l of ch.lessons) {
      if (lessonIds.has(l.id)) fail(`Duplicate lesson id ${l.id}`);
      lessonIds.add(l.id); l.builds_on ||= [];
      allLessons.push({ l, co, ch, cu });
    } else if (ch.plan) plannedCount += ch.plan.length;
    else fail(`Chapter ${ch.id} has neither lessons nor plan`);
  }
}
// course prerequisites exist, no cycles
const courseReq = {};
for (const cu of cur.curriculums) for (const co of cu.courses) {
  courseReq[co.id] = co.requires;
  for (const r of co.requires) if (!courseIds.has(r)) fail(`Course ${co.id} requires unknown course ${r}`);
}
function cyc(graph, kind) {
  const seen = {}, stack = {};
  const visit = (n, trail) => {
    if (stack[n]) { fail(`${kind} cycle: ${[...trail, n].join(' → ')}`); return; }
    if (seen[n]) return;
    seen[n] = stack[n] = true;
    (graph[n] || []).forEach((m) => visit(m, [...trail, n]));
    stack[n] = false;
  };
  Object.keys(graph).forEach((n) => visit(n, []));
}
cyc(courseReq, 'Course');

// ancestors of a course (for allowed cross course links)
const anc = (id, acc = new Set()) => { for (const r of courseReq[id] || []) if (!acc.has(r)) { acc.add(r); anc(r, acc); } return acc; };

const lessonCourse = Object.fromEntries(allLessons.map(({ l, co }) => [l.id, co.id]));
const lessonReq = {};
allLessons.forEach(({ l, co }, idx) => {
  lessonReq[l.id] = l.builds_on;
  for (const b of l.builds_on) {
    if (!lessonIds.has(b)) { fail(`${l.id} builds on unknown lesson ${b}`); continue; }
    const bc = lessonCourse[b];
    if (bc !== co.id && !anc(co.id).has(bc)) fail(`${l.id} builds on ${b}, but course ${co.id} does not require ${bc}`);
  }
  const firstOfCourse = co.chapters.find((c) => c.lessons)?.lessons[0]?.id === l.id;
  if (!l.builds_on.length && !(firstOfCourse && !co.requires.length)) fail(`${l.id} is disconnected: it must build on at least one earlier lesson`);
});
cyc(lessonReq, 'Lesson');

// leads_to
const leads = {};
allLessons.forEach(({ l }) => l.builds_on.forEach((b) => (leads[b] ||= []).push(l.id)));
const courseLeads = {};
for (const [c, rs] of Object.entries(courseReq)) rs.forEach((r) => (courseLeads[r] ||= []).push(c));

// every written lesson except the newest edge must lead somewhere (unless last written)
const lastWritten = allLessons[allLessons.length - 1]?.l.id;
allLessons.forEach(({ l }) => { if (!leads[l.id] && l.id !== lastWritten) fail(`${l.id} leads nowhere: no later lesson builds on it`); });

// ---------- parse lessons ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'data/lessons'), { recursive: true });
const title = Object.fromEntries(allLessons.map(({ l }) => [l.id, l.title]));
const summaries = {};
const parsed = {};
for (const { l } of allLessons) {
  const p = parseLesson(l.id);
  if (!p) continue;
  parsed[l.id] = p;
  summaries[l.id] = p.fm.summary || '';
}
const graphLessonsReview = {};
for (const { l, co, ch } of allLessons) {
  const p = parsed[l.id];
  if (!p) continue;
  const { fm, blocks } = p;
  const id = l.id;
  const puzzle = blocks.find((b) => b.kind === 'puzzle');
  const theory = blocks.filter((b) => b.kind === 'theory');
  if (!puzzle) fail(`${id}: needs a :::puzzle block`);
  if (theory.length < 2) fail(`${id}: needs at least two :::theory blocks`);
  if (!fm.summary) fail(`${id}: needs a summary`);
  if (!fm.explain?.prompt || !(fm.explain?.rubric || []).length) fail(`${id}: needs explain.prompt and explain.rubric`);
  if ((fm.practice || []).length < 3) fail(`${id}: needs at least three practice questions`);
  if ((fm.review || []).length < 3) fail(`${id}: needs at least three review cards`);
  if (!fm.almanac?.prompt) fail(`${id}: needs an almanac.prompt`);
  if (l.builds_on.length && !(fm.warmup || []).length) fail(`${id}: builds on earlier lessons, so it needs warmup recall questions`);
  const theoryOut = theory.map((t) => ({ title: t.title, html: md(t.body) }));
  const puzzleHtml = md(puzzle?.body || '');
  const lesson = {
    id, title: l.title, course: co.id, chapter: ch.id, chapter_title: ch.title,
    minutes: fm.minutes || 40, summary: fm.summary,
    builds_on: l.builds_on.map((b) => ({ id: b, title: title[b], summary: summaries[b] })),
    leads_to: (leads[id] || []).map((b) => ({ id: b, title: title[b] })),
    warmup: (fm.warmup || []).map((x, i) => q(x, id, i, 'w')),
    puzzle: puzzleHtml,
    theory: theoryOut,
    explain: { prompt_html: mdInline(fm.explain?.prompt), prompt_text: plain(mdInline(fm.explain?.prompt || '')), rubric: fm.explain?.rubric || [] },
    practice: (fm.practice || []).map((x, i) => q(x, id, i, 'p')),
    almanac: { prompt_html: mdInline(fm.almanac?.prompt), prompt_text: plain(mdInline(fm.almanac?.prompt || '')) },
    review: (fm.review || []).map((r) => ({ q_html: mdInline(r.q), a_html: md(r.a) })),
  };
  const qids = new Set();
  [...lesson.warmup, ...lesson.practice].forEach((x) => { if (qids.has(x.id)) fail(`${id}: duplicate question id ${x.id}`); qids.add(x.id); });
  for (const t of theoryOut) for (const v of t.html.matchAll(/<(viz-[a-z-]+)/g)) {
    const src = fs.readFileSync(path.join(ROOT, 'site/js/viz/components.js'), 'utf8');
    if (!src.includes(`'${v[1]}'`)) fail(`${id}: uses <${v[1]}> but no such visual exists`);
  }
  lesson.text = plain([puzzleHtml, ...theoryOut.map((t) => `## ${t.title}\n${t.html}`)].join('\n\n')).slice(0, 14000);
  graphLessonsReview[id] = lesson.review;
  fs.writeFileSync(path.join(OUT, 'data/lessons', `${id}.json`), JSON.stringify(lesson));
}

// ---------- graph ----------
let build = 'dev';
try { build = execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch {}
build = `${build}-${Date.now().toString(36)}`;
const graph = {
  build, plannedCount,
  curriculums: cur.curriculums.map((cu) => ({
    id: cu.id, title: cu.title, blurb: cu.blurb,
    courses: cu.courses.map((co) => ({
      id: co.id, title: co.title, blurb: co.blurb, requires: co.requires, leads_to: courseLeads[co.id] || [],
      chapters: co.chapters.map((ch) => ch.lessons
        ? { id: ch.id, title: ch.title, lessons: ch.lessons.map((l) => ({ id: l.id, title: l.title, builds_on: l.builds_on, summary: summaries[l.id], review: graphLessonsReview[l.id] || [] })) }
        : { id: ch.id, title: ch.title, plan: ch.plan }),
    })),
  })),
};
fs.writeFileSync(path.join(OUT, 'data/graph.json'), JSON.stringify(graph));

// ---------- copy site ----------
fs.cpSync(path.join(ROOT, 'site'), OUT, { recursive: true });
let owner = '', repo = '';
const gr = process.env.GITHUB_REPOSITORY || '';
if (gr.includes('/')) [owner, repo] = gr.split('/');
else {
  try {
    const url = execSync('git remote get-url origin', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const mm = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
    if (mm) [, owner, repo] = mm;
  } catch {}
}
if (process.env.IG_NO_REPO) { owner = ''; repo = ''; }
fs.writeFileSync(path.join(OUT, 'js/config.js'), `export const CONFIG = ${JSON.stringify({ owner, repo, build })};\n`);
const idx = path.join(OUT, 'index.html');
fs.writeFileSync(idx, fs.readFileSync(idx, 'utf8').replaceAll('__BUILD__', build));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
fs.copyFileSync(idx, path.join(OUT, '404.html'));

const written = allLessons.length;
if (errors.length) {
  console.error(`\n✗ ${errors.length} problem${errors.length > 1 ? 's' : ''} in the learning graph:\n`);
  errors.forEach((e) => console.error('  • ' + e));
  process.exit(1);
}
console.log(`✓ Graph valid: ${cur.curriculums.length} curriculums, ${courseIds.size} courses, ${written} lessons written, ${plannedCount} planned. Repo: ${owner || '(none)'}/${repo || ''}. Build ${build}`);
