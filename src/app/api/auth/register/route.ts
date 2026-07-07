import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { registerSchema } from "@/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const { name, email, password, schoolName, role } = parsed.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return errorResponse("Email already registered", 409)
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    // Create school if school name provided
    if (schoolName && role === "SCHOOL_ADMIN") {
      const schoolSlug = schoolName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")

      const school = await prisma.school.create({
        data: {
          name: schoolName,
          slug: schoolSlug,
        },
      })

      await prisma.schoolMember.create({
        data: {
          schoolId: school.id,
          userId: user.id,
          role: "SCHOOL_ADMIN",
        },
      })
    }

    // Create free subscription
    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: "FREE",
        status: "TRIALING",
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    })

    return successResponse(user, 201)
  } catch (error) {
    console.error("Registration error:", error)
    return errorResponse("Internal server error", 500)
  }
}
