import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { replacePlanDays, serializePlan } from "@/lib/planSerializer";

type RouteParams = { params: Promise<{ id: string }> };

// Rename: favori adını değiştirir; aktif plan şu an bu favoriye bağlıysa (linkedFavoriteId) aktif
// planın adı da senkron kalsın diye güncellenir (frontend'deki renameFavoritePlan ile birebir).
export async function PUT(request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const favorite = await prisma.plan.findFirst({ where: { id, userId, isActive: false } });
  if (!favorite) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  await prisma.plan.update({ where: { id: favorite.id }, data: { name } });

  const activePlan = await prisma.plan.findFirst({ where: { userId, isActive: true } });
  if (activePlan?.linkedFavoriteId === favorite.id) {
    await prisma.plan.update({ where: { id: activePlan.id }, data: { name } });
  }

  const updated = await prisma.plan.findUniqueOrThrow({
    where: { id: favorite.id },
    include: { days: { include: { exercises: true } } },
  });
  return NextResponse.json({ plan: serializePlan(updated) });
}

// Silme: favori bir favoriyken aktif planın bağı buna işaret ediyorsa bağ da temizlenir
// (frontend'deki deleteFavoritePlan ile birebir) — aktif plan silinmez, sadece bağımsız kalır.
export async function DELETE(_request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const favorite = await prisma.plan.findFirst({ where: { id, userId, isActive: false } });
  if (!favorite) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const activePlan = await prisma.plan.findFirst({ where: { userId, isActive: true } });
  if (activePlan?.linkedFavoriteId === favorite.id) {
    await prisma.plan.update({ where: { id: activePlan.id }, data: { linkedFavoriteId: null } });
  }

  await prisma.plan.delete({ where: { id: favorite.id } });
  return NextResponse.json({ ok: true });
}

// Apply: favorinin günlerini aktif plana kopyalar, aktif planın adını ve bağını favoriye göre
// günceller (frontend'deki applyFavoritePlan ile birebir).
export async function POST(_request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const favorite = await prisma.plan.findFirst({
    where: { id, userId, isActive: false },
    include: { days: { include: { exercises: true } } },
  });
  if (!favorite) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const activePlan = await prisma.plan.findFirst({ where: { userId, isActive: true } });
  if (!activePlan) {
    return NextResponse.json({ error: "Active plan not found." }, { status: 404 });
  }

  const days = [...favorite.days]
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

  await prisma.plan.update({
    where: { id: activePlan.id },
    data: { name: favorite.name, linkedFavoriteId: favorite.id },
  });
  await replacePlanDays(activePlan.id, days);

  const updated = await prisma.plan.findUniqueOrThrow({
    where: { id: activePlan.id },
    include: { days: { include: { exercises: true } } },
  });
  return NextResponse.json({ plan: serializePlan(updated) });
}
