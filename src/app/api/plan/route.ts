import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { buildDefaultPlanDays } from "@/lib/defaultPlan";
import { isValidDaysPayload, replacePlanDays, serializePlan } from "@/lib/planSerializer";

// Normalde register sırasında oluşturulur; yoksa (ör. eski/kenar durum) burada da güvenli
// şekilde oluşturulur ki dashboard hiçbir zaman "aktif plan yok" durumuyla karşılaşmasın.
async function getOrCreateActivePlan(userId: string) {
  const existing = await prisma.plan.findFirst({
    where: { userId, isActive: true },
    include: { days: { include: { exercises: true } } },
  });
  if (existing) return existing;

  return prisma.plan.create({
    data: {
      userId,
      name: "My Plan",
      isActive: true,
      days: { create: buildDefaultPlanDays() },
    },
    include: { days: { include: { exercises: true } } },
  });
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const plan = await getOrCreateActivePlan(userId);
  return NextResponse.json({ plan: serializePlan(plan) });
}

// Tam güncelleme: dashboard'daki her değişiklik (tik, sürükleme, save workout, rename) debounce
// edilip burada aktif planın adı ve tüm günleri/egzersizleri baştan yazılır.
export async function PUT(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const days = body?.days;
  const requestedLinkedFavoriteId =
    typeof body?.linkedFavoriteId === "string" ? body.linkedFavoriteId : null;

  if (!name || !isValidDaysPayload(days)) {
    return NextResponse.json({ error: "Invalid plan payload." }, { status: 400 });
  }

  // linkedFavoriteId istemciden geliyor ama güvenilmez: sadece bu kullanıcıya ait, gerçekten var
  // olan bir favoriye işaret ediyorsa kabul edilir, aksi halde sessizce null'a düşer (ör. favori
  // başka bir sekmede silinmiş olabilir).
  let linkedFavoriteId: string | null = null;
  if (requestedLinkedFavoriteId) {
    const favorite = await prisma.plan.findFirst({
      where: { id: requestedLinkedFavoriteId, userId, isActive: false },
      select: { id: true },
    });
    linkedFavoriteId = favorite?.id ?? null;
  }

  const activePlan = await getOrCreateActivePlan(userId);

  await prisma.plan.update({ where: { id: activePlan.id }, data: { name, linkedFavoriteId } });
  await replacePlanDays(activePlan.id, days);

  const updated = await prisma.plan.findUniqueOrThrow({
    where: { id: activePlan.id },
    include: { days: { include: { exercises: true } } },
  });
  return NextResponse.json({ plan: serializePlan(updated) });
}
