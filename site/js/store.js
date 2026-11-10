// Session, progress and sync.
import * as V from './vault.js';
import * as GH from './github.js';

const LS_VAULT = 'ig.vault';
const LS_PROGRESS = 'ig.progress';

export const session = { key: null, secrets: null, progress: null, vaultDoc: null, syncState: 'idle', syncError: '' };

export function emptyProgress() {
  return { v: 1, lessons: {}, reviews: {}, log: [], misconceptions: [], chats: {}, reflections: {}, courseTouched: {}, updatedAt: 0 };
}

export const signedIn = () => Boolean(session.key && session.progress);

export function localVault() {
  try { return JSON.parse(localStorage.getItem(LS_VAULT) || 'null'); } catch { return null; }
}

// Find a vault: on this device first, then in the repo.
export async function findVault() {
  const local = localVault();
  if (local) return { doc: local, where: 'device' };
  try {
    const remote = await GH.readFile('vault.json');
    if (remote) return { doc: remote.data, where: 'repo' };
  } catch (e) { /* offline or not configured */ }
  return null;
}

async function loadProgressAfterUnlock() {
  let local = null;
  try {
    const box = JSON.parse(localStorage.getItem(LS_PROGRESS) || 'null');
    if (box) local = await V.decryptJSON(session.key, box);
  } catch { local = null; }
  let remote = null;
  if (session.secrets.githubToken && GH.hasRepo()) {
    try {
      const f = await GH.readFile('progress.json', session.secrets.githubToken);
      if (f) remote = await V.decryptJSON(session.key, f.data);
    } catch (e) { session.syncError = e.message; }
  }
  const pick = [local, remote].filter(Boolean).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
  session.progress = Object.assign(emptyProgress(), pick || {});
}

export async function signUp(phrase, secrets) {
  const { doc, key } = await V.createVault(phrase, secrets);
  session.key = key; session.secrets = secrets; session.vaultDoc = doc;
  session.progress = emptyProgress();
  localStorage.setItem(LS_VAULT, JSON.stringify(doc));
  await V.idbSet('key', key);
  if (secrets.githubToken && GH.hasRepo()) {
    await GH.writeFile('vault.json', doc, secrets.githubToken, 'Create vault');
  }
  await save(true);
}

export async function signIn(phrase, doc) {
  const { key, secrets } = await V.unlockVault(doc, phrase);
  session.key = key; session.secrets = secrets; session.vaultDoc = doc;
  localStorage.setItem(LS_VAULT, JSON.stringify(doc));
  await V.idbSet('key', key);
  await loadProgressAfterUnlock();
}

// Silent unlock on a device that has been signed in before.
export async function resume() {
  const doc = localVault();
  if (!doc) return false;
  const key = await V.idbGet('key').catch(() => null);
  if (!key) return false;
  try {
    session.secrets = await V.decryptJSON(key, doc.secrets);
    session.key = key; session.vaultDoc = doc;
    await loadProgressAfterUnlock();
    return true;
  } catch { return false; }
}

export async function signOut() {
  await V.idbDel('key');
  localStorage.removeItem(LS_PROGRESS);
  localStorage.removeItem(LS_VAULT);
  session.key = null; session.secrets = null; session.progress = null; session.vaultDoc = null;
}

export async function updateSecrets(patch) {
  session.secrets = { ...session.secrets, ...patch };
  session.vaultDoc = await V.resealSecrets(session.vaultDoc, session.key, session.secrets);
  localStorage.setItem(LS_VAULT, JSON.stringify(session.vaultDoc));
  if (session.secrets.githubToken && GH.hasRepo()) {
    await GH.writeFile('vault.json', session.vaultDoc, session.secrets.githubToken, 'Update vault');
    await save(true);
  }
}

export async function changePassphrase(newPhrase) {
  const { doc, key } = await V.createVault(newPhrase, session.secrets);
  session.key = key; session.vaultDoc = doc;
  localStorage.setItem(LS_VAULT, JSON.stringify(doc));
  await V.idbSet('key', key);
  if (session.secrets.githubToken && GH.hasRepo()) await GH.writeFile('vault.json', doc, session.secrets.githubToken, 'Rotate passphrase');
  await save(true);
}

let timer = null;
const listeners = new Set();
export const onSync = (fn) => listeners.add(fn);
const emit = () => listeners.forEach((fn) => fn(session.syncState));

export async function save(now = false) {
  if (!signedIn()) return;
  session.progress.updatedAt = Date.now();
  const box = await V.encryptJSON(session.key, session.progress);
  localStorage.setItem(LS_PROGRESS, JSON.stringify(box));
  if (!session.secrets.githubToken || !GH.hasRepo()) return;
  clearTimeout(timer);
  const push = async () => {
    session.syncState = 'saving'; emit();
    try {
      const b = await V.encryptJSON(session.key, session.progress);
      await GH.writeFile('progress.json', { v: 1, ...b, updatedAt: session.progress.updatedAt }, session.secrets.githubToken, 'Save progress');
      session.syncState = 'saved'; session.syncError = '';
    } catch (e) { session.syncState = 'error'; session.syncError = e.message; }
    emit();
  };
  if (now) await push(); else timer = setTimeout(push, 4000);
}

// Push any pending save when the tab is hidden.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && timer) { clearTimeout(timer); timer = null; save(true); }
});
