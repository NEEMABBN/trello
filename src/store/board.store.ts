"use client";

import { create } from "zustand";
import type { Snapshot } from "@/types/board";
import { loadSnapshot, saveSnapshot } from "@/lib/persist";

interface BoardState {
  snap: Snapshot;

  setSnap: (snap: Snapshot) => void;

  setBoardTitle: (title: string) => void;

  addList: (title: string) => void;
  removeList: (listId: string) => void;

  addCard: (listId: string, title: string) => void;
  moveCard: (cardId: string, toListId: string, toIndex: number) => void;
}

const initialSnap: Snapshot = loadSnapshot() ?? {
  board: { id: "1", title: "Demo Board", listIds: [] },
  lists: {},
  cards: {},
  version: 1,
};

export const useBoard = create<BoardState>((set, get) => ({
  snap: initialSnap,

  setSnap: (snap) => {
    saveSnapshot(snap);
    set({ snap });
  },

  setBoardTitle: (title) => {
    const snap = structuredClone(get().snap);
    snap.board.title = title;
    get().setSnap(snap);
  },

  addList: (title) => {
    const snap = structuredClone(get().snap);
    const id = crypto.randomUUID();

    snap.lists[id] = { id, title, cardIds: [] };
    snap.board.listIds.push(id);

    get().setSnap(snap);
  },

  removeList: (listId) => {
    const snap = structuredClone(get().snap);

    snap.board.listIds = snap.board.listIds.filter((id) => id !== listId);
    delete snap.lists[listId];

    for (const cardId of Object.keys(snap.cards)) {
      if (snap.cards[cardId]?.listId === listId) delete snap.cards[cardId];
    }

    get().setSnap(snap);
  },

  addCard: (listId, title) => {
    const snap = structuredClone(get().snap);
    const id = crypto.randomUUID();

    snap.cards[id] = { id, title, listId, comments: [] };
    // snap.cards[id] = { id, title, listId } as any;

    snap.lists[listId].cardIds.push(id);

    get().setSnap(snap);
  },

  moveCard: (cardId, toListId, toIndex) => {
    const snap = structuredClone(get().snap);

    const card = snap.cards[cardId];
    if (!card) return;

    const fromListId = card.listId;
    const fromList = snap.lists[fromListId];
    const toList = snap.lists[toListId];
    if (!fromList || !toList) return;

    fromList.cardIds = fromList.cardIds.filter((id) => id !== cardId);
    toList.cardIds.splice(toIndex, 0, cardId);

    card.listId = toListId;

    get().setSnap(snap);
  },
}));
