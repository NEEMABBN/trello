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

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `list:${id}`,
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

  const cardSortableIds = list.cardIds.map((cardId) => `card:${cardId}`);

  return (
    <div className="list glass">
      {/* Header */}
      <div className="list__header" {...(dragHandleProps ?? {})}>
        <div className="list__title">
          <InlineTitle value={list.title} onChange={handleTitleChange} bold />
        </div>

        <button
          type="button"
          onClick={() => removeList(list.id)}
          className="icon-btn icon-btn--danger"
          title="Delete list"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Cards */}
      <div ref={setDroppableRef} className="list__cards">
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
      <div className="list__footer">
        {isAdding ? (
          <div className="add-card">
            <input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter card title..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCard();
                if (e.key === "Escape") setIsAdding(false);
              }}
              className="text-input"
            />

            <div className="add-card__actions">
              <button
                type="button"
                onClick={handleAddCard}
                className="btn btn--primary"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn btn--ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="btn btn--dashed"
          >
            + Add Card
          </button>
        )}
      </div>
    </div>
  );
}
