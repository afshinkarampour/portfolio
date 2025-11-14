import { NextResponse } from "next/server";
import prisma from "../../../../utils/client";
import { experienceSchema } from "@/utils/experienceValidataion";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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

    const updated = await prisma.experience.update({
      where: { id: numericId },
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      },
    });

    return NextResponse.json({
      ok: true,
      experience: updated,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to update experience",
      },
      { status: 500 }
    );
  }
}

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

    await prisma.experience.delete({ where: { id: numericId } });
    return NextResponse.json({
      ok: true,
      message: "Experience deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to delete experience",
      },
      { status: 500 }
    );
  }
}

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

    const experience = await prisma.experience.findUnique({
      where: { id: numericId },
    });

    if (!experience) {
      return NextResponse.json(
        { ok: false, message: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      experience,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch experience",
      },
      { status: 500 }
    );
  }
}
