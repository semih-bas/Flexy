// Kas grubu başlıkları bu paletten sırayla renk alır (token'lardan, isim eşlemesi olmadan — herhangi bir
// kas grubu adıyla çalışır). WeeklyPlanBoard ve WorkoutEditorModal aynı paleti paylaşır.
const muscleGroupPalette = ["text-brand", "text-info", "text-success", "text-warning", "text-danger"];

export function getMuscleGroupColor(index: number) {
  return muscleGroupPalette[index % muscleGroupPalette.length];
}
