import { promises as fs } from 'fs';
import path from 'path';
import { put, list, del } from '@vercel/blob';
import type { Script, VerbalHook, PreHook } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SCRIPTS_FILE = path.join(DATA_DIR, 'scripts.json');
const HOOKS_FILE = path.join(DATA_DIR, 'hooks.json');
const PREHOOKS_FILE = path.join(DATA_DIR, 'preHooks.json');

const SCRIPTS_PREFIX = 'scripts/';

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

async function listScriptBlobs(): Promise<BlobEntry[]> {
  const { blobs } = await list({ prefix: SCRIPTS_PREFIX });
  return blobs.map((b) => ({
    url: b.url,
    pathname: b.pathname,
    uploadedAt: new Date(b.uploadedAt),
  }));
}

async function readScriptsFromBlob(): Promise<Script[] | null> {
  try {
    const blobs = await listScriptBlobs();
    if (blobs.length === 0) return null;
    blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    const latest = blobs[0];
    const res = await fetch(latest.url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as Script[];
  } catch {
    return null;
  }
}

async function writeScriptsToBlob(scripts: Script[]): Promise<void> {
  // Capture existing versions so we can remove them after a successful write
  const existing = await listScriptBlobs().catch(() => [] as BlobEntry[]);

  // New versioned write — random suffix means a fresh URL, no CDN staleness
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${SCRIPTS_PREFIX}scripts-${ts}.json`;
  await put(filename, JSON.stringify(scripts, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true,
    cacheControlMaxAge: 0,
  });

  // Best-effort cleanup of the previous versions
  if (existing.length > 0) {
    try {
      await del(existing.map((b) => b.url));
    } catch {
      /* non-fatal */
    }
  }
}

async function ensureSeeded(): Promise<Script[]> {
  if (!hasBlob()) {
    return readSeed<Script[]>(SCRIPTS_FILE);
  }
  const fromBlob = await readScriptsFromBlob();
  if (fromBlob) return fromBlob;
  // First run — seed blob from bundled JSON.
  const seed = await readSeed<Script[]>(SCRIPTS_FILE);
  await writeScriptsToBlob(seed);
  return seed;
}

export async function getScripts(): Promise<Script[]> {
  return ensureSeeded();
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
  if (hasBlob()) {
    await writeScriptsToBlob(all);
  } else {
    await writeFileFallback(SCRIPTS_FILE, all);
  }
  return updated;
}

export async function createScript(script: Script): Promise<Script> {
  const all = await getScripts();
  all.push(script);
  if (hasBlob()) {
    await writeScriptsToBlob(all);
  } else {
    await writeFileFallback(SCRIPTS_FILE, all);
  }
  return script;
}

export async function deleteScript(id: string): Promise<boolean> {
  const all = await getScripts();
  const next = all.filter((s) => s.id !== id);
  if (next.length === all.length) return false;
  if (hasBlob()) {
    await writeScriptsToBlob(next);
  } else {
    await writeFileFallback(SCRIPTS_FILE, next);
  }
  return true;
}

export async function getHooks(): Promise<VerbalHook[]> {
  return readSeed<VerbalHook[]>(HOOKS_FILE);
}

export async function getPreHooks(): Promise<PreHook[]> {
  return readSeed<PreHook[]>(PREHOOKS_FILE);
}

export async function getNextScriptId(currentId: string): Promise<string | null> {
  const all = await getScripts();
  const sorted = [...all].sort((a, b) => a.priorityRank - b.priorityRank);
  const idx = sorted.findIndex((s) => s.id === currentId);
  if (idx === -1 || idx === sorted.length - 1) return null;
  return sorted[idx + 1].id;
}

export async function resetScripts(): Promise<Script[]> {
  const seed = await readSeed<Script[]>(SCRIPTS_FILE);
  if (hasBlob()) {
    await writeScriptsToBlob(seed);
  } else {
    await writeFileFallback(SCRIPTS_FILE, seed);
  }
  return seed;
}
