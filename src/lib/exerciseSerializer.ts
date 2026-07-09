import type { Exercise } from "@/data/exercises";
import type { Exercise as PrismaExercise } from "@/generated/prisma/client";

// Prisma'nın ürettiği Exercise satırı category/level/trainingType/type alanlarını düz `string`
// olarak tutar (DB seviyesinde enum yok); frontend bileşenleri ise bunları daha dar literal
// union'lar (ExerciseCategory, ExerciseLevel...) olarak bekliyor. Veri seed.ts üzerinden zaten
// aynı literal değerlerden geldiği için bu dönüşüm güvenli bir daraltmadır.
export function toExercise(row: PrismaExercise): Exercise {
  return {
    ...row,
    category: row.category as Exercise["category"],
    level: row.level as Exercise["level"],
    trainingType: row.trainingType as Exercise["trainingType"],
    type: row.type as Exercise["type"],
    image: row.image ?? undefined,
  };
}
