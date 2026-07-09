import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { exercises } from "../src/data/exercises";
import { workoutTemplates } from "../src/data/workoutTemplates";

// İdempotent: id sabit olduğu için tekrar çalıştırınca yeni satır eklemez, mevcut satırı günceller.
async function seedExercises() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { id: exercise.id },
      create: exercise,
      update: exercise,
    });
  }
  console.log(`Seeded ${exercises.length} exercises.`);
}

// Şablonlar da id'ye göre upsert edilir. Günler/egzersizler nested ilişki olduğu için, güncelleme
// tarafında önce o şablonun tüm günlerini silip (cascade ile egzersizleri de gider) yeniden
// oluşturuyoruz — böylece tekrar çalıştırmak duplicate gün/egzersiz üretmez.
async function seedTemplates() {
  for (const [templateIndex, template] of workoutTemplates.entries()) {
    const days = template.days.map((day, dayIndex) => ({
      day: day.day,
      workoutName: day.workoutName,
      sortOrder: dayIndex,
      exercises: {
        create: day.exercises.map((exercise, exerciseIndex) => ({
          name: exercise.name,
          sets: exercise.sets,
          muscleGroup: exercise.muscleGroup,
          sortOrder: exerciseIndex,
        })),
      },
    }));

    await prisma.template.upsert({
      where: { id: template.id },
      create: {
        id: template.id,
        name: template.name,
        level: template.level,
        categories: template.categories,
        highlight: template.highlight,
        description: template.description,
        daysPerWeek: template.daysPerWeek,
        features: template.features,
        sortOrder: templateIndex,
        days: { create: days },
      },
      update: {
        name: template.name,
        level: template.level,
        categories: template.categories,
        highlight: template.highlight,
        description: template.description,
        daysPerWeek: template.daysPerWeek,
        features: template.features,
        sortOrder: templateIndex,
        days: {
          deleteMany: {},
          create: days,
        },
      },
    });
  }
  console.log(`Seeded ${workoutTemplates.length} templates.`);
}

async function main() {
  await seedExercises();
  await seedTemplates();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
