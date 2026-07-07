// Uygulama genelinde tekrar eden "yumuşak yüzey" dokusu: üstten çok hafif ışıma + hayalet
// kenarlık + yumuşak gölge. Kenarlık rengi kullanım yerinde verilir (seçili/today kartı turuncu
// vurgu alabildiği için). Dashboard ve Exercise Library kartları aynı diline sahip olsun diye
// tek yerde tanımlanır.
export const surfaceGlow =
  "border bg-gradient-to-b from-foreground/[0.05] to-transparent shadow-xl shadow-black/30";
export const surfaceGlowSoft =
  "border border-foreground/10 bg-gradient-to-b from-foreground/[0.04] to-transparent shadow-lg shadow-black/20";
