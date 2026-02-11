"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, X } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  // safe check for client
  const isClient = typeof document !== "undefined";

  // newest first (safe even if card is undefined)
  const comments = useMemo(() => {
    const list = card?.comments ?? [];
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  }, [card?.comments]);

  useEffect(() => {
    if (!isClient) return;
    if (!card) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    const t = window.setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isClient, card, onClose]);

  // after all hooks, early returns are safe
  if (!isClient) return null;
  if (!card) return null;

  const handleAddComment = () => {
    const text = comment.trim();
    if (!text) return;

    const next = structuredClone(snap);

    next.cards[cardId].comments = next.cards[cardId].comments ?? [];
    next.cards[cardId].comments.push({
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(), // number
    });

    setSnap(next);
    setComment("");
    inputRef.current?.focus();
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
        role="dialog"
        aria-modal="true"
        style={{
          background: "#0b1220",
          color: "#f1f5f9",
          borderRadius: "12px",
          padding: "1.25rem",
          width: "440px",
          maxWidth: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 0 40px rgba(0,0,0,0.45)",
          border: "1px solid rgba(148,163,184,0.18)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            gap: "0.75rem",
            marginBottom: "0.9rem",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Comments</div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.05rem",
                fontWeight: 600,
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              {card.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close"
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Add */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddComment();
            }}
            style={{
              flex: 1,
              padding: "0.55rem 0.65rem",
              borderRadius: "8px",
              border: "1px solid rgba(148,163,184,0.25)",
              background: "#0f172a",
              color: "#f8fafc",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={handleAddComment}
            disabled={!comment.trim()}
            style={{
              background: !comment.trim() ? "#334155" : "#6366f1",
              color: "#fff",
              padding: "0.55rem 0.85rem",
              border: "none",
              borderRadius: "8px",
              cursor: !comment.trim() ? "not-allowed" : "pointer",
              opacity: !comment.trim() ? 0.7 : 1,
            }}
            title="Add comment"
          >
            Add
          </button>
        </div>

        {/* List */}
        {comments.length ? (
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              padding: 0,
              margin: 0,
              listStyle: "none",
            }}
          >
            {comments.map((c) => (
              <li
                key={c.id}
                style={{
                  background: "rgba(51,65,85,0.65)",
                  padding: "0.65rem 0.7rem",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  gap: "0.75rem",
                  border: "1px solid rgba(148,163,184,0.14)",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, wordBreak: "break-word" }}>{c.text}</p>
                  <small style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </small>
                </div>

                <button
                  type="button"
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
          <p
            style={{
              color: "#94a3b8",
              textAlign: "center",
              margin: "1.2rem 0",
            }}
          >
            No comments yet
          </p>
        )}

        {/* Footer */}
        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: "1rem",
            background: "transparent",
            color: "#94a3b8",
            border: "1px solid rgba(148,163,184,0.25)",
            borderRadius: "10px",
            padding: "0.55rem 1rem",
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
