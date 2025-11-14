import { NextResponse } from "next/server";
import prisma from "../../../utils/client";
import { experienceSchema } from "@/utils/experienceValidataion";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      ok: true,
      experiences,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch experiences",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = experienceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Validation failed",
          errors: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const newExp = await prisma.experience.create({
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      },
    });

    return NextResponse.json({
      ok: true,
      experience: newExp,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to create experience",
      },
      { status: 500 }
    );
  }
}
