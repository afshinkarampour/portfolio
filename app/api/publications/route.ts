import { NextResponse } from "next/server";
import prisma from "../../../utils/client";
import { publicationSchema } from "@/utils/publicationValidation";

export async function GET() {
  try {
    const publications = await prisma.publication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      ok: true,
      publications,
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

export async function POST(req: Request) {
  try {
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

    const newPub = await prisma.publication.create({
      data: {
        ...parsed.data,
        publishedAt: new Date(parsed.data.publishedAt),
      },
    });

    return NextResponse.json({
      ok: true,
      publication: newPub,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to create publication",
      },
      { status: 500 }
    );
  }
}
