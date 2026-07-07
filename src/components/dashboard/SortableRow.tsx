"use client";

import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";

export type DragHandleProps = {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
};

type SortableRowProps = {
  id: string;
  children: (handle: DragHandleProps) => ReactNode;
};

// Sürükle-bırak sıralaması gereken satırlar için ortak sarmalayıcı (modal'daki Your Session
// ve dashboard'daki seçili gün paneli aynı mantığı kullanır). Tutamaç (⠿) props'ları render-prop
// ile çocuk bileşene aktarılır; sadece tutamaç sürüklenebilir, satırın geri kalanı normal davranır.
export default function SortableRow({ id, children }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-50" : undefined}>
      {children({ attributes, listeners })}
    </div>
  );
}
