import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import { seedData } from "../src/lib/seed-data";

const prisma = new PrismaClient();

function toDate(value: string) {
  return new Date(value);
}

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be supplied when seeding");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });
}

async function seedPersonalInfo() {
  const count = await prisma.personalInfo.count();
  if (count === 0) {
    await prisma.personalInfo.create({ data: seedData.personalInfo });
  }
}

async function seedEducation() {
  const count = await prisma.education.count();
  if (count === 0) {
    await prisma.education.createMany({
      data: seedData.education.map((entry) => ({
        school: entry.school,
        degree: entry.degree,
        field: entry.field,
        startDate: toDate(entry.startDate),
        endDate: entry.endDate ? toDate(entry.endDate) : null,
        description: entry.description,
        order: entry.order,
      })),
    });
  }
}

async function seedSkills() {
  const count = await prisma.skillCategory.count();
  if (count === 0) {
    for (const category of seedData.skillCategories) {
      await prisma.skillCategory.create({
        data: {
          name: category.name,
          order: category.order,
          skills: {
            create: category.skills.map((skill) => ({
              name: skill.name,
              level: skill.level ?? null,
              order: skill.order,
            })),
          },
        },
      });
    }
  }
}

async function seedExperiences() {
  const count = await prisma.experience.count();
  if (count === 0) {
    await prisma.experience.createMany({
      data: seedData.experiences.map((exp) => ({
        company: exp.company,
        role: exp.role,
        location: exp.location ?? null,
        startDate: toDate(exp.startDate),
        endDate: exp.endDate ? toDate(exp.endDate) : null,
        description: exp.description,
        technologies: exp.technologies,
        order: exp.order,
      })),
    });
  }
}

async function seedProjects() {
  const count = await prisma.project.count();
  if (count === 0) {
    for (const project of seedData.projects) {
      await prisma.project.create({
        data: {
          slug: project.slug,
          name: project.name,
          shortDescription: project.shortDescription,
          longDescription: project.longDescription,
          techStack: project.techStack,
          order: project.order,
          links: { create: project.links },
          images: { create: project.images },
        },
      });
    }
  }
}

async function main() {
  await seedAdmin();
  await Promise.all([
    seedPersonalInfo(),
    seedEducation(),
    seedSkills(),
    seedExperiences(),
    seedProjects(),
  ]);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
