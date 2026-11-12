import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, MapPin, Sparkles, Star, Users } from "lucide-react";
import hero from "@/assets/creator-studio-hero.jpg";
import { Button } from "@/components/ui/button";
import {
  CampaignCard,
  CreatorCard,
  Layout,
  LoadingSkeleton,
  SearchBar,
  SectionHeading,
  pageMeta,
  emptyDiscover,
  CREATOR_HUB_URL,
} from "@/components/marketplace";
import { countries, places, categories as fallbackCategories } from "@/data/marketplace";
import type { Creator, Campaign, Category } from "@/types/marketplace";
import {
  getMarketplaceCampaigns,
  getMarketplaceCreators,
  getMarketplaceCategories,
} from "@/services/marketplace-api";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta(
      "Influencers.com — Find the right creators",
      "Discover trusted influencers by niche, location, audience, platform and services.",
    ),
  component: Home,
});

function Home() {
  const [liveCreators, setLiveCreators] = useState<Creator[]>([]);
  const [liveCampaigns, setLiveCampaigns] = useState<Campaign[]>([]);
  const [liveCategories, setLiveCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      getMarketplaceCreators({ page_size: 8 }),
      getMarketplaceCampaigns(),
      getMarketplaceCategories(),
    ])
      .then(([creatorsRes, campaignsRes, categoriesRes]) => {
        if (!active) return;
        if (creatorsRes && creatorsRes.length > 0) setLiveCreators(creatorsRes);
        if (campaignsRes && campaignsRes.length > 0) setLiveCampaigns(campaignsRes);
        if (categoriesRes && categoriesRes.length > 0) setLiveCategories(categoriesRes);
      })
      .catch((err) => {
        console.warn("Home data initialization warning:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Layout>
      <section className="page-shell pt-5">
        <div className="relative min-h-[600px] overflow-hidden rounded-xl bg-ink sm:min-h-[650px]">
          <img
            src={hero}
            alt="Creators producing a campaign in a bright studio"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/58 to-ink/10" />
          <div className="relative z-10 flex min-h-[600px] max-w-2xl flex-col justify-center px-6 py-16 text-primary-foreground sm:min-h-[650px] sm:px-12">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-primary-foreground/75">
              <Sparkles className="size-4 text-brand" /> The creator marketplace
            </p>
            <h1 className="font-display text-5xl font-extrabold leading-[1.04] tracking-normal sm:text-7xl">
              Find the right influencer for your brand
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-primary-foreground/75 sm:text-lg">
              Discover creators by niche, city, audience, platform and services—then build
              collaborations anywhere in the world.
            </p>
            <div className="mt-8">
              <SearchBar large />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/discover" search={emptyDiscover}>
                  Discover Influencers <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="footer" asChild>
                <a href={`${CREATOR_HUB_URL}/signup`}>Join as Influencer</a>
              </Button>
            </div>
            <div className="mt-9 flex flex-wrap gap-5 text-xs text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-brand" /> Verified profiles
              </span>
              <span className="flex items-center gap-2">
                <Users className="size-4 text-brand" /> 1,800+ creators
              </span>
              <span className="flex items-center gap-2">
                <Star className="size-4 text-brand" /> Trusted by local brands
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <SectionHeading
          eyebrow="Featured voices"
          title="Creators worth discovering"
          copy="Distinctive storytellers with engaged communities everywhere."
          action={
            <Button variant="ghost" asChild>
              <Link to="/discover" search={emptyDiscover}>
                View all <ArrowRight />
              </Link>
            </Button>
          }
        />
        {loading && liveCreators.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
            {liveCreators.slice(0, 4).map((c) => (
              <div key={c.slug} className="min-w-[82vw] snap-start sm:min-w-0">
                <CreatorCard creator={c} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Browse by niche"
            title="Every kind of influence"
            copy="From home kitchens to gaming rooms, discover creators your audience already trusts."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {liveCategories.slice(0, 10).map((c, i) => (
              <Link
                key={c.name}
                to="/discover"
                search={{ ...emptyDiscover, category: c.name }}
                className="group rounded-lg border border-border bg-background p-4 transition hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="mb-7 flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-sm font-extrabold text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-brand" />
                </div>
                <h3 className="font-display font-bold">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.creator_count ?? 10} creators
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <SectionHeading
          eyebrow="Discover worldwide"
          title="Find creators near you — or anywhere"
          copy="Pick a city to see creators within 50 km, or open the map to explore the world."
        />
        <div className="grid overflow-hidden rounded-xl bg-ink text-primary-foreground md:grid-cols-[1.1fr_.9fr]">
          <div className="p-7 sm:p-10">
            <div className="flex flex-wrap gap-2">
              {places.map((p, i) => (
                <Link
                  key={p.id}
                  to="/discover"
                  search={{ ...emptyDiscover, location: p.id, radius: 50 }}
                  className={`rounded-full border px-4 py-2 text-sm transition hover:bg-primary-foreground hover:text-ink ${i < 3 ? "border-brand bg-brand text-primary-foreground" : "border-primary-foreground/20"}`}
                >
                  <MapPin className="mr-1 inline size-3" />
                  {p.city}, {p.countryCode}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex min-h-72 items-end bg-gradient-to-br from-brand via-brand to-success p-8">
            <div>
              <p className="font-display text-5xl font-extrabold">{countries.length}+ countries</p>
              <p className="mt-2 max-w-xs text-sm text-primary-foreground/80">
                Any city, any language, any platform. One place to find the right match.
              </p>
              <Button className="mt-5" variant="secondary" asChild>
                <Link to="/discover" search={{ ...emptyDiscover, view: "map" }}>
                  Open world map <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-10">
        <SectionHeading
          eyebrow="Open opportunities"
          title="Campaigns looking for creators"
          action={
            <Button variant="outline" asChild>
              <Link to="/campaigns">See all campaigns</Link>
            </Button>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {liveCampaigns.slice(0, 3).map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="grid gap-6 rounded-xl bg-brand-soft p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              Build your next collaboration.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Whether you are a local business or the next great creator, start here.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/for-businesses">I'm a business</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/for-influencers">I'm a creator</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
