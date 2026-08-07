import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  signSession,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Usuario y contraseña son obligatorios" },
      { status: 400 }
    );
  }

  const { usuario, password } = parsed.data;

  const admin = await prisma.admin.findUnique({ where: { usuario } });
  if (!admin) {
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { ultimoLogin: new Date() },
  });

  const token = signSession({ adminId: admin.id, usuario: admin.usuario });

  const response = NextResponse.json({ usuario: admin.usuario });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
