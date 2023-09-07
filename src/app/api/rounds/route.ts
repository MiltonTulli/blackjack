import { NextResponse } from "next/server";
import { db } from "@/lib/DB";

// GET /api/rounds
export async function GET() {
  const allRounds = await db.getRounds();
  return NextResponse.json({ data: allRounds, success: true });
}

// POST /api/rounds
export async function POST(request: Request) {
  const body = await request.json();
  // TODO: validate
  const response = await db.saveRound(body.round);
  return NextResponse.json({ data: response, success: true });
}
