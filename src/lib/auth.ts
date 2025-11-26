import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { ResponseCookies } from "next/dist/server/web/spec-extension/cookies";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";

const SESSION_COOKIE_NAME = "cv_admin_session";

type CookieSetOptions = Parameters<ResponseCookies["set"]>[1];
type CookieStore = Awaited<ReturnType<typeof cookies>> & {
  set: (name: string, value: string, options?: CookieSetOptions) => void;
  delete: (name: string) => void;
};

function getSessionTtl() {
  const ttl = Number(process.env.SESSION_TTL_HOURS ?? "24");
  return Number.isNaN(ttl) ? 24 : ttl;
}

function buildExpiryDate() {
  const expires = new Date();
  expires.setHours(expires.getHours() + getSessionTtl());
  return expires;
}

async function getCookieStore() {
  return (await cookies()) as unknown as CookieStore;
}

export async function authenticateAdmin(
  username: string,
  password: string,
) {
  const normalizedUsername = username.trim().toLowerCase();
  const admin = await prisma.adminUser.findUnique({
    where: { username: normalizedUsername },
  });

  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) {
    return null;
  }

  return admin;
}

export async function createSession(adminUserId: number) {
  const token = crypto.randomUUID();
  const expiresAt = buildExpiryDate();

  await prisma.session.create({
    data: {
      token,
      adminUserId,
      expiresAt,
    },
  });

  const cookieStore = await getCookieStore();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

async function clearCookie() {
  const cookieStore = await getCookieStore();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function destroyCurrentSession() {
  const cookieStore = await getCookieStore();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  await clearCookie();
}

export async function getCurrentAdmin() {
  const cookieStore = await getCookieStore();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { adminUser: true },
  });

  if (!session) {
    await clearCookie();
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    await clearCookie();
    return null;
  }

  return session.adminUser;
}

export async function requireAdminOrRedirect() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/cv-admin/login");
  }
  return admin;
}

export async function assertAuthenticated() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}
