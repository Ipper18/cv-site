"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import {
  assertAuthenticated,
  authenticateAdmin,
  createSession,
  destroyCurrentSession,
} from "@/lib/auth";
import {
  categorySchema,
  deleteSchema,
  educationSchema,
  experienceSchema,
  loginSchema,
  personalInfoSchema,
  projectImageSchema,
  projectLinkSchema,
  projectSchema,
  skillSchema,
} from "@/lib/validators";
import { parseMonthValue } from "@/lib/utils";

function parseForm<T>(formData: FormData) {
  return Object.fromEntries(formData.entries()) as unknown as T;
}

async function refreshPages() {
  revalidatePath("/cv");
  revalidatePath("/cv-admin");
}

export type LoginActionState = {
  success: boolean;
  message?: string;
};

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const payload = parseForm<{ username?: string; password?: string }>(formData);
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, message: "Enter username and password" };
  }

  const admin = await authenticateAdmin(
    parsed.data.username,
    parsed.data.password,
  );

  if (!admin) {
    return { success: false, message: "Invalid credentials" };
  }

  await createSession(admin.id);
  redirect("/cv-admin");
}

export async function logoutAction() {
  await destroyCurrentSession();
  redirect("/cv-admin/login");
}

export async function savePersonalInfo(formData: FormData) {
  await assertAuthenticated();
  const parsed = personalInfoSchema.parse(parseForm(formData));

  await prisma.personalInfo.upsert({
    where: { id: 1 },
    update: {
      fullName: parsed.fullName,
      title: parsed.title,
      photoUrl: parsed.photoUrl,
      shortBio: parsed.shortBio,
      email: parsed.email,
      city: parsed.city,
      githubUrl: parsed.githubUrl,
      linkedinUrl: parsed.linkedinUrl,
      websiteUrl: parsed.websiteUrl || null,
    },
    create: {
      fullName: parsed.fullName,
      title: parsed.title,
      photoUrl: parsed.photoUrl,
      shortBio: parsed.shortBio,
      email: parsed.email,
      city: parsed.city,
      githubUrl: parsed.githubUrl,
      linkedinUrl: parsed.linkedinUrl,
      websiteUrl: parsed.websiteUrl || null,
    },
  });

  await refreshPages();
}

export async function saveEducation(formData: FormData) {
  await assertAuthenticated();
  const parsed = educationSchema.parse(parseForm(formData));
  const startDate = parseMonthValue(parsed.startDate);
  if (!startDate) throw new Error("Invalid start date");
  const endDate = parsed.endDate ? parseMonthValue(parsed.endDate) : null;

  const baseData = {
    school: parsed.school,
    degree: parsed.degree,
    field: parsed.field,
    startDate,
    endDate,
    description: parsed.description,
    order: parsed.order,
  };

  if (parsed.id) {
    await prisma.education.update({ where: { id: parsed.id }, data: baseData });
  } else {
    await prisma.education.create({ data: baseData });
  }

  await refreshPages();
}

export async function deleteEducation(formData: FormData) {
  await assertAuthenticated();
  const parsed = deleteSchema.parse(parseForm(formData));
  await prisma.education.delete({ where: { id: parsed.id } });
  await refreshPages();
}

export async function saveSkillCategory(formData: FormData) {
  await assertAuthenticated();
  const parsed = categorySchema.parse(parseForm(formData));
  if (parsed.id) {
    await prisma.skillCategory.update({
      where: { id: parsed.id },
      data: { name: parsed.name, order: parsed.order },
    });
  } else {
    await prisma.skillCategory.create({
      data: { name: parsed.name, order: parsed.order },
    });
  }
  await refreshPages();
}

export async function deleteSkillCategory(formData: FormData) {
  await assertAuthenticated();
  const parsed = deleteSchema.parse(parseForm(formData));
  await prisma.skillCategory.delete({ where: { id: parsed.id } });
  await refreshPages();
}

export async function saveSkill(formData: FormData) {
  await assertAuthenticated();
  const parsed = skillSchema.parse(parseForm(formData));
  const data = {
    name: parsed.name,
    level: parsed.level || null,
    order: parsed.order,
    categoryId: parsed.categoryId,
  };
  if (parsed.id) {
    await prisma.skill.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.skill.create({ data });
  }
  await refreshPages();
}

export async function deleteSkill(formData: FormData) {
  await assertAuthenticated();
  const parsed = deleteSchema.parse(parseForm(formData));
  await prisma.skill.delete({ where: { id: parsed.id } });
  await refreshPages();
}

export async function saveExperience(formData: FormData) {
  await assertAuthenticated();
  const parsed = experienceSchema.parse(parseForm(formData));
  const startDate = parseMonthValue(parsed.startDate);
  if (!startDate) throw new Error("Invalid start date");
  const endDate = parsed.endDate ? parseMonthValue(parsed.endDate) : null;

  const data = {
    company: parsed.company,
    role: parsed.role,
    location: parsed.location || null,
    startDate,
    endDate,
    description: parsed.description,
    technologies: parsed.technologies,
    order: parsed.order,
  };

  if (parsed.id) {
    await prisma.experience.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.experience.create({ data });
  }

  await refreshPages();
}

export async function deleteExperience(formData: FormData) {
  await assertAuthenticated();
  const parsed = deleteSchema.parse(parseForm(formData));
  await prisma.experience.delete({ where: { id: parsed.id } });
  await refreshPages();
}

export async function saveProject(formData: FormData) {
  await assertAuthenticated();
  const parsed = projectSchema.parse(parseForm(formData));
  const data = {
    slug: parsed.slug,
    name: parsed.name,
    shortDescription: parsed.shortDescription,
    longDescription: parsed.longDescription,
    techStack: parsed.techStack,
    order: parsed.order,
  };

  if (parsed.id) {
    await prisma.project.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.project.create({ data });
  }

  await refreshPages();
}

export async function deleteProject(formData: FormData) {
  await assertAuthenticated();
  const parsed = deleteSchema.parse(parseForm(formData));
  await prisma.project.delete({ where: { id: parsed.id } });
  await refreshPages();
}

export async function saveProjectLink(formData: FormData) {
  await assertAuthenticated();
  const parsed = projectLinkSchema.parse(parseForm(formData));
  const data = {
    label: parsed.label,
    url: parsed.url,
    order: parsed.order,
    projectId: parsed.projectId,
  };
  if (parsed.id) {
    await prisma.projectLink.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.projectLink.create({ data });
  }
  await refreshPages();
}

export async function deleteProjectLink(formData: FormData) {
  await assertAuthenticated();
  const parsed = deleteSchema.parse(parseForm(formData));
  await prisma.projectLink.delete({ where: { id: parsed.id } });
  await refreshPages();
}

export async function saveProjectImage(formData: FormData) {
  await assertAuthenticated();
  const parsed = projectImageSchema.parse(parseForm(formData));
  const data = {
    imageUrl: parsed.imageUrl,
    altText: parsed.altText,
    order: parsed.order,
    projectId: parsed.projectId,
  };
  if (parsed.id) {
    await prisma.projectImage.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.projectImage.create({ data });
  }
  await refreshPages();
}

export async function deleteProjectImage(formData: FormData) {
  await assertAuthenticated();
  const parsed = deleteSchema.parse(parseForm(formData));
  await prisma.projectImage.delete({ where: { id: parsed.id } });
  await refreshPages();
}
