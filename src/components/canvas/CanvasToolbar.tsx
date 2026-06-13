"use client";

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
        className="btn-secondary"
        disabled={!hasSelection}
        onClick={onBringForward}
      >
        Bring forward
      </button>
      <button
        type="button"
        className="btn-secondary"
        disabled={!hasSelection}
        onClick={onSendBackward}
      >
        Send backward
      </button>
      <button
        type="button"
        className="btn-secondary"
        disabled={!hasSelection}
        onClick={onDelete}
      >
        Delete
      </button>
      <button
        type="button"
        className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!hasPlacements}
        onClick={onExport}
      >
        Export PNG
      </button>
    </div>
  );
}
