// The learning engine: what is unlocked, what comes next, and spaced review.
import { session } from './store.js';

export const DAILY_LESSONS = 2;
let G = null;

export async function loadGraph() {
  if (G) return G;
  G = await (await fetch(`data/graph.json?v=${Date.now()}`)).json();
  G.lessonById = {}; G.courseById = {}; G.currById = {};
  G.curriculums.forEach((cu, ci) => {
    G.currById[cu.id] = cu; cu.index = ci;
    cu.courses.forEach((co, ki) => {
      G.courseById[co.id] = co; co.curriculum = cu.id; co.index = ki;
      co.chapters.forEach((ch) => (ch.lessons || []).forEach((l) => {
        G.lessonById[l.id] = l; l.course = co.id; l.chapter = ch.id; l.curriculum = cu.id;
      }));
    });
  });
  return G;
}
export const graph = () => G;

const P = () => session.progress;
export const lp = (id) => (P() && P().lessons[id]) || null;
export const isMastered = (id) => lp(id)?.status === 'mastered';

export function courseWritten(co) { return co.chapters.every((ch) => ch.lessons && ch.lessons.length); }
export function courseLessons(co) { return co.chapters.flatMap((ch) => ch.lessons || []); }
export function courseMastered(id) {
  const co = G.courseById[id];
  return courseWritten(co) && courseLessons(co).every((l) => isMastered(l.id));
}
export function courseUnlocked(id) { return G.courseById[id].requires.every(courseMastered); }
export function courseProgress(id) {
  const co = G.courseById[id];
  const total = co.chapters.reduce((n, ch) => n + (ch.lessons ? ch.lessons.length : ch.plan.length), 0);
  const done = courseLessons(co).filter((l) => isMastered(l.id)).length;
  return { done, total };
}

export function lessonState(id) {
  const l = G.lessonById[id];
  if (!l) return 'planned';
  if (isMastered(id)) return 'mastered';
  if (lp(id)) return 'started';
  if (!courseUnlocked(l.course)) return 'locked';
  if (!l.builds_on.every(isMastered)) return 'locked';
  return 'available';
}

const today = () => new Date().toLocaleDateString('en-CA');
export function lessonsToday() {
  return (P()?.log || []).filter((e) => e.type === 'mastered' && e.day === today()).length;
}

export function dueCards(limit = 30) {
  const now = Date.now();
  const out = [];
  for (const [id, c] of Object.entries(P()?.reviews || {})) if (c.due <= now) out.push({ id, ...c });
  out.sort((a, b) => a.due - b.due);
  return out.slice(0, limit);
}

export function cardContent(cardId) {
  const [lid, i] = cardId.split('#');
  const l = G.lessonById[lid];
  if (!l) return null;
  const c = l.review[Number(i)];
  return c ? { ...c, lesson: l } : null;
}

// Interleaving: stay in a course until its chapter is done, then move to the
// unlocked course you have touched least recently. People lessons are woven in.
export function nextLesson() {
  const avail = Object.values(G.lessonById).filter((l) => lessonState(l.id) === 'available');
  if (!avail.length) return null;
  const touched = P().courseTouched || {};
  const last = [...(P().log || [])].reverse().find((e) => e.type === 'mastered');
  if (last) {
    const ll = G.lessonById[last.id];
    if (ll) {
      const ch = G.courseById[ll.course].chapters.find((c) => c.id === ll.chapter);
      const sameChapter = avail.find((l) => l.chapter === ch.id);
      if (sameChapter) return sameChapter;
    }
  }
  const recent = (P().log || []).filter((e) => e.type === 'mastered').slice(-3).map((e) => G.lessonById[e.id]?.curriculum);
  const people = avail.filter((l) => l.curriculum === 'people');
  if (people.length && recent.length === 3 && !recent.includes('people')) return people[0];
  const rank = (l) => {
    const co = G.courseById[l.course];
    return [touched[l.course] || 0, G.currById[l.curriculum].index, co.index];
  };
  avail.sort((a, b) => {
    const ra = rank(a), rb = rank(b);
    for (let i = 0; i < 3; i++) if (ra[i] !== rb[i]) return ra[i] - rb[i];
    return 0;
  });
  return avail[0];
}

// What the single Learn button should do right now.
export function nextAction() {
  const due = dueCards();
  if (due.length) return { kind: 'review', label: `Review ${due.length} card${due.length > 1 ? 's' : ''} first`, count: due.length };
  const started = Object.entries(P().lessons).find(([id, s]) => s.status !== 'mastered' && G.lessonById[id]);
  if (started) return { kind: 'lesson', id: started[0], label: `Continue: ${G.lessonById[started[0]].title}` };
  const nl = nextLesson();
  if (lessonsToday() >= DAILY_LESSONS) return { kind: 'rest', next: nl, label: 'Today’s two lessons are done' };
  if (nl) return { kind: 'lesson', id: nl.id, label: `Next: ${nl.title}` };
  return { kind: 'caughtup', label: 'You have caught up with everything written so far' };
}

export function startLesson(id) {
  const p = P();
  if (!p.lessons[id]) p.lessons[id] = { status: 'started', step: 0, answers: {}, hints: {}, explain: '', startedAt: Date.now() };
  p.courseTouched[G.lessonById[id].course] = Date.now();
  return p.lessons[id];
}

export function masterLesson(id) {
  const p = P();
  const s = p.lessons[id];
  if (s.status === 'mastered') return;
  s.status = 'mastered'; s.masteredAt = Date.now();
  p.log.push({ type: 'mastered', id, day: today(), at: Date.now() });
  p.courseTouched[G.lessonById[id].course] = Date.now();
  const l = G.lessonById[id];
  const tomorrow = new Date(); tomorrow.setHours(4, 0, 0, 0); tomorrow.setDate(tomorrow.getDate() + 1);
  l.review.forEach((_, i) => {
    const cid = `${id}#${i}`;
    if (!p.reviews[cid]) p.reviews[cid] = { due: tomorrow.getTime(), interval: 1, ease: 2.4, reps: 0, lapses: 0 };
  });
}

// SM-2 style scheduling. grade: 0 again, 1 hard, 2 good, 3 easy.
export function gradeCard(cardId, grade) {
  const c = P().reviews[cardId];
  if (!c) return;
  const day = 86400000;
  if (grade === 0) { c.lapses++; c.reps = 0; c.interval = 1; c.ease = Math.max(1.3, c.ease - 0.2); c.due = Date.now() + 10 * 60000; return; }
  if (grade === 1) { c.ease = Math.max(1.3, c.ease - 0.15); c.interval = Math.max(1, Math.round(c.interval * 1.2)); }
  if (grade === 2) { c.interval = c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.round(c.interval * c.ease); }
  if (grade === 3) { c.ease += 0.15; c.interval = c.reps === 0 ? 3 : Math.round(c.interval * c.ease * 1.3); }
  c.reps++;
  const d = new Date(Date.now() + c.interval * day); d.setHours(4, 0, 0, 0);
  c.due = d.getTime();
}

export function preview(cardId, grade) {
  const c = P().reviews[cardId];
  if (!c) return '';
  if (grade === 0) return '10 min';
  const iv = grade === 1 ? Math.max(1, Math.round(c.interval * 1.2)) : grade === 2 ? (c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.round(c.interval * c.ease)) : (c.reps === 0 ? 3 : Math.round(c.interval * c.ease * 1.3));
  return iv === 1 ? '1 day' : `${iv} days`;
}

export async function fetchLesson(id) {
  return (await fetch(`data/lessons/${id}.json?v=${G.build}`)).json();
}
