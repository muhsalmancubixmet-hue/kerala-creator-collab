import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bookmark,
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Copy,
  Facebook,
  Film,
  Grid2X2,
  Heart,
  Instagram,
  Linkedin,
  List,
  MapPin,
  Menu,
  Search,
  Send,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Users,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  campaignBudget,
  campaignLocation,
  categories,
  countries,
  creators,
  languages,
  placeLabel,
  places,
  platforms,
  formatMoney,
  formatRange,
} from "@/data/marketplace";
import type { Campaign, Creator, Place, Category } from "@/types/marketplace";
import {
  getMarketplaceCategories,
  getMarketplaceCreators,
  getMarketplaceLocations,
} from "@/services/marketplace-api";
import { CampaignDetailDialog } from "@/components/campaign-dialog";

export const CREATOR_HUB_URL = (import.meta.env['VITE_CREATOR_HUB_URL'] as string | undefined) || "http://localhost:8080";
export const BUSINESS_HUB_URL = (import.meta.env['VITE_BUSINESS_HUB_URL'] as string | undefined) || "http://localhost:8083";
export const SITE_URL = (import.meta.env['VITE_SITE_URL'] as string | undefined) || "http://localhost:8082";

export const SAVED_STORAGE_KEY = "ic-saved-creators";
export const SAVED_EVENT = "ic-saved-creators-changed";

export function getSavedCreators(): Creator[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleSavedCreator(creator: Creator): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getSavedCreators();
    const exists = current.some((c) => c.slug === creator.slug);
    let updated: Creator[];
    if (exists) {
      updated = current.filter((c) => c.slug !== creator.slug);
    } else {
      updated = [creator, ...current];
    }
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(SAVED_EVENT));
    return !exists;
  } catch {
    return false;
  }
}

export const pageMeta = (title: string, description: string) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={cn(
        "font-display text-xl font-extrabold tracking-normal",
        light ? "text-primary-foreground" : "text-foreground",
      )}
      aria-label="Influencers.com home"
    >
      Influencers<span className="text-brand">.</span>com
    </Link>
  );
}

const nav = [
  { label: "Discover", to: "/discover" },
  { label: "Categories", to: "/categories" },
  { label: "Campaigns", to: "/campaigns" },
  { label: "For Businesses", to: "/for-businesses" },
  { label: "For Influencers", to: "/for-influencers" },
] as const;

export function SavedCreatorsDrawer() {
  const [open, setOpen] = useState(false);
  const [savedList, setSavedList] = useState<Creator[]>([]);

  useEffect(() => {
    const sync = () => setSavedList(getSavedCreators());
    sync();
    window.addEventListener(SAVED_EVENT, sync);
    return () => window.removeEventListener(SAVED_EVENT, sync);
  }, []);

  const handleRemove = (slug: string) => {
    if (typeof window === "undefined") return;
    const next = savedList.filter((c) => c.slug !== slug);
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
    setSavedList(next);
    window.dispatchEvent(new Event(SAVED_EVENT));
    toast.info("Removed from saved list");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative gap-1.5 font-bold" aria-label="Saved creators">
          <Bookmark className="size-4 text-brand" />
          <span className="hidden sm:inline">Saved</span>
          {savedList.length > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-brand text-[10px] font-bold text-primary-foreground">
              {savedList.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col justify-between">
        <div>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 font-display">
              <Bookmark className="size-5 fill-brand text-brand" />
              Saved Creators ({savedList.length})
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-3 overflow-y-auto max-h-[60vh] pr-1">
            {savedList.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Bookmark className="size-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm font-medium">Your saved list is empty.</p>
                <p className="text-xs mt-1">Bookmark creators on discover or profile pages to save them here.</p>
              </div>
            ) : (
              savedList.map((c) => (
                <div key={c.slug} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <CreatorPortrait creator={c} className="size-11 shrink-0 rounded-full" />
                    <div className="min-w-0">
                      <Link
                        to="/creator/$slug"
                        params={{ slug: c.slug }}
                        onClick={() => setOpen(false)}
                        className="font-bold text-sm block truncate hover:text-brand"
                      >
                        {c.name}
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.category} · {c.city || "Kerala"} · {c.followersLabel}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(c.slug)} className="text-xs text-muted-foreground hover:text-destructive">
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {savedList.length > 0 && (
          <div className="border-t border-border pt-4 mt-4 space-y-2">
            <Button className="w-full" asChild>
              <a href={`${BUSINESS_HUB_URL}/campaigns/new`}>
                Post Campaign for Saved Creators
              </a>
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Sign into Business Hub to dispatch campaign invitations to all saved creators.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="page-shell grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Brand />
        <nav className="hidden min-w-0 justify-center gap-1 lg:flex">
          {nav.map((x) => (
            <Link
              key={x.to}
              to={x.to}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              {x.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <SavedCreatorsDrawer />
          <Button variant="ghost" asChild>
            <a href={`${CREATOR_HUB_URL}/login`}>Log in</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`${CREATOR_HUB_URL}/signup`}>Join as Influencer</a>
          </Button>
          <Button asChild>
            <Link to="/for-businesses">For Business</Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <SavedCreatorsDrawer />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[90%] border-l-border">
              <SheetHeader>
                <SheetTitle>
                  <Brand />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-10 grid gap-2">
                {nav.map((x) => (
                  <Link
                    key={x.to}
                    to={x.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-border py-4 text-lg font-bold"
                  >
                    {x.label}
                    <ChevronRight className="size-5" />
                  </Link>
                ))}
              </nav>
              <div className="mt-8 grid gap-3">
                <Button asChild>
                  <Link to="/for-businesses">For Business</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`${CREATOR_HUB_URL}/signup`}>Join as Influencer</a>
                </Button>
                <Button variant="ghost" asChild>
                  <a href={`${CREATOR_HUB_URL}/login`}>Log in</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-ink text-primary-foreground">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Brand light />
          <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/65">
            The visual marketplace for discovering creators and building collaborations anywhere in
            the world.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Youtube, Facebook, Linkedin].map((I, i) => (
              <Button key={i} variant="footer" size="icon" aria-label="Social channel">
                <I />
              </Button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold">Explore</p>
          <div className="mt-4 grid gap-3 text-sm text-primary-foreground/65">
            {nav.slice(0, 3).map((x) => (
              <Link key={x.to} to={x.to} className="hover:text-primary-foreground">
                {x.label}
              </Link>
            ))}
            <a href={`${CREATOR_HUB_URL}/signup`} className="hover:text-primary-foreground">
              Creator Portal
            </a>
            <a href={`${BUSINESS_HUB_URL}/signup`} className="hover:text-primary-foreground">
              Business Portal
            </a>
          </div>
        </div>
        <div>
          <p className="font-bold">Made for every market</p>
          <p className="mt-4 text-sm leading-6 text-primary-foreground/65">
            Dubai · London · New York · Singapore · Kochi
            <br />
            and creators in any city, worldwide.
          </p>
          <p className="mt-4 text-xs text-primary-foreground/45">
            Connecting brands with verified local and global creator voices.
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-primary-foreground/45 sm:flex-row sm:justify-between">
          <span>© 2026 Influencers.com</span>
          <span>Privacy · Terms · Community guidelines</span>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export function CreatorPortrait({
  creator,
  className,
  priority = false,
}: {
  creator: Creator;
  className?: string;
  priority?: boolean;
}) {
  const photo =
    (creator as any).photo_url || (creator as any).avatar || (creator as any).profile_photo;
  if (photo) {
    return (
      <div
        role="img"
        aria-label={`${creator.name}, ${creator.category} creator in ${creator.city || "Kerala"}`}
        data-priority={priority || undefined}
        className={cn("overflow-hidden bg-muted bg-cover bg-center", className)}
        style={{ backgroundImage: `url(${photo})` }}
      />
    );
  }
  if (creator.sprite) {
    return (
      <div
        role="img"
        aria-label={`${creator.name}, ${creator.category} creator in ${creator.city || "Kerala"}`}
        data-priority={priority || undefined}
        className={cn("overflow-hidden bg-muted bg-no-repeat", className)}
        style={{
          backgroundImage: `url(${creator.sprite})`,
          backgroundSize: "400% auto",
          backgroundPosition: creator.position || "0% 0%",
        }}
      />
    );
  }
  const initials = creator.name
    ? creator.name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CR";
  return (
    <div
      role="img"
      aria-label={`${creator.name}, ${creator.category} creator in ${creator.city || "Kerala"}`}
      data-priority={priority || undefined}
      className={cn(
        "overflow-hidden bg-brand-soft/90 flex items-center justify-center font-display font-bold text-brand select-none",
        className,
      )}
    >
      <span className="text-xl tracking-wider">{initials}</span>
    </div>
  );
}

function PlatformIcon({ name }: { name: string }) {
  const Icon =
    name === "YouTube"
      ? Youtube
      : name === "Instagram"
        ? Instagram
        : name === "Facebook"
          ? Facebook
          : Film;
  return (
    <span
      title={name}
      className="grid size-7 place-items-center rounded-full bg-secondary text-muted-foreground"
    >
      <Icon className="size-3.5" />
    </span>
  );
}

export function CreatorCard({ creator, compact = false }: { creator: Creator; compact?: boolean }) {
  const [saved, setSaved] = useState(() => {
    return getSavedCreators().some((c) => c.slug === creator.slug);
  });

  useEffect(() => {
    const sync = () => setSaved(getSavedCreators().some((c) => c.slug === creator.slug));
    window.addEventListener(SAVED_EVENT, sync);
    return () => window.removeEventListener(SAVED_EVENT, sync);
  }, [creator.slug]);

  const handleToggleSave = () => {
    const isNowSaved = toggleSavedCreator(creator);
    setSaved(isNowSaved);
    toast.success(isNowSaved ? `Saved ${creator.name} to shortlist` : `Removed ${creator.name} from saved`);
  };

  if (compact)
    return (
      <article className="group grid grid-cols-[88px_minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-4">
        <CreatorPortrait creator={creator} className="aspect-square rounded-lg" />
        <div className="min-w-0">
          <Link
            to="/creator/$slug"
            params={{ slug: creator.slug }}
            className="flex items-center gap-1 font-display text-lg font-bold hover:text-brand"
          >
            {creator.name}
            {creator.verified && (
              <BadgeCheck className="size-4 fill-brand text-primary-foreground" />
            )}
          </Link>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {creator.category} · {creator.city || creator.location?.city || "Kerala"},{" "}
            {creator.location?.countryCode || creator.country || "IN"} · {creator.followersLabel}{" "}
            followers · {creator.engagement}% engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSave}
            aria-label={saved ? "Remove from saved" : "Save creator"}
          >
            <Bookmark className={cn("size-4", saved && "fill-brand text-brand")} />
          </Button>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/creator/$slug" params={{ slug: creator.slug }}>
              View profile
            </Link>
          </Button>
        </div>
      </article>
    );
  return (
    <article className="creator-card group">
      <div className="relative">
        <CreatorPortrait creator={creator} className="aspect-[4/4.5] rounded-t-lg" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/70 to-transparent" />
        <button
          aria-label={saved ? "Remove from saved" : "Save creator"}
          onClick={handleToggleSave}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition hover:scale-105"
        >
          <Bookmark className={cn("size-4", saved && "fill-brand text-brand")} />
        </button>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-primary-foreground">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-display text-xl font-bold">{creator.name}</h3>
              {creator.verified && (
                <BadgeCheck className="size-4 fill-brand text-primary-foreground" />
              )}
            </div>
            <p className="text-xs text-primary-foreground/80">
              {creator.category} · {creator.city || creator.location?.city || "Kerala"},{" "}
              {creator.location?.countryCode || creator.country || "IN"}
            </p>
          </div>
          <div className="flex">
            {creator.platforms.slice(0, 2).map((p) => (
              <PlatformIcon key={p} name={p} />
            ))}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 divide-x divide-border rounded-md bg-secondary/70 py-2 text-center">
          <div>
            <strong className="block text-sm">{creator.followersLabel}</strong>
            <span className="text-[11px] text-muted-foreground">Followers</span>
          </div>
          <div>
            <strong className="block text-sm">{creator.engagement}%</strong>
            <span className="text-[11px] text-muted-foreground">Engagement</span>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {creator.bio || "Content creator and digital storyteller."}
        </p>
        <Button asChild variant="outline" className="mt-4 w-full">
          <Link to="/creator/$slug" params={{ slug: creator.slug }}>
            View Profile <ChevronRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}
export function CreatorGrid({
  items = creators,
  compact = false,
}: {
  items?: Creator[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "grid" : "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"}>
      {items.map((c) => (
        <CreatorCard key={c.slug} creator={c} compact={compact} />
      ))}
    </div>
  );
}

const RECENT_KEY = "ic-recent-searches";
export function SearchBar({ large = false }: { large?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [liveSuggestions, setLiveSuggestions] = useState<Creator[]>([]);
  const [categoryList, setCategoryList] = useState<{ name: string; slug: string }[]>(categories);
  const navigate = useNavigate();
  const q = query.toLowerCase().trim();

  useEffect(() => {
    getMarketplaceCategories().then((cats) => {
      if (cats && cats.length > 0) setCategoryList(cats);
    });
  }, []);

  useEffect(() => {
    if (!q) {
      setLiveSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      getMarketplaceCreators({ q }).then((res) => {
        if (res) setLiveSuggestions(res.slice(0, 5));
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [q]);

  const suggestions = useMemo(() => {
    if (q && liveSuggestions.length > 0) return liveSuggestions;
    if (q)
      return creators
        .filter((c) => (c.name + c.category + c.city + c.country).toLowerCase().includes(q))
        .slice(0, 4);
    return creators.slice(0, 3);
  }, [q, liveSuggestions]);
  const catMatches = useMemo(
    () =>
      q
        ? categoryList.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4)
        : categoryList.slice(0, 5),
    [q, categoryList],
  );
  const placeMatches = useMemo(
    () =>
      q
        ? places.filter((p) => placeLabel(p).toLowerCase().includes(q)).slice(0, 4)
        : places.filter((p) => ["dubai", "london", "new-york", "kochi"].includes(p.id)),
    [q],
  );
  const go = (search: Partial<DiscoverSearch>) =>
    navigate({ to: "/discover", search: { ...emptyDiscover, ...search } });
  const submit = () => {
    if (query.trim()) {
      const next = [query.trim(), ...recent.filter((r) => r !== query.trim())].slice(0, 4);
      setRecent(next);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
    go({ q: query, category, location });
  };
  return (
    <div className="relative">
      <div className={cn("search-shell", large && "shadow-search")}>
        <label className="search-field">
          <Search />
          <span>
            <small>Search creators</small>
            <input
              value={query}
              onFocus={() => {
                setFocused(true);
                try {
                  setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
                } catch {
                  /* ignore */
                }
              }}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Name, niche or city"
            />
          </span>
        </label>
        <label className="search-field hidden sm:flex">
          <Sparkles />
          <span>
            <small>Category</small>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categoryList.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </span>
        </label>
        <label className="search-field hidden md:flex">
          <MapPin />
          <span>
            <small>Location</small>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">Anywhere</option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.city}, {p.countryCode}
                </option>
              ))}
            </select>
          </span>
        </label>
        <Button size={large ? "lg" : "default"} onClick={submit}>
          <Search />
          <span className="hidden sm:inline">Discover</span>
        </Button>
      </div>
      {focused && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-[1100] grid gap-1 rounded-lg border border-border bg-background p-2 text-foreground shadow-elevated sm:grid-cols-2">
          <div>
            <p className="px-3 py-2 text-xs font-bold uppercase text-muted-foreground">
              {query ? "Creators" : "Popular creators"}
            </p>
            {(query ? suggestions : creators.slice(0, 3)).map((c) => (
              <Link
                key={c.slug}
                to="/creator/$slug"
                params={{ slug: c.slug }}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary"
              >
                <CreatorPortrait creator={c} className="size-10 shrink-0 rounded-full" />
                <span className="min-w-0">
                  <strong className="block truncate text-sm">{c.name}</strong>
                  <small className="text-muted-foreground">
                    {c.category} · {c.city || c.location?.city || "Kerala"},{" "}
                    {c.location?.countryCode || c.country || "IN"}
                  </small>
                </span>
              </Link>
            ))}
            {query && !suggestions.length && (
              <p className="px-3 py-2 text-sm text-muted-foreground">No creators match yet</p>
            )}
          </div>
          <div>
            <p className="px-3 py-2 text-xs font-bold uppercase text-muted-foreground">Locations</p>
            {placeMatches.map((p) => (
              <button
                key={p.id}
                onMouseDown={() => go({ location: p.id })}
                className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-secondary"
              >
                <MapPin className="size-4 text-brand" />
                <span className="truncate">{placeLabel(p)}</span>
              </button>
            ))}
            <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase text-muted-foreground">
              Categories
            </p>
            <div className="flex flex-wrap gap-2 px-2">
              {catMatches.map((c) => (
                <button
                  key={c.name}
                  onMouseDown={() => go({ category: c.name })}
                  className="rounded-full bg-secondary px-3 py-1 text-xs hover:bg-brand-soft hover:text-brand"
                >
                  {c.name}
                </button>
              ))}
            </div>
            {!query && recent.length > 0 && (
              <>
                <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase text-muted-foreground">
                  Recent searches
                </p>
                <div className="flex flex-wrap gap-2 px-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onMouseDown={() => go({ q: r })}
                      className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs"
                    >
                      <Clock3 className="size-3" />
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Global location search — countries, regions, districts, cities and areas with live backend taxonomy autocomplete. */
export function LocationSearch({
  value,
  onChange,
  placeholder = "Search any city or country",
}: {
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
}) {
  const [placeList, setPlaceList] = useState<Place[]>(places);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const selected =
    placeList.find((p) => p.id === value || p.city.toLowerCase() === value.toLowerCase()) ||
    places.find((p) => p.id === value);

  useEffect(() => {
    if (!text.trim()) {
      getMarketplaceLocations().then((res) => {
        if (res && res.length > 0) setPlaceList(res);
      });
      return;
    }
    const timer = setTimeout(() => {
      getMarketplaceLocations(text.trim()).then((res) => {
        if (res && res.length > 0) setPlaceList(res);
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [text]);

  const matches = placeList
    .filter(
      (p) =>
        placeLabel(p).toLowerCase().includes(text.toLowerCase()) ||
        (p.district ?? "").toLowerCase().includes(text.toLowerCase()),
    )
    .slice(0, 8);
  return (
    <div className="relative">
      <div className="field flex items-center gap-2">
        <MapPin className="size-4 shrink-0 text-brand" />
        <input
          className="w-full min-w-0 bg-transparent outline-none"
          value={open ? text : selected ? placeLabel(selected) : text}
          onFocus={() => {
            setOpen(true);
            setText("");
          }}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          aria-label="Search location"
        />
        {selected && (
          <button
            onClick={() => onChange("")}
            className="text-xs font-bold text-muted-foreground hover:text-brand"
            aria-label="Clear location"
          >
            ✕
          </button>
        )}
      </div>
      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+4px)] z-[1100] max-h-64 overflow-y-auto rounded-lg border border-border bg-background p-1 shadow-elevated">
          {matches.map((p) => (
            <button
              key={p.id}
              onMouseDown={() => {
                onChange(p.id);
                setOpen(false);
              }}
              className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
            >
              <strong className="block">{p.city}</strong>
              <small className="text-muted-foreground">
                {[p.district, p.region, p.country]
                  .filter((x, i, a) => x && a.indexOf(x) === i && x !== p.city)
                  .join(" · ")}
              </small>
            </button>
          ))}
          {!matches.length && (
            <p className="px-3 py-2 text-sm text-muted-foreground">No matching locations found</p>
          )}
        </div>
      )}
    </div>
  );
}

export type DiscoverSearch = {
  q: string;
  category: string;
  location: string;
  country: string;
  platform: string;
  radius: number;
  sort: string;
  view: "list" | "map" | "split";
};
export const emptyDiscover: DiscoverSearch = {
  q: "",
  category: "",
  location: "",
  country: "",
  platform: "",
  radius: 0,
  sort: "relevance",
  view: "list",
};

export function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-extrabold tracking-normal sm:text-4xl">
          {title}
        </h2>
        {copy && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {copy}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <article className="rounded-lg border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-elevated flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
              <BriefcaseBusiness />
            </div>
            <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
              Open
            </span>
          </div>
          <p className="mt-5 text-xs font-bold uppercase text-brand">
            {campaign.business} · {campaign.category}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold">{campaign.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {campaign.description}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <span className="flex items-center gap-2">
              <MapPin />
              {campaignLocation(campaign)}
            </span>
            <span className="flex items-center gap-2">
              <CircleDollarSign />
              {campaignBudget(campaign)}
            </span>
            <span className="flex items-center gap-2">
              <Film />
              {campaign.deliverables}
            </span>
            <span className="flex items-center gap-2">
              <Clock3 />
              {campaign.deadline}
            </span>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="size-4" />
            {campaign.creators} creators needed
          </span>
          <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
            View Campaign
          </Button>
        </div>
      </article>

      <CampaignDetailDialog
        campaign={campaign}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}

export type Filters = {
  languages: string[];
  platforms: string[];
  minFollowers: number;
  minEngagement: number;
  maxPriceUSD: number;
  available: boolean;
  verified: boolean;
  remote: boolean;
};
export const emptyFilters: Filters = {
  languages: [],
  platforms: [],
  minFollowers: 0,
  minEngagement: 0,
  maxPriceUSD: 0,
  available: false,
  verified: false,
  remote: false,
};
const toggle = (list: string[], v: string) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
export function FilterPanel({
  search,
  setSearch,
  filters,
  setFilters,
}: {
  search: DiscoverSearch;
  setSearch: (p: Partial<DiscoverSearch>) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const place: Place | undefined = places.find((p) => p.id === search.location);
  const [categoryList, setCategoryList] = useState<{ name: string; slug: string }[]>(categories);
  useEffect(() => {
    getMarketplaceCategories().then((cats) => {
      if (cats && cats.length > 0) setCategoryList(cats);
    });
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <label className="filter-label">Location</label>
        <LocationSearch
          value={search.location}
          onChange={(id) => setSearch({ location: id, radius: id ? search.radius : 0 })}
        />
      </div>
      <div>
        <label className="filter-label">
          Radius {search.radius ? `· ${search.radius} km` : "· exact city"}
        </label>
        <input
          type="range"
          min={0}
          max={500}
          step={25}
          value={search.radius}
          disabled={!place}
          onChange={(e) => setSearch({ radius: +e.target.value })}
          className="w-full accent-brand disabled:opacity-40"
          aria-label="Radius in kilometres"
        />
        {!place && (
          <p className="text-xs text-muted-foreground">Pick a location to search by radius</p>
        )}
      </div>
      <div>
        <label className="filter-label">Country</label>
        <select
          className="field"
          value={search.country}
          onChange={(e) => setSearch({ country: e.target.value })}
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="filter-label">Category</label>
        <select
          className="field"
          value={search.category}
          onChange={(e) => setSearch({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {categoryList.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="filter-label">Social platform</label>
        <div className="flex flex-wrap gap-2">
          {platforms.map((x) => (
            <button
              key={x}
              data-active={filters.platforms.includes(x)}
              onClick={() => setFilters({ ...filters, platforms: toggle(filters.platforms, x) })}
              className="filter-chip"
            >
              {x}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="filter-label">Language</label>
        <div className="flex flex-wrap gap-2">
          {languages.map((x) => (
            <button
              key={x}
              data-active={filters.languages.includes(x)}
              onClick={() => setFilters({ ...filters, languages: toggle(filters.languages, x) })}
              className="filter-chip"
            >
              {x}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="filter-label">
          Min followers · {filters.minFollowers ? `${filters.minFollowers}K+` : "Any"}
        </label>
        <input
          type="range"
          className="w-full accent-brand"
          min={0}
          max={800}
          step={50}
          value={filters.minFollowers}
          onChange={(e) => setFilters({ ...filters, minFollowers: +e.target.value })}
          aria-label="Minimum followers"
        />
      </div>
      <div>
        <label className="filter-label">
          Min engagement · {filters.minEngagement ? `${filters.minEngagement}%+` : "Any"}
        </label>
        <input
          type="range"
          className="w-full accent-brand"
          min={0}
          max={10}
          step={1}
          value={filters.minEngagement}
          onChange={(e) => setFilters({ ...filters, minEngagement: +e.target.value })}
          aria-label="Minimum engagement"
        />
      </div>
      <div>
        <label className="filter-label">Starting price</label>
        <select
          className="field"
          value={filters.maxPriceUSD}
          onChange={(e) => setFilters({ ...filters, maxPriceUSD: +e.target.value })}
        >
          <option value={0}>Any budget</option>
          <option value={100}>Up to ~$100</option>
          <option value={500}>Up to ~$500</option>
          <option value={1500}>Up to ~$1,500</option>
        </select>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Compared across currencies using demo rates
        </p>
      </div>
      <div className="space-y-3 border-t border-border pt-5 text-sm font-semibold">
        {(
          [
            ["available", "Available now"],
            ["remote", "Remote collaborations"],
            ["verified", "Verified creators"],
          ] as const
        ).map(([k, l]) => (
          <label key={k} className="flex items-center justify-between">
            {l}
            <input
              type="checkbox"
              checked={filters[k]}
              onChange={(e) => setFilters({ ...filters, [k]: e.target.checked })}
              className="size-4 accent-brand"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-border bg-secondary/40 p-8 text-center">
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-background text-muted-foreground">
          <Search />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold">No creators found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try widening your filters, increasing the radius or searching another location.
        </p>
      </div>
    </div>
  );
}
export function LoadingSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((x) => (
        <div key={x} className="overflow-hidden rounded-lg border border-border">
          <div className="aspect-[4/4.5] animate-pulse bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { Grid2X2, List, SlidersHorizontal, Share2, Copy, Send, Heart };
export { Map as MapIcon, Columns2 } from "lucide-react";
