type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// Uygulama genelinde tekrar eden onay sorusu deseni (use plan / apply plan / overwrite / delete)
// tek bileşende toplanır: aynı modal 3'ten fazla yerde kopyalanmasın diye.
export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation backdrop"
        onClick={onCancel}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-3xl border border-foreground/10 bg-surface p-6 shadow-2xl shadow-black/40">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-foreground-muted">{description}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground-muted transition hover:border-brand/40 hover:text-foreground"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
              danger
                ? 'bg-danger shadow-danger/25 hover:bg-danger/90'
                : 'bg-brand shadow-brand/25 hover:bg-brand/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
