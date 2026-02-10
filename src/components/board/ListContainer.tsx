"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import List from "@/components/board/List";

export default function ListContainer({ id }: { id: string }) {
  // IMPORTANT: we use a prefixed id to avoid collisions with card ids
  const sortableId = `list:${id}`;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    flexShrink: 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Make the header draggable by passing handle props */}
      <List
        id={id}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}
