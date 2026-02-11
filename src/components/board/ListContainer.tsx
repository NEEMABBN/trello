"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import List from "@/components/board/List";

export default function ListContainer({ id }: { id: string }) {
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
    opacity: isDragging ? 0.92 : 1,
    flexShrink: 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="list-wrap">
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
