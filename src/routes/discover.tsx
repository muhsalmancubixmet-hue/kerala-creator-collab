import { lazy, Suspense, useEffect, useState, useTransition } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Columns2,
  CreatorGrid,
  EmptyState,
  ErrorState,
  FilterPanel,
  Grid2X2,
  Layout,
  List,
  LoadingSkeleton,
  MapIcon,
  SearchBar,
  SlidersHorizontal,
  emptyFilters,
  pageMeta,
  type DiscoverSearch,
  type Filters,
} from "@/components/marketplace";
import { placeById, placeLabel } from "@/data/marketplace";
import type { Creator } from "@/types/marketplace";
import { getMarketplacePaginatedCreators } from "@/services/marketplace-api";

const CreatorMap = lazy(() =>
  import("@/components/creator-map").then((m) => ({ default: m.CreatorMap })),
);

const schema = z.object({
  q: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "").default(""),
  location: fallback(z.string(), "").default(""),
  country: fallback(z.string(), "").default(""),
  platform: fallback(z.string(), "").default(""),
  radius: fallback(z.number(), 0).default(0),
  sort: fallback(z.string(), "relevance").default("relevance"),
  view: fallback(z.enum(["list", "map", "split"]), "list").default("list"),
});

export const Route = createFileRoute("/discover")({
  validateSearch: zodValidator(schema),
  head: () =>
    pageMeta(
      "Discover Influencers Worldwide — Influencers.com",
      "Search creators anywhere in the world by location, radius, niche, platform, language, audience and engagement.",
    ),
  component: Discover,
});

function Discover() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });
  const setSearch = (p: Partial<DiscoverSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...p }), replace: true });

  const [filters, setFilters] = useState<Filters>(() => ({
    ...emptyFilters,
    platforms: s.platform ? [s.platform] : [],
  }));
  const [compact, setCompact] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [creatorPool, setCreatorPool] = useState<Creator[]>([]);
  const [error, setError] = useState<string | null>(null);

  const place = placeById(s.location);

  // Fetch initial results upon any filter / search parameter mutation
  useEffect(() => {
    setMounted(true);
    let active = true;
    setLoading(true);
    setError(null);
    setPage(1);

    getMarketplacePaginatedCreators({
      q: s.q || undefined,
      category: s.category || undefined,
      location: s.location || undefined,
      country: s.country || undefined,
      platform: filters.platforms[0] || s.platform || undefined,
      min_followers: filters.minFollowers ? filters.minFollowers * 1000 : undefined,
      min_engagement: filters.minEngagement || undefined,
      verified: filters.verified || undefined,
      remote: filters.remote || undefined,
      available: filters.available || undefined,
      lat: place?.lat,
      lng: place?.lng,
      radius: s.radius || undefined,
      sort: s.sort,
      page: 1,
      page_size: 12,
    })
      .then((res) => {
        if (!active) return;
        setCreatorPool(res.results || []);
        setTotalCount(res.count || 0);
        setHasMore(Boolean(res.next));
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "Failed to query public creators.";
        setError(msg);
        setCreatorPool([]);
        setTotalCount(0);
        setHasMore(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    s.q,
    s.category,
    s.location,
    s.country,
    s.platform,
    s.radius,
    s.sort,
    filters.minFollowers,
    filters.minEngagement,
    filters.maxPriceUSD,
    filters.available,
    filters.verified,
    filters.remote,
    filters.platforms,
    filters.languages,
    place?.lat,
    place?.lng,
  ]);

  // Load subsequent page when "Load more" is triggered
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const res = await getMarketplacePaginatedCreators({
        q: s.q || undefined,
        category: s.category || undefined,
        location: s.location || undefined,
        country: s.country || undefined,
        platform: filters.platforms[0] || s.platform || undefined,
        min_followers: filters.minFollowers ? filters.minFollowers * 1000 : undefined,
        min_engagement: filters.minEngagement || undefined,
        verified: filters.verified || undefined,
        remote: filters.remote || undefined,
        available: filters.available || undefined,
        lat: place?.lat,
        lng: place?.lng,
        radius: s.radius || undefined,
        sort: s.sort,
        page: nextPage,
        page_size: 12,
      });

      setCreatorPool((prev) => [...prev, ...res.results]);
      setPage(nextPage);
      setHasMore(Boolean(res.next));
    } catch (err) {
      console.warn("Failed to load next page:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const clear = () => {
    setFilters(emptyFilters);
    setSearch({ q: "", category: "", location: "", country: "", platform: "", radius: 0 });
  };

  const panel = (
    <FilterPanel search={s} setSearch={setSearch} filters={filters} setFilters={setFilters} />
  );

  const map = mounted ? (
    <Suspense fallback={<div className="h-[480px] animate-pulse rounded-lg bg-muted" />}>
      <CreatorMap
        items={creatorPool}
        center={place ?? null}
        radiusKm={s.radius || undefined}
        className={
          s.view === "split"
            ? "h-[min(70vh,640px)] w-full overflow-hidden rounded-lg border border-border lg:sticky lg:top-24"
            : undefined
        }
      />
    </Suspense>
  ) : (
    <div className="h-[480px] rounded-lg bg-muted" />
  );

  const resultsContent = loading ? (
    <LoadingSkeleton />
  ) : error ? (
    <ErrorState
      message={error}
      onRetry={() => {
        setPage(1);
      }}
    />
  ) : creatorPool.length > 0 ? (
    <CreatorGrid items={creatorPool} compact={compact || s.view === "split"} />
  ) : (
    <EmptyState />
  );

  return (
    <Layout>
      <div className="border-b border-border bg-secondary/50">
        <div className="page-shell py-10">
          <p className="eyebrow">Creator discovery</p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
            Discover influencers anywhere
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Search by city, country or radius, then narrow by the signals that matter to your
            campaign.
          </p>
          <div className="mt-7 max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </div>
      <div className="page-shell grid gap-8 py-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <div className="mb-5 flex items-center justify-between">
              <strong>Filters</strong>
              <button onClick={clear} className="text-xs font-bold text-brand">
                Clear all
              </button>
            </div>
            {panel}
          </div>
        </aside>
        <section className="min-w-0">
          <div className="sticky top-18 z-20 -mx-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0">
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-bold">
                {loading ? "Searching creators..." : `${totalCount} creators found`}
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {place
                  ? `${s.radius ? `Within ${s.radius} km of ` : "In "}${placeLabel(place)}`
                  : s.country || "Worldwide"}{" "}
                · live directory
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open filters"
                  >
                    <SlidersHorizontal />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-xl">
                  <SheetHeader>
                    <SheetTitle>Filter creators</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 pb-6">{panel}</div>
                </SheetContent>
              </Sheet>
              <select
                className="field hidden w-auto sm:block"
                value={s.sort}
                onChange={(e) => setSearch({ sort: e.target.value })}
                aria-label="Sort creators"
              >
                <option value="relevance">Relevance</option>
                <option value="followers">Most followers</option>
                <option value="engagement">Highest engagement</option>
                <option value="newest">Recently joined</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <div className="flex rounded-md border border-border p-1">
                <Button
                  variant={s.view === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setSearch({ view: "list" })}
                  aria-label="List view"
                >
                  <Grid2X2 />
                </Button>
                <Button
                  variant={s.view === "map" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setSearch({ view: "map" })}
                  aria-label="Map view"
                >
                  <MapIcon />
                </Button>
                <Button
                  variant={s.view === "split" ? "secondary" : "ghost"}
                  size="icon"
                  className="hidden lg:inline-flex"
                  onClick={() => setSearch({ view: "split" })}
                  aria-label="Split view"
                >
                  <Columns2 />
                </Button>
                {s.view === "list" && (
                  <Button
                    variant={compact ? "secondary" : "ghost"}
                    size="icon"
                    className="hidden sm:inline-flex"
                    onClick={() => setCompact(!compact)}
                    aria-label="Compact list"
                  >
                    <List />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="pt-6">
            {s.view === "map" && (
              <div className="space-y-6">
                {map}
                {resultsContent}
              </div>
            )}
            {s.view === "split" && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <div>{resultsContent}</div>
                <div>{map}</div>
              </div>
            )}
            {s.view === "list" && resultsContent}
          </div>
          {!loading && hasMore && (
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? "Loading creators..." : "Load more creators"}
              </Button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
