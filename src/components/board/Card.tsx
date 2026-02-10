"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useBoard } from "@/store/board.store";
import InlineTitle from "@/components/inline-edit/InlineTitle";
import CardCommentsModal from "@/components/modal/CardCommentsModal";

export default function Card({ id }: { id: string }) {
  const { snap, setSnap } = useBoard();
  const card = snap.cards[id];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sortableId = `card:${id}`;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  if (!card) return null;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    opacity: isDragging ? 0.85 : 1,
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
        style={{
          ...style,
          background: "#334155",
          borderRadius: "8px",
          padding: "0.6rem 0.8rem",
          color: "#f1f5f9",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <InlineTitle
            value={card.title}
            onChange={handleTitleChange}
            fontSize="0.95rem"
            color="#f1f5f9"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          title="View or add comments"
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.25rem",
            flexShrink: 0,
          }}
        >
          <MessageSquare size={16} />
        </button>
      </div>

      {isModalOpen && (
        <CardCommentsModal
          cardId={card.id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
