"use client";

import { Icon } from "@/components/ui/Icon";
import { actionIcons } from "@/lib/icons";

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
        className="btn-secondary gap-2 px-2.5 md:px-3"
        disabled={!hasSelection}
        onClick={onBringForward}
        aria-label="Bring forward"
      >
        <Icon icon={actionIcons.layerUp} size="sm" />
        <span className="hidden md:inline">Bring forward</span>
      </button>
      <button
        type="button"
        className="btn-secondary gap-2 px-2.5 md:px-3"
        disabled={!hasSelection}
        onClick={onSendBackward}
        aria-label="Send backward"
      >
        <Icon icon={actionIcons.layerDown} size="sm" />
        <span className="hidden md:inline">Send backward</span>
      </button>
      <button
        type="button"
        className="btn-secondary gap-2 px-2.5 md:px-3"
        disabled={!hasSelection}
        onClick={onDelete}
        aria-label="Delete selected"
      >
        <Icon icon={actionIcons.delete} size="sm" />
        <span className="hidden md:inline">Delete</span>
      </button>
      <button
        type="button"
        className="btn-primary gap-2 px-2.5 md:px-3 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!hasPlacements}
        onClick={onExport}
        aria-label="Export PNG"
      >
        <Icon icon={actionIcons.export} size="sm" />
        <span className="hidden md:inline">Export PNG</span>
      </button>
    </div>
  );
}
