"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PLATFORM_CONFIG, type PlatformKey } from "@/lib/platforms-config";
import { PlatformCard } from "@/components/platform-card";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, "A compelling title helps reach."),
  summary: z.string().min(24, "Write a short synopsis (24+ characters)."),
  content: z.string().min(100, "Paste your article (100+ characters)."),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  tags: z.string().optional()
});

type FormSchema = z.infer<typeof formSchema>;

interface PublishResult {
  platform: PlatformKey;
  status: "success" | "skipped" | "failed";
  message: string;
}

export default function HomePage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformKey[]>([
    "twitter",
    "linkedin",
    "medium"
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<PublishResult[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
  formState: { errors }
} = useForm<FormSchema>({
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      canonicalUrl: "",
      imageUrl: "",
      tags: ""
    },
    resolver: zodResolver(formSchema)
  });

  const tagsValue = watch("tags");

  const parsedTags = useMemo(() => {
    const raw = tagsValue ?? "";
    return raw
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 8);
  }, [tagsValue]);

  const togglePlatform = (platform: PlatformKey) => {
    setResults(null);
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((item) => item !== platform)
        : [...prev, platform]
    );
  };

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setResults(null);

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...values,
          tags: parsedTags,
          platforms: selectedPlatforms
        })
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body?.message ?? "Failed to publish");
      }

      setResults(body.results as PublishResult[]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-10 shadow-xl shadow-slate-950/60">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-brand">
            <Sparkles />
          </div>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Agentic Publisher</h1>
            <p className="mt-2 max-w-2xl text-base text-slate-300">
              Transform long-form articles into channel-ready narratives and automatically publish them across every audience you manage.
            </p>
          </div>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Social endpoints ready", value: Object.keys(PLATFORM_CONFIG).length },
            { label: "Max hashtags", value: parsedTags.length || 0 },
            { label: "Average launch time", value: "< 4s" }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-500">{item.label}</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-100">{item.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-10"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <Wand2 className="h-5 w-5 text-brand" />
            <span className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Compose
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-200" htmlFor="title">
              Blog title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Mastering async workflows with Next.js server actions"
              className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-100 outline-none transition focus:border-brand"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-200" htmlFor="summary">
              Social summary
            </label>
            <textarea
              id="summary"
              rows={4}
              placeholder="Distill the main insight and tease the payoff..."
              className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-100 outline-none transition focus:border-brand"
              {...register("summary")}
            />
            {errors.summary && (
              <p className="text-xs text-red-400">{errors.summary.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-200" htmlFor="content">
              Article
            </label>
            <textarea
              id="content"
              rows={12}
              placeholder="Paste your long-form article or markdown..."
              className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-100 outline-none transition focus:border-brand"
              {...register("content")}
            />
            <p className="text-xs text-slate-500">
              Content is sent as markdown to code-friendly destinations and converted to HTML for Medium.
            </p>
            {errors.content && (
              <p className="text-xs text-red-400">{errors.content.message}</p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-slate-200" htmlFor="canonicalUrl">
                Canonical URL
              </label>
              <input
                id="canonicalUrl"
                type="url"
                placeholder="https://yourblog.com/async-workflows"
                className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-100 outline-none transition focus:border-brand"
                {...register("canonicalUrl")}
              />
              {errors.canonicalUrl && (
                <p className="text-xs text-red-400">{errors.canonicalUrl.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-slate-200" htmlFor="imageUrl">
                Featured image URL
              </label>
              <input
                id="imageUrl"
                type="url"
                placeholder="https://yourcdn.com/cover.png"
                className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-100 outline-none transition focus:border-brand"
                {...register("imageUrl")}
              />
              {errors.imageUrl && (
                <p className="text-xs text-red-400">{errors.imageUrl.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-200" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              placeholder="Next.js, Server Actions, Automation"
              className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-100 outline-none transition focus:border-brand"
              {...register("tags")}
            />
            {parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {parsedTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || selectedPlatforms.length === 0}
            className={cn(
              "mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate &amp; Publish
              </>
            )}
          </button>

          {errorMessage && (
            <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200">
              {errorMessage}
            </div>
          )}
        </form>

        <aside className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Destinations</h2>
            <p className="mt-1 text-sm text-slate-400">
              Toggle where your blog post should land. Missing credentials automatically skip a channel.
            </p>
          </div>

          <div className="grid gap-3">
            {Object.keys(PLATFORM_CONFIG).map((key) => {
              const platform = key as PlatformKey;
              return (
                <PlatformCard
                  key={platform}
                  platform={platform}
                  selected={selectedPlatforms.includes(platform)}
                  onToggle={togglePlatform}
                />
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300">
            <p className="font-semibold text-slate-100">Automation snapshot</p>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>• Hashtags generated from tags field automatically.</li>
              <li>• LinkedIn and Facebook pull summary &amp; canonical links.</li>
              <li>• Medium &amp; DEV.to ship markdown with canonical references.</li>
            </ul>
          </div>

          {results && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm font-semibold text-slate-200">Latest run</p>
              <ul className="mt-3 space-y-3 text-sm">
                {results.map((result) => (
                  <li
                    key={result.platform}
                    className={cn(
                      "rounded-xl border px-4 py-3",
                      result.status === "success" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
                      result.status === "skipped" && "border-slate-700 bg-slate-900 text-slate-300",
                      result.status === "failed" && "border-orange-500/40 bg-orange-500/10 text-orange-100"
                    )}
                  >
                    <span className="block text-xs uppercase tracking-wide text-slate-500">
                      {PLATFORM_CONFIG[result.platform].label}
                    </span>
                    <span className="font-medium capitalize">
                      {result.status}
                    </span>
                    <span className="block text-xs text-slate-300">{result.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
