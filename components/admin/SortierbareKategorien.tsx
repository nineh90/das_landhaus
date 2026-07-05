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

export type KategorieElement = { id: string; inhalt: React.ReactNode };

/**
 * Per Drag & Drop sortierbare Kategorie-Blöcke (Maus, Touch, Tastatur). Läuft in
 * einem eigenen DndContext und stört die innere, dish-bezogene SortierbareListe
 * nicht: Beide Kontexte starten nur über ihren jeweiligen Ziehgriff.
 */
function Block({ id, inhalt }: KategorieElement) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-1.5 ${
        isDragging ? "relative z-20 rounded-xl bg-white/60 shadow-lg ring-1 ring-akzent/30" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Kategorie zum Sortieren ziehen"
        className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-1.5 text-tinte/30 transition-colors hover:text-tinte/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-akzent active:cursor-grabbing"
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
    </div>
  );
}

export default function SortierbareKategorien({
  items,
  onReorder,
}: {
  items: KategorieElement[];
  onReorder: (geordneteNamen: string[]) => Promise<void>;
}) {
  // Wie SortierbareListe: nur die REIHENFOLGE der Kategorien liegt lokal, der
  // Inhalt (inkl. verschachtelter Gerichte-Liste) kommt stets aus den aktuellen
  // `items`. So schlagen Server-Updates innerhalb einer Kategorie (z. B.
  // Sichtbar/Versteckt eines Gerichts, Umbenennen) sofort durch. Neu-Abgleich der
  // Reihenfolge nur bei geänderter ID-Menge (Kategorie neu/leer).
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
        <div className="space-y-5">
          {order.map((id) => (
            <Block key={id} id={id} inhalt={inhaltNachId.get(id)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
