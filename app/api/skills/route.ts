import { NextResponse } from "next/server";
import prisma from "../../../utils/client";
import { skillSchema } from "@/utils/skillValidation";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      // orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, skills });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = skillSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Validation failed", error: parsed.error.issues },
        { status: 400 }
      );
    }

    const { years, ...rest } = parsed.data;

    const formattedData = {
      ...rest,
      years:
        typeof years === "string" && years !== ""
          ? parseInt(years, 10)
          : typeof years === "number"
          ? years
          : null,
    };

    const newSkill = await prisma.skill.create({ data: formattedData });
    return NextResponse.json({ ok: true, skill: newSkill });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Failed to create skill" },
      { status: 500 }
    );
  }
}
