// Passphrase vault. Everything personal is encrypted in the browser with a key
// derived from the 10 word passphrase. The passphrase itself is never stored.
import { WORDS } from './wordlist.js';

const ITER = 600000;
const CHECK = 'immersive-growth:v1';
const enc = new TextEncoder();
const dec = new TextDecoder();

const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export function normalise(phrase) {
  return phrase.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean).join(' ');
}

export function generatePassphrase(n = 10) {
  // 2048 words, 11 bits each, so 10 words is about 110 bits.
  const out = [];
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  for (const x of buf) out.push(WORDS[x % 2048]); // 2^32 is divisible by 2048, so no bias
  return out;
}

export function checkWords(phrase) {
  const words = normalise(phrase).split(' ').filter(Boolean);
  const unknown = words.filter((w) => !WORDS.includes(w));
  return { count: words.length, unknown };
}

async function deriveKey(phrase, salt) {
  const base = await crypto.subtle.importKey('raw', enc.encode(normalise(phrase)), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptJSON(key, obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(obj)));
  return { iv: b64(iv), ct: b64(ct) };
}

export async function decryptJSON(key, box) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(box.iv) }, key, unb64(box.ct));
  return JSON.parse(dec.decode(pt));
}

// Create a new vault document. Returns { doc, key }.
export async function createVault(phrase, secrets) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(phrase, salt);
  const doc = {
    v: 1,
    kdf: { alg: 'PBKDF2-SHA256', iter: ITER, salt: b64(salt) },
    check: await encryptJSON(key, CHECK),
    secrets: await encryptJSON(key, secrets),
    createdAt: new Date().toISOString(),
  };
  return { doc, key };
}

// Unlock with a passphrase. Throws on a wrong passphrase.
export async function unlockVault(doc, phrase) {
  const key = await deriveKey(phrase, unb64(doc.kdf.salt));
  let ok = false;
  try { ok = (await decryptJSON(key, doc.check)) === CHECK; } catch { ok = false; }
  if (!ok) throw new Error('That passphrase does not open this vault.');
  const secrets = await decryptJSON(key, doc.secrets);
  return { key, secrets };
}

export async function resealSecrets(doc, key, secrets) {
  return { ...doc, secrets: await encryptJSON(key, secrets), updatedAt: new Date().toISOString() };
}

// Remember the (non extractable) key on this device so you don't retype every visit.
const DB = 'immersive-growth';
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
export async function idbSet(k, v) {
  const db = await idb();
  return new Promise((res, rej) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(v, k);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}
export async function idbGet(k) {
  const db = await idb();
  return new Promise((res, rej) => {
    const tx = db.transaction('kv', 'readonly');
    const r = tx.objectStore('kv').get(k);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
export async function idbDel(k) {
  const db = await idb();
  return new Promise((res) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').delete(k);
    tx.oncomplete = () => res();
  });
}
