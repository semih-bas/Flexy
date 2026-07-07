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
Tema koyu — legacy-reference'taki eski tasarımın diline dönüş, bir tık rafine:
- Zemin: çok koyu lacivert-siyah (#05060a–#0b0f16 arası)
- Kart yüzeyleri: zeminden bir ton açık koyu (#10151d civarı), yumuşak büyük
  köşe yarıçapı (rounded-2xl/3xl)
- Ana renk: turuncu (#F97316) — butonlar, aktif durumlar, gün etiketleri
- Ana metin açık (#F1F5F9 civarı); ikincil metin slate-400 civarı ama koyu
  zeminde HER ZAMAN okunur kontrastta olacak şekilde ayarlanır — soluk/okunmaz
  gri hatası tekrarlanmayacak
- Set/tekrar rozetleri: nötr koyu gri (eski mavi/camgöbeği rozetler kullanılmıyor)
- Durum rozetleri: Completed → yeşil, Partial → nötr, Today → turuncu dolgu
- His: premium, sakin, koyu; mobile-first (uygulama ileride mobil mağazalara çıkacak)
- İleride açık tema seçeneği eklenebilir ihtimaline karşı TÜM renkler token
  üzerinden tanımlanır; renkler asla elle hex olarak class'lara yazılmaz
- Renkler `globals.css` içinde Tailwind 4 `@theme` bloğunda token olarak
  tanımlanır (--color-brand vb.) ve oradan kullanılır
- AppSidebar'ın açılıp kapanma davranışı KORUNACAK, renkleri koyu temaya uyarlı.

## KOD KURALLARI
- Varsayılan server component; `'use client'` sadece state/etkileşim gerektiğinde.
- Türetilebilen veriyi saklama, hesapla.
- Bir UI kalıbı 3. kez kopyalanıyorsa bileşene çıkar.
- `any` kullanma.
- Erişilebilirlik: etkileşimli öğelere aria-label, semantik HTML.

## YOL HARİTASI (sıra önemli)
1. Tema geçişi (tüm sayfalar token'lara geçecek)
2. Dashboard tasarım inceltmesi (eski tasarım referans)
3. Exercise Library: tasarım + çalışan arama ve kategori filtresi
4. Egzersiz detay sayfası /exercises/[id]
5. Dashboard işleyişi: Add Workout akışı, Today paneli, tamamlama işaretleri
6. Templates sayfası (route açılacak, eski şablonlar taşınacak)
7. My Plans: favori plan kaydetme/uygulama
8. Settings sayfası (basit)
9. Landing yeniden tasarım (en son)
10. Backend: veritabanı + API + auth