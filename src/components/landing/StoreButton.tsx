type StoreButtonProps = {
  storeName: string;
  label: string;
};

export default function StoreButton({ storeName, label }: StoreButtonProps) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10 sm:w-auto">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-black">
        {storeName === "App Store" ? "" : "▶"}
      </div>

      <div>
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-semibold text-white">{storeName}</p>
      </div>
    </button>
  );
}