import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Globe2,
  Image,
  Instagram,
  Link2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CreatorPortrait,
  EmptyState,
  ErrorState,
  Layout,
  LoadingSkeleton,
  SectionHeading,
  pageMeta,
  CREATOR_HUB_URL,
} from "@/components/marketplace";
import type { Creator } from "@/types/marketplace";
import { getMarketplaceCreators } from "@/services/marketplace-api";
const benefits = [
  {
    icon: BadgeCheck,
    title: "Professional profile",
    copy: "Show brands who you are, what you make and why your community listens.",
  },
  {
    icon: Image,
    title: "Portfolio that sells",
    copy: "Curate reels, campaign work, photography and testimonials in one visual home.",
  },
  {
    icon: Globe2,
    title: "Your creator website",
    copy: "Get a polished public page you can share everywhere as your professional link.",
  },
  {
    icon: Instagram,
    title: "Connected social proof",
    copy: "Bring your platforms, audience and engagement signals into one clear view.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Campaign opportunities",
    copy: "Discover open briefs from businesses seeking creators like you.",
  },
  {
    icon: Link2,
    title: "One link for every pitch",
    copy: "Share your profile and media kit without rebuilding a deck for every enquiry.",
  },
];
export const Route = createFileRoute("/for-influencers")({
  head: () =>
    pageMeta(
      "Build Your Creator Profile — Influencers.com",
      "Create a professional influencer profile, portfolio and media kit to get discovered by businesses.",
    ),
  component: Influencers,
});
function Influencers() {
  const [featured, setFeatured] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCreator = () => {
    let active = true;
    setLoading(true);
    setError(null);
    getMarketplaceCreators({ page_size: 1 })
      .then((res) => {
        if (active && res && res.length > 0 && res[0]) {
          setFeatured(res[0]);
        }
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "Failed to load featured creator.";
        setError(msg);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  };

  useEffect(() => {
    return loadCreator();
  }, []);

  const c = featured;
  if (!c) return null;
  return (
    <Layout>
      <section className="overflow-hidden bg-brand-soft">
        <div className="page-shell grid gap-10 py-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">For influencers</p>
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl">
              Turn your creativity into your calling card.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              Build a professional profile, showcase your best work and let businesses discover what
              makes your voice different.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <a href={`${CREATOR_HUB_URL}/signup`}>
                Create Your Influencer Profile <ArrowRight />
              </a>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Free to create · Publish in minutes
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-2xl pb-10">
            {loading ? (
              <div className="overflow-hidden rounded-xl border border-border bg-background p-6 shadow-elevated">
                <div className="flex gap-4">
                  <div className="size-20 rounded-full animate-pulse bg-muted" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={loadCreator} />
            ) : c ? (
              <div className="overflow-hidden rounded-xl border border-border bg-background shadow-elevated">
                <div className="grid grid-cols-[100px_1fr] gap-4 p-5">
                  <CreatorPortrait creator={c} className="aspect-square rounded-full" />
                  <div>
                    <div className="flex items-center gap-1 font-display text-xl font-bold">
                      {c.name}
                      {c.verified && (
                        <BadgeCheck className="size-4 fill-brand text-primary-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {c.category} creator · {c.city || c.location?.city || "Kerala"}
                    </p>
                    <div className="mt-4 flex gap-5 text-xs">
                      <span>
                        <strong className="block text-base">{c.followersLabel || "0"}</strong>
                        Followers
                      </span>
                      <span>
                        <strong className="block text-base">
                          {c.engagement ? `${c.engagement}%` : "0.0%"}
                        </strong>
                        Engagement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
            <div className="absolute -bottom-1 -left-3 rounded-lg bg-ink p-4 text-primary-foreground shadow-elevated">
              <Sparkles className="size-4 text-brand" />
              <p className="mt-2 text-sm font-bold">
                Your work.
                <br />
                Beautifully presented.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="page-shell py-20">
        <SectionHeading
          eyebrow="A home for your influence"
          title="More than a social bio"
          copy="Everything you need to present your work professionally and open the door to better collaborations."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <article key={b.title} className="rounded-lg border border-border p-6">
              <span className="grid size-11 place-items-center rounded-lg bg-brand-soft text-brand">
                <b.icon />
              </span>
              <h3 className="mt-7 font-display text-xl font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="page-shell">
        <div className="grid rounded-xl bg-ink p-8 text-primary-foreground sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow">Your next chapter</p>
            <h2 className="font-display text-4xl font-extrabold">
              Make it easy for brands to choose you.
            </h2>
            <p className="mt-3 text-primary-foreground/60">
              Create your free public creator profile today.
            </p>
          </div>
          <Button size="lg" variant="secondary" className="mt-6 lg:mt-0" asChild>
            <a href={`${CREATOR_HUB_URL}/signup`}>Create Your Influencer Profile</a>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
