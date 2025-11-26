import { z } from "zod";

const monthRegex = /^\d{4}-\d{2}$/;
const slugRegex = /^[a-z0-9-]+$/;

const idSchema = z
  .string()
  .min(1, "Identifier is required")
  .trim()
  .regex(/^\d+$/)
  .transform((val) => Number(val));

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const personalInfoSchema = z.object({
  fullName: z.string().min(1),
  title: z.string().min(1),
  photoUrl: z.string().url(),
  shortBio: z.string().min(1),
  email: z.string().email(),
  city: z.string().min(1),
  githubUrl: z.string().url(),
  linkedinUrl: z.string().url(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
});

export const educationSchema = z.object({
  id: idSchema.optional(),
  school: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startDate: z.string().regex(monthRegex),
  endDate: z.string().regex(monthRegex).optional().or(z.literal("")),
  description: z.string().min(1),
  order: z.coerce.number().int().nonnegative().default(0),
});

export const categorySchema = z.object({
  id: idSchema.optional(),
  name: z.string().min(1),
  order: z.coerce.number().int().nonnegative().default(0),
});

export const skillSchema = z.object({
  id: idSchema.optional(),
  categoryId: idSchema,
  name: z.string().min(1),
  level: z.string().optional(),
  order: z.coerce.number().int().nonnegative().default(0),
});

export const experienceSchema = z.object({
  id: idSchema.optional(),
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string().regex(monthRegex),
  endDate: z.string().regex(monthRegex).optional().or(z.literal("")),
  description: z.string().min(1),
  technologies: z.string().min(1),
  order: z.coerce.number().int().nonnegative().default(0),
});

export const projectSchema = z.object({
  id: idSchema.optional(),
  slug: z.string().regex(slugRegex),
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  techStack: z.string().min(1),
  order: z.coerce.number().int().nonnegative().default(0),
});

export const projectLinkSchema = z.object({
  id: idSchema.optional(),
  projectId: idSchema,
  label: z.string().min(1),
  url: z.string().url(),
  order: z.coerce.number().int().nonnegative().default(0),
});

export const projectImageSchema = z.object({
  id: idSchema.optional(),
  projectId: idSchema,
  imageUrl: z.string().url(),
  altText: z.string().min(1),
  order: z.coerce.number().int().nonnegative().default(0),
});

export const deleteSchema = z.object({
  id: idSchema,
});
