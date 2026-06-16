"use client";

import { Icon } from "@/components/ui/Icon";
import { actionIcons } from "@/lib/icons";

const toolbarButtonClassName =
  "btn-secondary min-h-[var(--touch-min)] min-w-[var(--touch-min)] gap-2 px-2.5 md:min-w-0 md:px-3";

type CanvasToolbarProps = {
  hasSelection: boolean;
  hasPlacements: boolean;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDelete: () => void;
  onExport: () => void;
};

export function CanvasToolbar({
  hasSelection,
  hasPlacements,
  onBringForward,
  onSendBackward,
  onDelete,
  onExport,
}: CanvasToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={toolbarButtonClassName}
        disabled={!hasSelection}
        onClick={onBringForward}
        aria-label="Avancer"
      >
        <Icon icon={actionIcons.layerUp} size="sm" />
        <span className="hidden md:inline">Avancer</span>
      </button>
      <button
        type="button"
        className={toolbarButtonClassName}
        disabled={!hasSelection}
        onClick={onSendBackward}
        aria-label="Reculer"
      >
        <Icon icon={actionIcons.layerDown} size="sm" />
        <span className="hidden md:inline">Reculer</span>
      </button>
      <button
        type="button"
        className={toolbarButtonClassName}
        disabled={!hasSelection}
        onClick={onDelete}
        aria-label="Supprimer la sélection"
      >
        <Icon icon={actionIcons.delete} size="sm" />
        <span className="hidden md:inline">Supprimer</span>
      </button>
      <button
        type="button"
        className="btn-primary min-h-[var(--touch-min)] min-w-[var(--touch-min)] gap-2 px-2.5 disabled:cursor-not-allowed disabled:opacity-50 md:min-w-0 md:px-3"
        disabled={!hasPlacements}
        onClick={onExport}
        aria-label="Exporter en PNG"
      >
        <Icon icon={actionIcons.export} size="sm" />
        <span className="hidden md:inline">Exporter en PNG</span>
      </button>
    </div>
  );
}
