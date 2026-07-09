import { WEEKDAYS } from "@/lib/applyTemplate";

// Yeni kayıt olan kullanıcının aktif planı tamamen boş bir haftayla başlar: 7 gün, hepsi
// workoutName: null, exercises: []. Kullanıcı ilk planını kendisi oluşturur (Templates'ten
// bir program seçerek ya da dashboard'dan manuel ekleyerek) — önceden dolu bir örnek plan
// göstermek, henüz yapılmamış antrenmanları yapılmış gibi gösterirdi.
export function buildDefaultPlanDays() {
  return WEEKDAYS.map((day, dayIndex) => ({
    day,
    workoutName: null,
    sortOrder: dayIndex,
    exercises: { create: [] },
  }));
}
