"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import { useBoard } from "@/store/board.store";

export default function CardCommentsModal({
  cardId,
  onClose,
}: {
  cardId: string;
  onClose: () => void;
}) {
  const { snap, setSnap } = useBoard();
  const card = snap.cards[cardId];

  const [comment, setComment] = useState("");
  const overlayRef = useRef<HTMLDivElement | null>(null);

  if (typeof document === "undefined") return null;
  if (!card) return null;

  const handleAddComment = () => {
    const text = comment.trim();
    if (!text) return;

    const next = structuredClone(snap);

    next.cards[cardId].comments = next.cards[cardId].comments ?? [];
    next.cards[cardId].comments.push({
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
    });

    setSnap(next);
    setComment("");
  };

  const handleDeleteComment = (commentId: string) => {
    const next = structuredClone(snap);
    const target = next.cards[cardId];
    if (!target) return;

    target.comments = (target.comments ?? []).filter((c) => c.id !== commentId);
    setSnap(next);
  };

  return createPortal(
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        padding: "16px",
      }}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        style={{
          background: "#1e293b",
          color: "#f1f5f9",
          borderRadius: "10px",
          padding: "1.25rem",
          width: "420px",
          maxWidth: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 0 30px rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
          💬 Comments for:{" "}
          <span style={{ color: "#818cf8" }}>{card.title}</span>
        </h2>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddComment();
              if (e.key === "Escape") onClose();
            }}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #475569",
              background: "#0f172a",
              color: "#f8fafc",
            }}
          />
          <button
            onClick={handleAddComment}
            style={{
              background: "#6366f1",
              color: "#fff",
              padding: "0.5rem 0.8rem",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            title="Add comment"
          >
            +
          </button>
        </div>

        {(card.comments ?? []).length ? (
          <ul
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {(card.comments ?? []).map((c) => (
              <li
                key={c.id}
                style={{
                  background: "#334155",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, wordBreak: "break-word" }}>{c.text}</p>
                  <small style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </small>
                </div>

                <button
                  onClick={() => handleDeleteComment(c.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#f87171",
                    cursor: "pointer",
                    padding: "0.2rem",
                    flexShrink: 0,
                  }}
                  title="Delete comment"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#94a3b8", textAlign: "center" }}>
            No comments yet
          </p>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "1rem",
            background: "transparent",
            color: "#f87171",
            border: "1px solid #f87171",
            borderRadius: "6px",
            padding: "0.4rem 1rem",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}
