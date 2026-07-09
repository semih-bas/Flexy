import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { isValidDaysPayload, replacePlanDays, serializePlan, type DayPlanInput } from "@/lib/planSerializer";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const favorites = await prisma.plan.findMany({
    where: { userId, isActive: false },
    include: { days: { include: { exercises: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ plans: favorites.map(serializePlan) });
}

// Body'de "days" verilmişse (Templates > Save to My Plans) bu tam olarak o günler kaydedilir ve
// aktif plana dokunulmaz. "days" verilmemişse (Dashboard > Save as favorite) mevcut aktif planın
// günleri kopyalanır ve aktif plan bu favoriye bağlanır (linkedFavoriteId) — ikisi de aynı ada
// sahip mevcut bir favori varsa (ya da aktif plan zaten bir favoriye bağlıysa) onun üzerine yazar.
export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "A plan name is required." }, { status: 400 });
  }

  let daysToSave: DayPlanInput[];
  let activePlan: { id: string; linkedFavoriteId: string | null } | null = null;

  if (body?.days !== undefined) {
    if (!isValidDaysPayload(body.days)) {
      return NextResponse.json({ error: "Invalid plan payload." }, { status: 400 });
    }
    daysToSave = body.days;
  } else {
    const active = await prisma.plan.findFirst({
      where: { userId, isActive: true },
      include: { days: { include: { exercises: true } } },
    });
    if (!active) {
      return NextResponse.json({ error: "Active plan not found." }, { status: 404 });
    }
    activePlan = active;
    daysToSave = [...active.days]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((day) => ({
        day: day.day,
        workoutName: day.workoutName,
        exercises: [...day.exercises]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((exercise) => ({
            name: exercise.name,
            sets: exercise.sets,
            muscleGroup: exercise.muscleGroup ?? undefined,
            completed: exercise.completed,
          })),
      }));
  }

  // Hedef favoriyi bul: önce aktif planın bağlı olduğu favori (varsa), yoksa aynı isimli favori.
  let target = activePlan?.linkedFavoriteId
    ? await prisma.plan.findFirst({ where: { id: activePlan.linkedFavoriteId, userId, isActive: false } })
    : null;

  if (!target) {
    target = await prisma.plan.findFirst({
      where: { userId, isActive: false, name: { equals: name, mode: "insensitive" } },
    });
  }

  if (target) {
    await prisma.plan.update({ where: { id: target.id }, data: { name } });
    await replacePlanDays(target.id, daysToSave);
  } else {
    target = await prisma.plan.create({
      data: {
        userId,
        name,
        isActive: false,
        days: {
          create: daysToSave.map((day, dayIndex) => ({
            day: day.day,
            workoutName: day.workoutName,
            sortOrder: dayIndex,
            exercises: {
              create: day.exercises.map((exercise, exerciseIndex) => ({
                name: exercise.name,
                sets: exercise.sets,
                muscleGroup: exercise.muscleGroup ?? null,
                completed: exercise.completed ?? false,
                sortOrder: exerciseIndex,
              })),
            },
          })),
        },
      },
    });
  }

  if (activePlan) {
    await prisma.plan.update({ where: { id: activePlan.id }, data: { linkedFavoriteId: target.id } });
  }

  const saved = await prisma.plan.findUniqueOrThrow({
    where: { id: target.id },
    include: { days: { include: { exercises: true } } },
  });
  return NextResponse.json({ plan: serializePlan(saved) }, { status: 201 });
}
