# Flexy — Proje Talimatları

## Proje nedir
Flexy, haftalık antrenman planlama uygulaması. Bu repo, eski vanilla JS sürümünün
(`legacy-reference/` klasöründe duruyor, SADECE referans — asla düzenleme) Next.js ile
yeniden yazımıdır. Geliştirici Semih; liseyi yeni bitirdi, React/Next.js ÖĞRENME
aşamasında. Bu projenin asıl amacı ürün kadar öğrenme.

## Teknoloji
- Next.js 16 (App Router) + React 19 + TypeScript 5 (strict) + Tailwind CSS 4
- Şimdilik backend yok; veriler `src/data/` içinde statik. Backend Faz 3'te gelecek.
- Komutlar: `npm run dev` (geliştirme), `npm run build`, `npm run lint`

## ÇALIŞMA KURALLARI (en önemli bölüm)
1. Küçük adımlarla ilerle. Tek seferde tek konu. Büyük işleri parçalara böl,
   her parçayı ayrı onaya sun.
2. Her değişiklikten sonra Türkçe ve basit dille açıkla: ne değişti, NEDEN değişti,
   hangi kavramı öğretiyor. Semih kodu okuyup anlayacak; anlamadan geçmek yasak.
3. Kod dosyaları ve commit mesajları İngilizce, açıklamalar Türkçe.
4. Her tamamlanan adımdan sonra commit öner (anlamlı İngilizce mesajla,
   örn. "Add category filtering to exercise library"). Semih onaylamadan commit atma.
5. Yeni npm paketi eklemeden önce mutlaka sor ve neden gerektiğini açıkla.
6. `.env`, `node_modules`, `.next`, `legacy-reference/` dosyalarına dokunma.

## TASARIM SİSTEMİ (eski Flexy'nin dili, bir tık rafine)
Mevcut koyu tema TERK EDİLECEK. Hedef, eski tasarımın hissi:
- Zemin: açık, sıcak krem (#F7F4EF civarı) — koyu değil
- Kartlar: beyaz, yumuşak büyük köşe yarıçapı (rounded-2xl/3xl), hafif gölge
- Ana renk: turuncu (#F97316 / orange-500 ailesi) — butonlar, aktif durumlar, vurgular
- Metin: koyu lacivert/slate (#1E293B civarı), ikincil metin slate-500
- His: ferah, temiz, sıcak; mobile-first (uygulama ileride mobil mağazalara çıkacak)
- Landing hero koyu görsel üzerine açık metin kalabilir (eski tasarımdaki gibi)
- Renkler tek tek class'lara gömülmez; `globals.css` içinde Tailwind 4 `@theme`
  bloğunda token olarak tanımlanır (--color-brand vb.) ve oradan kullanılır.
- Yeni AppSidebar'ın açılıp kapanma davranışı KORUNACAK, renkleri yeni temaya uyarlanacak.

## KOD KURALLARI
- Varsayılan server component; `'use client'` sadece state/etkileşim gerektiğinde.
- Türetilebilen veriyi saklama, hesapla.
- Bir UI kalıbı 3. kez kopyalanıyorsa bileşene çıkar.
- `any` kullanma.
- Erişilebilirlik: etkileşimli öğelere aria-label, semantik HTML.

## YOL HARİTASI (sıra önemli)
1. Temizlik: layout.tsx metadata, AppSidebar'daki ölü "active" alanı, public'teki şablon svg'leri
2. Tema geçişi: @theme token'ları + açık tema (sayfa sayfa)
3. Exercise Library'ye çalışan arama + kategori filtresi
4. /exercises/[id] detay sayfası
5. Haftalık plan state'i ve Add Workout akışı
6. Templates sayfası (legacy'deki şablonlar TypeScript'e taşınacak)
7. Faz 3: kendi API + veritabanı