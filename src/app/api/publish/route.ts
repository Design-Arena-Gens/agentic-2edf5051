import { NextResponse } from "next/server";
import { z } from "zod";
import { publishToPlatforms, type PublishContext } from "@/lib/platforms";
import { PLATFORM_KEYS, type PlatformKey } from "@/lib/platforms-config";

const publishSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  summary: z.string().min(24, "Summary must be at least 24 characters."),
  content: z.string().min(100, "Content must be at least 100 characters."),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).max(8),
  platforms: z.array(z.enum(PLATFORM_KEYS as [PlatformKey, ...PlatformKey[]])).min(
    1,
    "Select at least one platform."
  )
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = publishSchema.parse({
      ...payload,
      tags: Array.isArray(payload.tags)
        ? payload.tags
        : typeof payload.tags === "string"
          ? payload.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
          : []
    });

    const context: PublishContext = {
      title: parsed.title,
      summary: parsed.summary,
      content: parsed.content,
      tags: parsed.tags,
      canonicalUrl: parsed.canonicalUrl || undefined,
      imageUrl: parsed.imageUrl || undefined
    };

    const results = await publishToPlatforms(context, parsed.platforms);

    return NextResponse.json({
      ok: true,
      results
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          message: "Validation failed",
          issues: error.errors
        },
        { status: 422 }
      );
    }

    console.error("[publish] Unexpected error", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Failed to publish content.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
