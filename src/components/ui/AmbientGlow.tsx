// Tüm sayfalarda tekrar eden çok hafif arka plan ambiyansı: köşelerden süzülen belirsiz
// turuncu/mavi radial glow'lar. Saf dekorasyon — pointer-events-none, içeriği etkilemez.
// "Nefes alan koyu tema" hedefi: opaklık bilerek çok düşük (0.04-0.06), abartıya kaçmaz.
// Konumlandığı üst öğe `relative` olmalı ki glow tüm sayfa yüksekliğine yayılsın (sadece
// ilk ekran yüksekliğine değil).
export default function AmbientGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/[0.06] blur-[110px]" />
      <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-info/[0.05] blur-[100px]" />
      <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-brand/[0.04] blur-[110px]" />
    </div>
  );
}
