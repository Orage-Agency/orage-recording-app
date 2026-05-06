import { promises as fs } from 'fs';
import path from 'path';
import { put, list, del } from '@vercel/blob';
import type { Script, VerbalHook, PreHook } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SCRIPTS_FILE = path.join(DATA_DIR, 'scripts.json');
const HOOKS_FILE = path.join(DATA_DIR, 'hooks.json');
const PREHOOKS_FILE = path.join(DATA_DIR, 'preHooks.json');

const SCRIPTS_PREFIX = 'scripts/';
const HOOKS_PREFIX = 'hooks/';

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function readSeed<T>(file: string): Promise<T> {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw) as T;
}

async function writeFileFallback<T>(file: string, data: T): Promise<void> {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

interface BlobEntry {
  url: string;
  pathname: string;
  uploadedAt: Date;
}

async function listBlobsAtPrefix(prefix: string): Promise<BlobEntry[]> {
  const { blobs } = await list({ prefix });
  return blobs.map((b) => ({
    url: b.url,
    pathname: b.pathname,
    uploadedAt: new Date(b.uploadedAt),
  }));
}

async function readJsonFromBlob<T>(prefix: string): Promise<T | null> {
  try {
    const blobs = await listBlobsAtPrefix(prefix);
    if (blobs.length === 0) return null;
    blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    const latest = blobs[0];
    const res = await fetch(latest.url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function writeJsonToBlob<T>(prefix: string, basename: string, data: T): Promise<void> {
  const existing = await listBlobsAtPrefix(prefix).catch(() => [] as BlobEntry[]);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${prefix}${basename}-${ts}.json`;
  await put(filename, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true,
    cacheControlMaxAge: 0,
  });
  if (existing.length > 0) {
    try {
      await del(existing.map((b) => b.url));
    } catch {
      /* non-fatal */
    }
  }
}

// ───────────────────── SCRIPTS ─────────────────────

async function ensureScriptsSeeded(): Promise<Script[]> {
  if (!hasBlob()) return readSeed<Script[]>(SCRIPTS_FILE);
  const fromBlob = await readJsonFromBlob<Script[]>(SCRIPTS_PREFIX);
  if (fromBlob) return fromBlob;
  const seed = await readSeed<Script[]>(SCRIPTS_FILE);
  await writeJsonToBlob(SCRIPTS_PREFIX, 'scripts', seed);
  return seed;
}

async function persistScripts(scripts: Script[]): Promise<void> {
  if (hasBlob()) {
    await writeJsonToBlob(SCRIPTS_PREFIX, 'scripts', scripts);
  } else {
    await writeFileFallback(SCRIPTS_FILE, scripts);
  }
}

export async function getScripts(): Promise<Script[]> {
  return ensureScriptsSeeded();
}

export async function getScript(id: string): Promise<Script | null> {
  const all = await getScripts();
  return all.find((s) => s.id === id) ?? null;
}

export async function updateScript(
  id: string,
  patch: Partial<Script>
): Promise<Script | null> {
  const all = await getScripts();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const updated: Script = {
    ...all[idx],
    ...patch,
    id: all[idx].id,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  await persistScripts(all);
  return updated;
}

export async function createScript(script: Script): Promise<Script> {
  const all = await getScripts();
  all.push(script);
  await persistScripts(all);
  return script;
}

export async function deleteScript(id: string): Promise<boolean> {
  const all = await getScripts();
  const next = all.filter((s) => s.id !== id);
  if (next.length === all.length) return false;
  await persistScripts(next);
  return true;
}

export async function getNextScriptId(currentId: string): Promise<string | null> {
  const all = await getScripts();
  const sorted = [...all].sort((a, b) => a.priorityRank - b.priorityRank);
  const idx = sorted.findIndex((s) => s.id === currentId);
  if (idx === -1 || idx === sorted.length - 1) return null;
  return sorted[idx + 1].id;
}

// ───────────────────── HOOKS ─────────────────────

async function ensureHooksSeeded(): Promise<VerbalHook[]> {
  if (!hasBlob()) return readSeed<VerbalHook[]>(HOOKS_FILE);
  const fromBlob = await readJsonFromBlob<VerbalHook[]>(HOOKS_PREFIX);
  if (fromBlob) return fromBlob;
  const seed = await readSeed<VerbalHook[]>(HOOKS_FILE);
  await writeJsonToBlob(HOOKS_PREFIX, 'hooks', seed);
  return seed;
}

async function persistHooks(hooks: VerbalHook[]): Promise<void> {
  if (hasBlob()) {
    await writeJsonToBlob(HOOKS_PREFIX, 'hooks', hooks);
  } else {
    await writeFileFallback(HOOKS_FILE, hooks);
  }
}

export async function getHooks(): Promise<VerbalHook[]> {
  return ensureHooksSeeded();
}

export async function createHook(hook: VerbalHook): Promise<VerbalHook> {
  const all = await getHooks();
  all.push(hook);
  await persistHooks(all);
  return hook;
}

export async function updateHook(
  id: string,
  patch: Partial<VerbalHook>
): Promise<VerbalHook | null> {
  const all = await getHooks();
  const idx = all.findIndex((h) => h.id === id);
  if (idx === -1) return null;
  const updated: VerbalHook = { ...all[idx], ...patch, id: all[idx].id };
  all[idx] = updated;
  await persistHooks(all);
  return updated;
}

export async function deleteHook(id: string): Promise<boolean> {
  const all = await getHooks();
  const next = all.filter((h) => h.id !== id);
  if (next.length === all.length) return false;
  await persistHooks(next);
  return true;
}

// ───────────────────── PRE-HOOKS (seed-only for now) ─────────────────────

export async function getPreHooks(): Promise<PreHook[]> {
  return readSeed<PreHook[]>(PREHOOKS_FILE);
}

export async function resetScripts(): Promise<Script[]> {
  const seed = await readSeed<Script[]>(SCRIPTS_FILE);
  await persistScripts(seed);
  return seed;
}
