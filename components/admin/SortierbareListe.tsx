"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type SortierElement = { id: string; inhalt: React.ReactNode };

/**
 * Generische, per Drag & Drop sortierbare Liste (Maus, Touch und Tastatur).
 * `inhalt` je Element wird vom Aufrufer geliefert; diese Komponente ergänzt nur
 * den Ziehgriff und persistiert die neue Reihenfolge über `onReorder`.
 */
function Element({ id, inhalt }: SortierElement) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-1 bg-white px-2 sm:px-3 ${
        isDragging ? "relative z-10 rounded-lg shadow-md ring-1 ring-akzent/30" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Zum Sortieren ziehen"
        className="shrink-0 cursor-grab touch-none rounded p-1.5 text-tinte/30 transition-colors hover:text-tinte/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-akzent active:cursor-grabbing"
      >
        <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true" fill="currentColor">
          <circle cx="4" cy="3" r="1.5" />
          <circle cx="10" cy="3" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="10" cy="8" r="1.5" />
          <circle cx="4" cy="13" r="1.5" />
          <circle cx="10" cy="13" r="1.5" />
        </svg>
      </button>
      <div className="min-w-0 flex-1">{inhalt}</div>
    </li>
  );
}

export default function SortierbareListe({
  items,
  onReorder,
}: {
  items: SortierElement[];
  onReorder: (geordneteIds: string[]) => Promise<void>;
}) {
  // Nur die REIHENFOLGE der IDs liegt lokal (für optimistisches Ziehen). Der
  // Inhalt wird stets aus den aktuellen `items` gelesen, damit Server-Updates
  // (z. B. Sichtbar/Versteckt umschalten, ohne dass sich IDs ändern) sofort
  // sichtbar werden. Neu-Abgleich der Reihenfolge nur, wenn sich die MENGE der
  // IDs ändert (Anlegen/Löschen) — reines Umsortieren behält den lokalen Stand.
  const [orderIds, setOrderIds] = useState(() => items.map((i) => i.id));
  const [, startTransition] = useTransition();

  const idMenge = [...items.map((i) => i.id)].sort().join("|");
  const [letzteIdMenge, setLetzteIdMenge] = useState(idMenge);
  if (idMenge !== letzteIdMenge) {
    setLetzteIdMenge(idMenge);
    setOrderIds(items.map((i) => i.id));
  }

  const inhaltNachId = new Map(items.map((i) => [i.id, i.inhalt]));
  const order = orderIds.filter((id) => inhaltNachId.has(id));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const alt = order.indexOf(String(active.id));
    const neu = order.indexOf(String(over.id));
    if (alt < 0 || neu < 0) return;

    const next = arrayMove(order, alt, neu);
    setOrderIds(next); // optimistisch
    startTransition(() => {
      void onReorder(next);
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <ul className="divide-y divide-tinte/10">
          {order.map((id) => (
            <Element key={id} id={id} inhalt={inhaltNachId.get(id)} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
