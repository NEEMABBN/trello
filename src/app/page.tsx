"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import InlineTitle from "@/components/inline-edit/InlineTitle";
import ListContainer from "@/components/board/ListContainer";
import { useBoard } from "@/store/board.store";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

const asString = (v: unknown) => String(v);

const isList = (id: string) => id.startsWith("list:");
const isCard = (id: string) => id.startsWith("card:");
const listIdFrom = (prefixed: string) => prefixed.slice(5);
const cardIdFrom = (prefixed: string) => prefixed.slice(5);

export default function Home() {
  const { snap, setSnap, setBoardTitle, addList, moveCard } = useBoard();

  const hydrated = useSyncExternalStore(
    () => () => {}, // subscribe (no-op)
    () => true, // client snapshot
    () => false, // server snapshot
  );

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isAddingList) inputRef.current?.focus();
  }, [isAddingList]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  // lists sortable ids (prefixed)
  const listSortableIds = useMemo(
    () => snap.board.listIds.map((id) => `list:${id}`),
    [snap.board.listIds],
  );

  const onDragOver = (event: DragOverEvent) => {
    const aId = asString(event.active.id);
    const oId = event.over ? asString(event.over.id) : null;
    if (!oId) return;

    if (!isCard(aId)) return;

    const draggedCardId = cardIdFrom(aId);
    const dragged = snap.cards[draggedCardId];
    if (!dragged) return;

    let targetListId: string | null = null;
    let targetIndex = 0;

    if (isList(oId)) {
      targetListId = listIdFrom(oId);
      targetIndex = snap.lists[targetListId]?.cardIds.length ?? 0;
    } else if (isCard(oId)) {
      const overCardId = cardIdFrom(oId);
      const overCard = snap.cards[overCardId];
      if (!overCard) return;

      targetListId = overCard.listId;
      const ids = snap.lists[targetListId]?.cardIds ?? [];
      targetIndex = Math.max(0, ids.indexOf(overCardId));
    }

    if (!targetListId) return;

    if (dragged.listId !== targetListId) {
      moveCard(draggedCardId, targetListId, targetIndex);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const aId = asString(event.active.id);
    const oId = event.over ? asString(event.over.id) : null;
    if (!oId) return;

    if (isList(aId) && isList(oId)) {
      const fromListId = listIdFrom(aId);
      const toListId = listIdFrom(oId);

      const oldIndex = snap.board.listIds.indexOf(fromListId);
      const newIndex = snap.board.listIds.indexOf(toListId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      const next = structuredClone(snap);
      next.board.listIds = arrayMove(next.board.listIds, oldIndex, newIndex);
      setSnap(next);
      return;
    }

    if (isCard(aId)) {
      const draggedCardId = cardIdFrom(aId);
      const dragged = snap.cards[draggedCardId];
      if (!dragged) return;

      let toListId = dragged.listId;
      let toIndex = 0;

      if (isList(oId)) {
        toListId = listIdFrom(oId);
        toIndex = snap.lists[toListId]?.cardIds.length ?? 0;
      } else if (isCard(oId)) {
        const overCardId = cardIdFrom(oId);
        const overCard = snap.cards[overCardId];
        if (!overCard) return;

        toListId = overCard.listId;
        const ids = snap.lists[toListId]?.cardIds ?? [];
        toIndex = Math.max(0, ids.indexOf(overCardId));
      } else {
        return;
      }

      // Reorder inside same list
      if (toListId === dragged.listId && isCard(oId)) {
        const ids = snap.lists[toListId]?.cardIds ?? [];
        const oldIndex = ids.indexOf(draggedCardId);
        const newIndex = ids.indexOf(cardIdFrom(oId));

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const next = structuredClone(snap);
        next.lists[toListId].cardIds = arrayMove(ids, oldIndex, newIndex);
        setSnap(next);
        return;
      }

      // Cross-list move OR drop to end of list
      moveCard(draggedCardId, toListId, toIndex);
    }
  };

  if (!hydrated) {
    return (
      <main className="page">
        <div className="board-shell">
          <div style={{ color: "#94a3b8" }}>Loading board…</div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="board-shell">
        <div className="board-title">
          <InlineTitle
            value={snap.board.title}
            onChange={setBoardTitle}
            fontSize="1.6rem"
            bold
          />
        </div>

        {/* Add List */}
        <div className="add-list">
          {isAddingList ? (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                ref={inputRef}
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list title..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const t = newListTitle.trim();
                    if (!t) return;
                    addList(t);
                    setNewListTitle("");
                    setIsAddingList(false);
                  }
                  if (e.key === "Escape") {
                    setIsAddingList(false);
                    setNewListTitle("");
                  }
                }}
                style={{
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid #334155",
                  background: "#1e293b",
                  color: "#f1f5f9",
                  flex: 1,
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const t = newListTitle.trim();
                  if (!t) return;
                  addList(t);
                  setNewListTitle("");
                  setIsAddingList(false);
                }}
                style={{
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.4rem 0.8rem",
                  cursor: "pointer",
                }}
              >
                ✓
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingList(true)}
              style={{
                background: "transparent",
                color: "#94a3b8",
                border: "1px dashed #475569",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              + Add List
            </button>
          )}
        </div>

        {/* Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={listSortableIds}
            strategy={horizontalListSortingStrategy}
          >
            <div className="lists-row">
              {snap.board.listIds.map((listId) => (
                <ListContainer key={listId} id={listId} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
}
