import { NextResponse } from "next/server"
import { auth } from "./auth"
import { prisma } from "./prisma"
import type { Prisma, SubscriptionTier, SubscriptionStatus } from "@prisma/client"

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status })
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireRole(...roles: string[]) {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden")
  }
  return user
}

export async function checkSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (!subscription) {
    return { tier: "FREE" as SubscriptionTier, status: "TRIALING" as SubscriptionStatus, limits: getLimits("FREE") }
  }

  return {
    ...subscription,
    limits: getLimits(subscription.tier),
  }
}

export function getLimits(tier: SubscriptionTier) {
  const limits = {
    FREE: { documentsPerMonth: 5, storageMB: 100, exports: ["pdf"] },
    PROFESSIONAL: { documentsPerMonth: -1, storageMB: 1024, exports: ["pdf", "word", "powerpoint", "excel"] },
    SCHOOL: { documentsPerMonth: -1, storageMB: 5120, exports: ["pdf", "word", "powerpoint", "excel"] },
    ENTERPRISE: { documentsPerMonth: -1, storageMB: -1, exports: ["pdf", "word", "powerpoint", "excel"] },
  }
  return limits[tier]
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error)
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }
    if (error.message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }
  }
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  )
}

export async function auditLog(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: { userId, action, entity, entityId, metadata: (metadata ?? {}) as Prisma.InputJsonValue },
  })
}
