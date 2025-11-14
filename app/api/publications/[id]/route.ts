import { NextResponse } from "next/server";
import prisma from "../../../../utils/client";
import { publicationSchema } from "@/utils/publicationValidation";

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
    const parsed = publicationSchema.safeParse(body);
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

    const updated = await prisma.publication.update({
      where: { id: numericId },
      data: {
        ...parsed.data,
        publishedAt: new Date(parsed.data.publishedAt),
      },
    });

    return NextResponse.json({
      ok: true,
      publication: updated,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to update publication",
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

    await prisma.publication.delete({ where: { id: numericId } });
    return NextResponse.json({
      ok: true,
      message: "Publication deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to delete publication",
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

    const publication = await prisma.publication.findUnique({
      where: { id: numericId },
    });

    if (!publication) {
      return NextResponse.json(
        { ok: false, message: "Publication not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      publication,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch publication",
      },
      { status: 500 }
    );
  }
}
