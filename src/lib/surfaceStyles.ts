// Uygulama genelinde tekrar eden "yumuşak yüzey" dokusu: üstten çok hafif ışıma + hayalet
// kenarlık + yumuşak gölge. Kenarlık rengi kullanım yerinde verilir (seçili/today kartı turuncu
// vurgu alabildiği için). Dashboard ve Exercise Library kartları aynı diline sahip olsun diye
// tek yerde tanımlanır.
export const surfaceGlow =
  "border bg-gradient-to-b from-foreground/[0.05] to-transparent shadow-xl shadow-black/30";
export const surfaceGlowSoft =
  "border border-foreground/10 bg-gradient-to-b from-foreground/[0.04] to-transparent shadow-lg shadow-black/20";

// Tıklanabilir/etkileşimli kartlarda (Template, My Plan, Exercise) hover'da kenarlığın yumuşakça
// turuncuya geçmesi için ortak sınıf: her kartta ayrı ayrı tekrar edilmesin diye tek yerden.
export const interactiveCardHover = "transition-colors duration-200 hover:border-brand/30";

// Ana CTA butonları (Start Planning, Use Plan, Apply Plan, Save Workout vb.) için ortak "canlı"
// turuncu buton dili: hafif gradient + hover'da parlama ve minik büyüme. "Nefes alan koyu tema"
// hedefiyle abartısız — tek yerden tanımlanır ki tüm ana CTA'lar aynı hissi versin.
export const ctaButtonGlow =
  "bg-gradient-to-b from-brand to-[#ea6a10] shadow-md shadow-brand/25 transition duration-200 hover:shadow-lg hover:shadow-brand/40 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]";
