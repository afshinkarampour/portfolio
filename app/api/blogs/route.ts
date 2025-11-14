import { NextResponse } from "next/server";
import prisma from "../../../utils/client";
import { blogSchema } from "@/utils/blogValidation";

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, blogs });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    const newBlog = await prisma.blog.create({
      data: parsed.data,
    });

    return NextResponse.json({
      ok: true,
      blog: newBlog,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to create blog",
      },
      { status: 500 }
    );
  }
}
