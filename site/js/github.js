// Tiny GitHub contents API client. Encrypted files live on a separate `vault`
// branch so saving progress never triggers a site rebuild.
import { CONFIG } from './config.js';

const API = 'https://api.github.com';
const BRANCH = 'vault';

function headers(token) {
  const h = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}
const repoPath = () => `${API}/repos/${CONFIG.owner}/${CONFIG.repo}`;
export const hasRepo = () => Boolean(CONFIG.owner && CONFIG.repo);

const toB64 = (s) => btoa(unescape(encodeURIComponent(s)));
const fromB64 = (s) => decodeURIComponent(escape(atob(s.replace(/\n/g, ''))));

export async function readFile(path, token) {
  if (!hasRepo()) return null;
  const r = await fetch(`${repoPath()}/contents/${path}?ref=${BRANCH}&t=${Date.now()}`, { headers: headers(token), cache: 'no-store' });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub read failed (${r.status})`);
  const j = await r.json();
  return { sha: j.sha, data: JSON.parse(fromB64(j.content)) };
}

async function ensureBranch(token) {
  const r = await fetch(`${repoPath()}/branches/${BRANCH}`, { headers: headers(token) });
  if (r.ok) return;
  const repo = await (await fetch(repoPath(), { headers: headers(token) })).json();
  const base = await (await fetch(`${repoPath()}/git/ref/heads/${repo.default_branch}`, { headers: headers(token) })).json();
  const c = await fetch(`${repoPath()}/git/refs`, {
    method: 'POST', headers: headers(token),
    body: JSON.stringify({ ref: `refs/heads/${BRANCH}`, sha: base.object.sha }),
  });
  if (!c.ok && c.status !== 422) throw new Error(`Could not create the vault branch (${c.status})`);
}

export async function writeFile(path, data, token, message) {
  await ensureBranch(token);
  let sha;
  const existing = await fetch(`${repoPath()}/contents/${path}?ref=${BRANCH}&t=${Date.now()}`, { headers: headers(token), cache: 'no-store' });
  if (existing.ok) sha = (await existing.json()).sha;
  const r = await fetch(`${repoPath()}/contents/${path}`, {
    method: 'PUT', headers: headers(token),
    body: JSON.stringify({ message: message || `Update ${path}`, content: toB64(JSON.stringify(data, null, 1)), branch: BRANCH, sha }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`GitHub save failed (${r.status}): ${t.slice(0, 140)}`);
  }
  return true;
}

export async function testToken(token) {
  const r = await fetch(repoPath(), { headers: headers(token) });
  if (!r.ok) return { ok: false, why: `GitHub said ${r.status}. Check the token and that it can access ${CONFIG.owner}/${CONFIG.repo}.` };
  const j = await r.json();
  if (!j.permissions || !j.permissions.push) return { ok: false, why: 'The token can read but not write. Give it Contents: Read and write.' };
  return { ok: true };
}
