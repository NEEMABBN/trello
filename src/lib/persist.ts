import type { Snapshot } from "@/types/board";

const STORAGE_KEY = "trello:snapshot";
const STORAGE_VERSION = 1;

export function loadSnapshot(): Snapshot | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Snapshot;

    // basic validation
    if (!parsed || parsed.version !== STORAGE_VERSION) return null;
    if (!parsed.board || !parsed.lists || !parsed.cards) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveSnapshot(snap: Snapshot): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
  } catch {
    // ignore quota / storage errors
  }
}
