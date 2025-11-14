import { NextResponse } from "next/server";
import prisma from "../../../utils/client";
import { projectSchema } from "@/utils/projectValidation";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ projects });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { ok: false, message: "Validation failed", error: parsed.error.issues },
        { status: 400 }
      );

    const newProj = await prisma.project.create({ data: parsed.data });
    return NextResponse.json({ ok: true, project: newProj });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
