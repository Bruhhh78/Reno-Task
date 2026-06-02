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
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Panel */}
      <div
        className="dialog-panel"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "400px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        {/* Danger icon */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>

        <h2
          id="confirm-title"
          style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}
        >
          Delete Notice?
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "28px" }}>
          This action is permanent and cannot be undone. The notice will be removed from the board immediately.
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Keep it
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn-danger"
            style={{ flex: 1, justifyContent: "center" }}
          >
            {isDeleting ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Deleting…
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
