interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  isDeleting,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog panel */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 mx-auto">
          <span className="text-2xl">🗑️</span>
        </div>

        <div className="text-center">
          <h2 id="confirm-dialog-title" className="text-lg font-bold text-white">
            Delete Notice?
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            This action cannot be undone. The notice will be permanently removed.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-gray-600 bg-gray-800 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
