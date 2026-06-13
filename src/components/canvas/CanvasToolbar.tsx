type CanvasToolbarProps = {
  hasSelection: boolean;
  hasPlacements: boolean;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDelete: () => void;
  onExport: () => void;
};

const buttonClassName =
  "rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-800 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50";

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
        className={buttonClassName}
        disabled={!hasSelection}
        onClick={onBringForward}
      >
        Bring forward
      </button>
      <button
        type="button"
        className={buttonClassName}
        disabled={!hasSelection}
        onClick={onSendBackward}
      >
        Send backward
      </button>
      <button
        type="button"
        className={buttonClassName}
        disabled={!hasSelection}
        onClick={onDelete}
      >
        Delete
      </button>
      <button
        type="button"
        className={`${buttonClassName} border-stone-900 bg-stone-900 text-white hover:bg-stone-800`}
        disabled={!hasPlacements}
        onClick={onExport}
      >
        Export PNG
      </button>
    </div>
  );
}
