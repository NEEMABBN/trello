"use client";

import { useState } from "react";
import { MessageSquare, Trash2, CheckCircle2, Circle } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useBoard } from "@/store/board.store";
import InlineTitle from "@/components/inline-edit/InlineTitle";
import CardCommentsModal from "@/components/modal/CardCommentsModal";

export default function Card({ id }: { id: string }) {
  const { snap, setSnap, toggleCardDone, removeCard } = useBoard();
  const card = snap.cards[id];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sortableId = `card:${id}`;

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: sortableId });

  if (!card) return null;

  const isDone = !!card.done;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    opacity: isDragging ? 0.88 : isDone ? 0.62 : 1,
  };

  const handleTitleChange = (newTitle: string) => {
    const next = structuredClone(snap);
    next.cards[id].title = newTitle;
    setSnap(next);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={`card glass-soft ${isDone ? "card--done" : ""}`}
      >
        <div className="card__title">
          <InlineTitle
            value={card.title}
            onChange={handleTitleChange}
            fontSize="0.95rem"
          />
        </div>

        <div className="card__actions">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCardDone(card.id);
            }}
            className={`icon-btn ${isDone ? "icon-btn--success" : ""}`}
            title={isDone ? "Mark as not done" : "Mark as done"}
          >
            {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="icon-btn"
            title="View or add comments"
          >
            <MessageSquare size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeCard(card.id);
            }}
            className="icon-btn icon-btn--danger"
            title="Delete card"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <CardCommentsModal cardId={card.id} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
