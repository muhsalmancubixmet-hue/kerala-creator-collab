import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Filter,
  MessageCircle,
  Search,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import hero from "@/assets/creator-studio-hero.jpg";
import { Button } from "@/components/ui/button";
import {
  CreatorCard,
  Layout,
  SectionHeading,
  pageMeta,
  emptyDiscover,
  BUSINESS_HUB_URL,
} from "@/components/marketplace";
import { creators } from "@/data/marketplace";
import type { Creator } from "@/types/marketplace";
import { getMarketplaceCreators } from "@/services/marketplace-api";
const steps = [
  { icon: Search, title: "Find creators", copy: "Search a curated creator community." },
  {
    icon: Filter,
    title: "Filter with intent",
    copy: "Narrow by niche, audience, place and format.",
  },
  { icon: Check, title: "Build a shortlist", copy: "Save the strongest fits for your campaign." },
  {
    icon: MessageCircle,
    title: "Contact directly",
    copy: "Start a clear conversation with context.",
  },
  { icon: Send, title: "Create campaigns", copy: "Publish a brief and invite relevant creators." },
  {
    icon: Users,
    title: "Manage together",
    copy: "Keep collaboration details moving in one place.",
  },
];
export const Route = createFileRoute("/for-businesses")({
  head: () =>
    pageMeta(
      "Influencer Marketing for Businesses — Influencers.com",
      "Find, shortlist and collaborate with creators for credible local campaigns.",
    ),
  component: Business,
});
function Business() {
  const [liveCreators, setLiveCreators] = useState<Creator[]>(creators);
  useEffect(() => {
    let active = true;
    getMarketplaceCreators().then((res) => {
      if (active && res && res.length > 0) setLiveCreators(res.slice(0, 3));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Layout>
      <section className="page-shell grid gap-10 py-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow">For businesses</p>
          <h1 className="font-display text-5xl font-extrabold leading-[1.06] sm:text-6xl">
            Global reach. Local influence.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Find creators who understand your audiences, culture and communities—then move from
            discovery to collaboration without the guesswork.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/discover" search={emptyDiscover}>
                Find Influencers <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={`${BUSINESS_HUB_URL}/signup`}>
                Create Business Account
              </a>
            </Button>
          </div>
          <div className="mt-8 flex gap-8 text-sm">
            <span>
              <strong className="block font-display text-2xl">1,800+</strong>Creators
            </span>
            <span>
              <strong className="block font-display text-2xl">Global</strong>any city
            </span>
            <span>
              <strong className="block font-display text-2xl">40+</strong>niches
            </span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={hero}
            width={1920}
            height={1088}
            alt="A business working with content creators"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-background/95 p-4 shadow-elevated backdrop-blur">
            <p className="text-xs font-bold uppercase text-brand">Smart creator match</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold">Fashion creators · Dubai · 50 km</span>
              <span className="text-sm text-muted-foreground">48 matches</span>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-secondary/60 py-20">
        <div className="page-shell">
          <SectionHeading
            eyebrow="From brief to live"
            title="A clearer way to collaborate"
            copy="Everything your team needs to discover creators and start better conversations."
          />
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {steps.map((s, i) => (
              <article key={s.title} className="bg-background p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full bg-brand-soft text-brand">
                    <s.icon />
                  </span>
                  <span className="font-display text-sm font-extrabold text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="page-shell py-20">
        <SectionHeading
          eyebrow="Discovery preview"
          title="See the people behind the reach"
          copy="Compare fit, creative voice, engagement and location before you make contact."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {liveCreators.map((c) => (
            <CreatorCard creator={c} key={c.slug} />
          ))}
        </div>
      </section>
      <section className="page-shell">
        <div className="rounded-xl bg-ink p-10 text-primary-foreground sm:p-14">
          <Sparkles className="text-brand" />
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-extrabold">
            Your next campaign already has a local voice.
          </h2>
          <p className="mt-4 text-primary-foreground/65">
            Find it today with a free business profile.
          </p>
          <Button className="mt-7" variant="secondary" asChild>
            <a href={`${BUSINESS_HUB_URL}/signup`}>
              Create Business Account
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
