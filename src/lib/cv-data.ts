import prisma from "@/lib/prisma";
import { seedData, type CvSeedData } from "@/lib/seed-data";

export type CvPersonalInfo = {
  id?: number;
  fullName: string;
  title: string;
  photoUrl: string;
  shortBio: string;
  email: string;
  city: string;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl?: string;
};

export type CvEducation = {
  id?: number;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description: string;
  order: number;
};

export type CvSkillCategory = {
  id?: number;
  name: string;
  order: number;
  skills: Array<{ id?: number; name: string; level?: string; order: number }>;
};

export type CvExperience = {
  id?: number;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string;
  technologiesList: string[];
  order: number;
};

export type CvProject = {
  id?: number;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  techStack: string;
  techTags: string[];
  order: number;
  links: Array<{ id?: number; label: string; url: string; order: number }>;
  images: Array<{ id?: number; imageUrl: string; altText: string; order: number }>;
};

export type CvData = {
  personalInfo: CvPersonalInfo | null;
  education: CvEducation[];
  skillCategories: CvSkillCategory[];
  experiences: CvExperience[];
  projects: CvProject[];
  fromSeed: boolean;
};

function toIso(date: Date | null | undefined) {
  return date ? date.toISOString() : undefined;
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeEducation(entry: {
  id: number;
  school: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  order: number;
}): CvEducation {
  return {
    id: entry.id,
    school: entry.school,
    degree: entry.degree,
    field: entry.field,
    startDate: entry.startDate.toISOString(),
    endDate: toIso(entry.endDate),
    description: entry.description,
    order: entry.order,
  };
}

function serializeExperience(entry: {
  id: number;
  company: string;
  role: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  description: string;
  technologies: string;
  order: number;
}): CvExperience {
  return {
    id: entry.id,
    company: entry.company,
    role: entry.role,
    location: entry.location ?? undefined,
    startDate: entry.startDate.toISOString(),
    endDate: toIso(entry.endDate),
    description: entry.description,
    technologies: entry.technologies,
    technologiesList: splitList(entry.technologies),
    order: entry.order,
  };
}

function serializeProjects(entries: Array<{
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  techStack: string;
  order: number;
  links: Array<{ id: number; label: string; url: string; order: number }>;
  images: Array<{ id: number; imageUrl: string; altText: string; order: number }>;
}>): CvProject[] {
  return entries
    .map((project) => ({
      id: project.id,
      slug: project.slug,
      name: project.name,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription,
      techStack: project.techStack,
      techTags: splitList(project.techStack),
      order: project.order,
      links: project.links
        .map((link) => ({
          id: link.id,
          label: link.label,
          url: link.url,
          order: link.order,
        }))
        .sort((a, b) => a.order - b.order),
      images: project.images
        .map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
          altText: image.altText,
          order: image.order,
        }))
        .sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.order - b.order);
}

function serializeSkills(entries: Array<{
  id: number;
  name: string;
  order: number;
  skills: Array<{ id: number; name: string; level: string | null; order: number }>;
}>): CvSkillCategory[] {
  return entries
    .map((category) => ({
      id: category.id,
      name: category.name,
      order: category.order,
      skills: category.skills
        .map((skill) => ({
          id: skill.id,
          name: skill.name,
          level: skill.level ?? undefined,
          order: skill.order,
        }))
        .sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.order - b.order);
}

function convertSeed(seed: CvSeedData): CvData {
  return {
    personalInfo: seed.personalInfo,
    education: seed.education,
    skillCategories: seed.skillCategories,
    experiences: seed.experiences.map((exp) => ({
      ...exp,
      technologiesList: splitList(exp.technologies),
    })),
    projects: seed.projects.map((project) => ({
      ...project,
      techTags: splitList(project.techStack),
    })),
    fromSeed: true,
  };
}

export async function getCvData(options?: { fallbackToSeed?: boolean }) {
  const fallbackToSeed = options?.fallbackToSeed ?? true;

  try {
    const [personalInfo, education, skillCategories, experiences, projects] =
      await Promise.all([
        prisma.personalInfo.findFirst(),
        prisma.education.findMany({ orderBy: { order: "asc" } }),
        prisma.skillCategory.findMany({
          orderBy: { order: "asc" },
          include: { skills: { orderBy: { order: "asc" } } },
        }),
        prisma.experience.findMany({ orderBy: { order: "asc" } }),
        prisma.project.findMany({
          orderBy: { order: "asc" },
          include: {
            links: { orderBy: { order: "asc" } },
            images: { orderBy: { order: "asc" } },
          },
        }),
      ]);

    const hasAnyData = Boolean(
      personalInfo ||
        education.length ||
        skillCategories.length ||
        experiences.length ||
        projects.length,
    );

    if (!hasAnyData && fallbackToSeed) {
      return convertSeed(seedData);
    }

    return {
      personalInfo: personalInfo
        ? {
            id: personalInfo.id,
            fullName: personalInfo.fullName,
            title: personalInfo.title,
            photoUrl: personalInfo.photoUrl,
            shortBio: personalInfo.shortBio,
            email: personalInfo.email,
            city: personalInfo.city,
            githubUrl: personalInfo.githubUrl,
            linkedinUrl: personalInfo.linkedinUrl,
            websiteUrl: personalInfo.websiteUrl ?? undefined,
          }
        : null,
      education: education.map(serializeEducation),
      skillCategories: serializeSkills(skillCategories),
      experiences: experiences.map(serializeExperience),
      projects: serializeProjects(projects),
      fromSeed: false,
    } satisfies CvData;
  } catch (error) {
    if (fallbackToSeed) {
      console.warn("Falling back to static CV seed data", error);
      return convertSeed(seedData);
    }
    throw error;
  }
}
