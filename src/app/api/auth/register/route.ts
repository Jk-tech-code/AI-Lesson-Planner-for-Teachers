import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/validations"
import bcrypt from "bcryptjs"
import { sendWelcomeEmail } from "@/lib/email"

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password, schoolName, role } = validation.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || "TEACHER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    // Create subscription
    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: "FREE",
        status: "TRIAL",
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    })

    // Handle school setup
    if (schoolName && role === "SCHOOL_ADMIN") {
      const school = await prisma.school.create({
        data: {
          name: schoolName,
          slug: slugify(schoolName),
        },
      })

      await prisma.schoolMember.create({
        data: {
          userId: user.id,
          schoolId: school.id,
          role: "SCHOOL_ADMIN",
        },
      })
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ name, email }).catch((err) =>
      console.error("Welcome email failed:", err)
    )

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
