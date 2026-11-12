import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampaignCard, Layout, pageMeta, BUSINESS_HUB_URL } from "@/components/marketplace";
import { countries, categories as fallbackCategories } from "@/data/marketplace";
import type { Campaign, Category } from "@/types/marketplace";
import { getMarketplaceCampaigns, getMarketplaceCategories } from "@/services/marketplace-api";

export const Route = createFileRoute("/campaigns")({
  head: () =>
    pageMeta(
      "Creator Campaigns — Influencers.com",
      "Discover open influencer campaigns from businesses, brands, events and products.",
    ),
  component: Campaigns,
});

function Campaigns() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("new");
  const [categoriesList, setCategoriesList] = useState<Category[]>(fallbackCategories);
  const [campaignPool, setCampaignPool] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketplaceCategories().then((res) => {
      if (res && res.length > 0) setCategoriesList(res);
    });
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getMarketplaceCampaigns({
      q: q.trim() || undefined,
      category: cat || undefined,
      country: country || undefined,
      sort,
    })
      .then((res) => {
        if (!active) return;
        setCampaignPool(res);
      })
      .catch((err) => {
        console.warn("Failed to load campaigns:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cat, q, country, sort]);

  return (
    <Layout>
      <section className="bg-ink py-16 text-primary-foreground">
        <div className="page-shell">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-3xl">
              <p className="eyebrow flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-brand" /> Open opportunities
              </p>
              <h1 className="font-display text-5xl font-extrabold sm:text-6xl">
                Find campaigns that fit your voice.
              </h1>
              <p className="mt-5 text-primary-foreground/65">
                Discover briefs from businesses seeking creators for campaigns, launches, events and
                local stories.
              </p>
            </div>
            <div className="shrink-0">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <a href={`${BUSINESS_HUB_URL}/campaigns/new`}>
                  <PlusCircle className="size-4 mr-2" /> Post an Opportunity
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8 grid max-w-4xl gap-3 rounded-lg bg-background p-3 text-foreground sm:grid-cols-[1fr_.6fr_.6fr_auto]">
            <label className="flex items-center gap-2 px-2">
              <Search className="size-4 text-muted-foreground" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search opportunities"
              />
            </label>
            <select className="field" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">All categories</option>
              {categoriesList.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <select className="field" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">Anywhere</option>
              <option value="remote">Remote only</option>
              {countries.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <Button onClick={() => {}}>Search</Button>
          </div>
        </div>
      </section>

      <section className="page-shell py-12">
        <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-center">
          <div>
            <h2 className="font-display text-2xl font-bold">
              {loading ? "Searching opportunities..." : `${campaignPool.length} open campaigns`}
            </h2>
            <p className="text-sm text-muted-foreground">
              Fresh commercial briefs, updated live by registered businesses
            </p>
          </div>
          <select className="field w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="new">Newest first</option>
            <option value="budget">Highest budget</option>
          </select>
        </div>

        {campaignPool.length === 0 && !loading ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            <h3 className="font-display text-lg font-bold">No campaigns found</h3>
            <p className="mt-1 text-sm">
              Try adjusting your search criteria or clear category/country filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaignPool.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
