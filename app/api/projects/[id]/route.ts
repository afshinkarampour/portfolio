import { NextResponse } from "next/server";
import prisma from "../../../../utils/client";
import { projectSchema } from "@/utils/projectValidation";

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
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        {
          ok: false,
          message: "Validation failed",
          error: parsed.error.issues,
        },
        { status: 400 }
      );

    const updated = await prisma.project.update({
      where: { id: numericId },
      data: parsed.data,
    });
    return NextResponse.json({
      ok: true,
      project: updated,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Failed to update project" },
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

    await prisma.project.delete({ where: { id: numericId } });
    return NextResponse.json({
      ok: true,
      message: "Project deleted successfully",
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
    const numricId = parseInt(id, 10);
    if (isNaN(numricId)) {
      return NextResponse.json(
        { ok: false, message: "Invalid id" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: numricId },
    });

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      project,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { ok: false, message: "Project not fetched" },
      { status: 500 }
    );
  }
}
