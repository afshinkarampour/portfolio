import { NextResponse } from "next/server";
import prisma from "../../../../utils/client";
import { blogSchema } from "@/utils/blogValidation";

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
    const parsed = blogSchema.safeParse(body);
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

    const updated = await prisma.blog.update({
      where: { id: numericId },
      data: parsed.data,
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
        message: "Failed to update blog",
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

    await prisma.blog.delete({ where: { id: numericId } });
    return NextResponse.json({
      ok: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to delete blog",
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

    const blog = await prisma.blog.findUnique({
      where: { id: numericId },
    });

    if (!blog) {
      return NextResponse.json(
        { ok: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      blog,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch blog",
      },
      { status: 500 }
    );
  }
}
