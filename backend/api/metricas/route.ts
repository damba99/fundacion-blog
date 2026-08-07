import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getMetricas } from "@/lib/metricas";

export async function GET(request: NextRequest) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const metricas = await getMetricas();
  return NextResponse.json(metricas);
}
