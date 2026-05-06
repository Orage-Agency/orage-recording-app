import { promises as fs } from 'fs';
import path from 'path';
import type { Script, VerbalHook, PreHook } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SCRIPTS_FILE = path.join(DATA_DIR, 'scripts.json');
const HOOKS_FILE = path.join(DATA_DIR, 'hooks.json');
const PREHOOKS_FILE = path.join(DATA_DIR, 'preHooks.json');

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw) as T;
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

export async function getScripts(): Promise<Script[]> {
  return readJson<Script[]>(SCRIPTS_FILE);
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
  await writeJson(SCRIPTS_FILE, all);
  return updated;
}

export async function createScript(script: Script): Promise<Script> {
  const all = await getScripts();
  all.push(script);
  await writeJson(SCRIPTS_FILE, all);
  return script;
}

export async function deleteScript(id: string): Promise<boolean> {
  const all = await getScripts();
  const next = all.filter((s) => s.id !== id);
  if (next.length === all.length) return false;
  await writeJson(SCRIPTS_FILE, next);
  return true;
}

export async function getHooks(): Promise<VerbalHook[]> {
  return readJson<VerbalHook[]>(HOOKS_FILE);
}

export async function getPreHooks(): Promise<PreHook[]> {
  return readJson<PreHook[]>(PREHOOKS_FILE);
}

export async function getNextScriptId(currentId: string): Promise<string | null> {
  const all = await getScripts();
  const sorted = [...all].sort((a, b) => a.priorityRank - b.priorityRank);
  const idx = sorted.findIndex((s) => s.id === currentId);
  if (idx === -1 || idx === sorted.length - 1) return null;
  return sorted[idx + 1].id;
}
