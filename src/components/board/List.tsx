// src/components/board/List.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import { useBoard } from "@/store/board.store";
import InlineTitle from "@/components/inline-edit/InlineTitle";
import Card from "@/components/board/Card";

type DragHandleProps = React.HTMLAttributes<HTMLDivElement>;

export default function List({
  id,
  dragHandleProps,
}: {
  id: string;
  dragHandleProps?: DragHandleProps;
}) {
  const { snap, addCard, setSnap, removeList } = useBoard();

  const list = snap.lists[id];
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Droppable area for cards in this list (so you can drop into empty list too)
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `list:${id}`, // IMPORTANT: same prefix used in page.tsx logic
  });

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  if (!list) return null;

  const handleTitleChange = (title: string) => {
    const next = structuredClone(snap);
    next.lists[id].title = title.trim();
    setSnap(next);
  };

  const handleAddCard = () => {
    const t = newTitle.trim();
    if (!t) return;
    addCard(id, t);
    setNewTitle("");
    setIsAdding(false);
  };

  // IMPORTANT: prefixed card ids for SortableContext
  const cardSortableIds = list.cardIds.map((cardId) => `card:${cardId}`);

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "1rem",
        borderRadius: "8px",
        minWidth: "260px",
        color: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {/* Header (drag handle lives here) */}
      <div
        {...(dragHandleProps ?? {})}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: dragHandleProps ? "grab" : "default",
          marginBottom: "0.25rem",
          gap: "0.5rem",
          userSelect: "none",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <InlineTitle value={list.title} onChange={handleTitleChange} bold />
        </div>

        <button
          type="button"
          onClick={() => removeList(list.id)}
          style={{
            background: "transparent",
            border: "none",
            color: "#f87171",
            cursor: "pointer",
            padding: "0.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          title="Delete list"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Cards container (droppable + sortable) */}
      <div
        ref={setDroppableRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          minHeight: "24px",
          marginBottom: "0.5rem",
        }}
      >
        <SortableContext
          items={cardSortableIds}
          strategy={verticalListSortingStrategy}
        >
          {list.cardIds.map((cardId) => (
            <Card key={cardId} id={cardId} />
          ))}
        </SortableContext>
      </div>

      {/* Add card */}
      {isAdding ? (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter card title..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddCard();
              if (e.key === "Escape") setIsAdding(false);
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#f1f5f9",
              fontSize: "0.9rem",
            }}
          />

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={handleAddCard}
              style={{
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.4rem 0.8rem",
                cursor: "pointer",
                flex: 1,
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              style={{
                background: "transparent",
                border: "1px solid #475569",
                borderRadius: "6px",
                padding: "0.4rem 0.8rem",
                color: "#94a3b8",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          style={{
            background: "transparent",
            color: "#94a3b8",
            border: "1px dashed #475569",
            borderRadius: "6px",
            padding: "0.5rem",
            cursor: "pointer",
            width: "100%",
          }}
        >
          + Add Card
        </button>
      )}
    </div>
  );
}
