import { NextResponse } from "next/server";
import prisma from "../../../../utils/client";
import { skillSchema } from "@/utils/skillValidation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ---------------- PUT / PATCH ----------------
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = skillSchema.safeParse(body);
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

    //Years is Int in DB and must be casted
    const parsedData = {
      ...parsed.data,
      years: parsed.data.years ? Number(parsed.data.years) : null,
    };

    const updatedSkill = await prisma.skill.update({
      where: { id: numericId },
      data: parsedData,
    });

    return NextResponse.json({ ok: true, skill: updatedSkill });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Failed to update skill" },
      { status: 500 }
    );
  }
}

// ---------------- DELETE ----------------
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    await prisma.skill.delete({ where: { id: numericId } });
    return NextResponse.json({
      ok: true,
      message: "Experience deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Failed to delete skill" },
      { status: 500 }
    );
  }
}

//------------------Get skill by id-------------
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.findUnique({
      where: { id: numericId },
    });

    if (!skill) {
      return NextResponse.json(
        { ok: false, message: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, skill });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch skill",
      },
      { status: 500 }
    );
  }
}
