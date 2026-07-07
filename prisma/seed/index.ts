import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@ailessonplanner.com" },
    update: {},
    create: {
      email: "admin@ailessonplanner.com",
      passwordHash: adminPassword,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  })
  console.log(`Created admin: ${admin.email}`)

  // Create demo school
  const school = await prisma.school.upsert({
    where: { slug: "demo-school" },
    update: {},
    create: {
      name: "Demo School",
      slug: "demo-school",
      address: "123 Education Lane, Nairobi",
      phone: "+254 700 000 000",
      email: "info@demoschool.com",
    },
  })
  console.log(`Created school: ${school.name}`)

  // Create demo teacher
  const teacherPassword = await bcrypt.hash("teacher123", 12)
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@demoschool.com" },
    update: {},
    create: {
      email: "teacher@demoschool.com",
      passwordHash: teacherPassword,
      name: "Jane Teacher",
      role: "TEACHER",
      isActive: true,
    },
  })
  console.log(`Created teacher: ${teacher.email}`)

  // Add teacher to school
  await prisma.schoolMember.upsert({
    where: { schoolId_userId: { schoolId: school.id, userId: teacher.id } },
    update: {},
    create: {
      schoolId: school.id,
      userId: teacher.id,
      role: "TEACHER",
    },
  })

  // Create subscription for teacher
  await prisma.subscription.upsert({
    where: { userId: teacher.id },
    update: {},
    create: {
      userId: teacher.id,
      tier: "PROFESSIONAL",
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  // Create departments
  const departments = [
    { name: "Mathematics", schoolId: school.id },
    { name: "Languages", schoolId: school.id },
    { name: "Sciences", schoolId: school.id },
    { name: "Humanities", schoolId: school.id },
  ]

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { schoolId_name: { schoolId: school.id, name: dept.name } },
      update: {},
      create: dept,
    })
  }

  // Create subjects
  const subjects = [
    { name: "Mathematics", schoolId: school.id },
    { name: "English", schoolId: school.id },
    { name: "Kiswahili", schoolId: school.id },
    { name: "Science and Technology", schoolId: school.id },
    { name: "Social Studies", schoolId: school.id },
    { name: "CRE", schoolId: school.id },
    { name: "Physical Education", schoolId: school.id },
  ]

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { id: `${school.id}-${subject.name}` },
      update: {},
      create: {
        ...subject,
        id: undefined,
      },
    }).catch(() => {
      // ignore duplicate
    })
  }

  console.log("Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
