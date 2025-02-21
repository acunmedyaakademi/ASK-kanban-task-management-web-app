import { useDroppable } from "@dnd-kit/core";

export default function DroppableColumn({ column, children }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div ref={setNodeRef} className="task-column">
      {children}
    </div>
  );
}
