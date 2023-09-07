import { NextResponse } from "next/server";
import { db } from "@/lib/DB";

// GET /api/user/{userName}/rounds
// For exercise I am using {userName} where tipically userId should be userd
// Since I am randomly generating ids on the ui because is a simple exercise I am querying by name
export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const userRounds = await db.queryRoundsByUserName(params.name);
  return NextResponse.json({ data: userRounds, success: true });
}
