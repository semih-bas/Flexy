type StoreButtonProps = {
  storeName: string;
  label: string;
};

// TODO: Yayın sonrası gerçek App Store / Google Play linklerine bağlanacak.
export default function StoreButton({ storeName, label }: StoreButtonProps) {
  return (
    <a
      href="#"
      title="Coming soon"
      className="flex w-full items-center gap-3 rounded-2xl border border-foreground-muted/15 bg-surface px-4 py-3 text-left transition hover:border-brand/30 sm:w-auto"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-sm font-bold text-background">
        {storeName === 'App Store' ? '' : '▶'}
      </div>

      <div>
        <p className="text-[11px] text-foreground-muted">{label}</p>
        <p className="text-sm font-semibold text-foreground">{storeName}</p>
      </div>
    </a>
  );
}
