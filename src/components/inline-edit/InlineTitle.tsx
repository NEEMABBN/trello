"use client";

import { useEffect, useRef, useState } from "react";

interface InlineTitleProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  fontSize?: string;
  bold?: boolean;
  color?: string;
}

export default function InlineTitle({
  value,
  onChange,
  placeholder = "Untitled",
  fontSize = "1rem",
  bold = false,
  color = "#f1f5f9",
}: InlineTitleProps) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const next = tempValue.trim();
    if (next && next !== value) onChange(next);
    else setTempValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setEditing(false);
      setTempValue(value);
    }
  };

  return editing ? (
    <input
      ref={inputRef}
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        fontSize,
        fontWeight: bold ? "600" : "400",
        padding: "0.3rem 0.4rem",
        borderRadius: "4px",
        border: "1px solid #475569",
        background: "#0f172a",
        color,
        width: "100%",
        outline: "none",
      }}
    />
  ) : (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        cursor: "pointer",
        fontSize,
        fontWeight: bold ? "600" : "400",
        color,
        display: "inline-block",
        padding: "0.3rem 0.4rem",
        borderRadius: "4px",
      }}
    >
      {value || <span style={{ opacity: 0.5 }}>{placeholder}</span>}
    </span>
  );
}
