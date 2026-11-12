import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bookmark,
  ChevronRight,
  Copy,
  Download,
  Film,
  Heart,
  Instagram,
  MapPin,
  Play,
  Send,
  Share2,
  Star,
  Users,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  CreatorCard,
  CreatorPortrait,
  Layout,
  SectionHeading,
  pageMeta,
  emptyDiscover,
  toggleSavedCreator,
  getSavedCreators,
  SAVED_EVENT,
} from "@/components/marketplace";
import { formatMoney, placeLabel } from "@/data/marketplace";
import type { Creator } from "@/types/marketplace";
import {
  getMarketplaceCreatorBySlug,
  getMarketplaceCreators,
  requestCreatorMediaKit,
} from "@/services/marketplace-api";
import { CollaborationDialog } from "@/components/collaboration-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/creator/$slug")({
  loader: async ({ params }) => {
    const creator = await getMarketplaceCreatorBySlug(params.slug);
    if (!creator) throw notFound();
    return creator;
  },
  head: ({ loaderData }) =>
    pageMeta(
      loaderData
        ? `${loaderData.name} — ${loaderData.category} Creator in ${loaderData.city}`
        : "Creator not found — Influencers.com",
      loaderData?.bio || "Explore creator profiles on Influencers.com.",
    ),
  component: Profile,
  notFoundComponent: () => (
    <Layout>
      <div className="page-shell grid min-h-[60vh] place-items-center text-center">
        <div>
          <h1 className="font-display text-4xl font-bold">Creator not found</h1>
          <Button className="mt-6" asChild>
            <Link to="/discover" search={emptyDiscover}>
              Discover creators
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  ),
});

function Profile() {
  const c = Route.useLoaderData();
  const [collabOpen, setCollabOpen] = useState(false);
  const [mediaKitOpen, setMediaKitOpen] = useState(false);
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requestingKit, setRequestingKit] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [selectedPrice, setSelectedPrice] = useState<number | null | undefined>();
  const [similar, setSimilar] = useState<Creator[]>([]);
  const [saved, setSaved] = useState(() => getSavedCreators().some((x) => x.slug === c.slug));

  useEffect(() => {
    const sync = () => setSaved(getSavedCreators().some((x) => x.slug === c.slug));
    window.addEventListener(SAVED_EVENT, sync);
    return () => window.removeEventListener(SAVED_EVENT, sync);
  }, [c.slug]);

  const handleToggleSave = () => {
    const isNowSaved = toggleSavedCreator(c);
    setSaved(isNowSaved);
    toast.success(isNowSaved ? `Saved ${c.name} to shortlist` : `Removed ${c.name} from saved`);
  };

  const handleMediaKitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName.trim() || !requesterEmail.trim()) {
      toast.error("Please enter your name and email address.");
      return;
    }
    setRequestingKit(true);
    try {
      const res = await requestCreatorMediaKit(c.slug, {
        requester_name: requesterName.trim(),
        requester_email: requesterEmail.trim(),
      });
      toast.success(res?.detail || `Media kit link dispatched to ${requesterEmail}!`);
      setMediaKitOpen(false);
      setRequesterName("");
      setRequesterEmail("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to dispatch media kit request.");
    } finally {
      setRequestingKit(false);
    }
  };

  useEffect(() => {
    let active = true;
    getMarketplaceCreators({ category: c.category }).then((res) => {
      if (active && res) {
        setSimilar(res.filter((x) => x.slug !== c.slug).slice(0, 3));
      }
    });
    return () => {
      active = false;
    };
  }, [c.category, c.slug]);

  const copy = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Profile link copied");
  };

  const handleOpenCollab = (serviceName?: string, price?: number | null) => {
    setSelectedService(serviceName);
    setSelectedPrice(price);
    setCollabOpen(true);
  };

  return (
    <Layout>
      <section className="border-b border-border">
        <div className="page-shell py-8">
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/discover" search={emptyDiscover}>
              Discover
            </Link>
            <ChevronRight className="size-3" />
            <span>{c.category}</span>
            <ChevronRight className="size-3" />
            <span>{c.name}</span>
          </div>
          <div className="grid gap-8 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[310px_minmax(0,1fr)]">
            <CreatorPortrait
              creator={c}
              priority
              className="aspect-[4/4.5] rounded-xl shadow-elevated"
            />
            <div className="flex min-w-0 flex-col justify-center">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="truncate font-display text-4xl font-extrabold sm:text-5xl">
                      {c.name}
                    </h1>
                    {c.verified && (
                      <BadgeCheck className="size-6 shrink-0 fill-brand text-primary-foreground" />
                    )}
                  </div>
                  <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {c.category} creator · {placeLabel(c.location)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copy}
                    aria-label="Copy profile link"
                  >
                    <Copy />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toast.success("Profile ready to share")}
                    aria-label="Share profile"
                  >
                    <Share2 />
                  </Button>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">{c.bio}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {c.platforms && c.platforms.length > 0 ? (
                  c.platforms.map((p) => (
                    <span
                      key={p}
                      className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold"
                    >
                      {p === "YouTube" ? (
                        <Youtube className="size-4 text-brand" />
                      ) : (
                        <Instagram className="size-4 text-brand" />
                      )}
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-secondary px-3 py-2 text-xs text-muted-foreground font-medium">
                    No linked social platforms
                  </span>
                )}
                {c.languages && c.languages.length > 0
                  ? c.languages.map((l) => (
                      <span
                        key={l}
                        className="rounded-full bg-secondary px-3 py-2 text-xs font-bold"
                      >
                        {l}
                      </span>
                    ))
                  : null}
              </div>

              <div className="mt-7 grid grid-cols-2 divide-x divide-border border-y border-border py-4 text-center sm:grid-cols-3">
                <div>
                  <strong className="font-display text-2xl">{c.followersLabel || "0"}</strong>
                  <span className="block text-xs text-muted-foreground">Followers</span>
                </div>
                <div>
                  <strong className="font-display text-2xl">
                    {c.engagement ? `${c.engagement}%` : "0.0%"}
                  </strong>
                  <span className="block text-xs text-muted-foreground">Engagement</span>
                </div>
                <div className="col-span-2 mt-3 sm:col-span-1 sm:mt-0">
                  <strong className="font-display text-2xl">
                    {(c as any).topAudience || "Kerala"}
                  </strong>
                  <span className="block text-xs text-muted-foreground">Primary Audience</span>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-secondary/70 p-4 text-sm">
                <strong>
                  Based in{" "}
                  {[c.city || c.location?.city, c.country || c.location?.country]
                    .filter(Boolean)
                    .join(", ") || "Kerala, India"}
                </strong>
                <p className="mt-1 text-muted-foreground">
                  Available for:{" "}
                  {c.serviceLocations && c.serviceLocations.length > 0
                    ? c.serviceLocations.join(" · ")
                    : "Remote collaborations"}
                  {c.travels ? " · Open to travel" : ""}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => handleOpenCollab()}>
                  <Send /> Request Collaboration
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleOpenCollab("Direct Message / Inquiry")}
                >
                  Contact
                </Button>
                <Button size="lg" variant={saved ? "secondary" : "ghost"} onClick={handleToggleSave}>
                  <Bookmark className={saved ? "fill-brand text-brand" : ""} /> {saved ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <SectionHeading
          eyebrow="Selected work"
          title="Portfolio"
          copy="Recent campaign work, original stories and short-form content."
        />
        {c.portfolio && c.portfolio.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {c.portfolio.map((item, i) => (
              <div
                key={item.id || i}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                {item.media_url ? (
                  <img
                    src={item.media_url}
                    alt={item.title || "Portfolio work"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary p-4 text-center text-xs text-muted-foreground font-medium">
                    {item.title || "Showcase Item"}
                  </div>
                )}
                {item.media_type === "VIDEO" && (
                  <span className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-ink/70 text-primary-foreground">
                    <Play className="size-3 fill-current" />
                  </span>
                )}
                {(item.title || item.brand_name) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent p-3 text-primary-foreground">
                    {item.brand_name && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
                        {item.brand_name}
                      </p>
                    )}
                    <h4 className="truncate text-sm font-bold">{item.title}</h4>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            <Film className="mx-auto size-10 text-muted-foreground/40 mb-3" />
            <h4 className="font-display text-lg font-bold">No portfolio pieces yet</h4>
            <p className="mt-1 text-sm">
              This creator hasn't published showcase media to their portfolio.
            </p>
          </div>
        )}
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="page-shell">
          <SectionHeading eyebrow="Work together" title="Services" />
          {c.services && c.services.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {c.services.map((s) => (
                <article key={s.name} className="rounded-lg border border-border bg-background p-6">
                  <Film className="text-brand" />
                  <h3 className="mt-7 font-display text-xl font-bold">{s.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                    {s.description || "Custom deliverable package."}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <strong className="text-sm">
                      {s.price == null
                        ? "Contact for price"
                        : `From ${formatMoney(s.price, c.currency)}`}
                    </strong>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenCollab(s.name, s.price)}
                    >
                      Enquire
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-background p-8 text-center text-muted-foreground">
              <p className="text-sm">
                No standard packages listed yet. Contact {c.name} directly to request custom
                pricing.
              </p>
              <Button
                className="mt-4"
                variant="outline"
                size="sm"
                onClick={() => handleOpenCollab("Custom Inquiry")}
              >
                Inquire Directly
              </Button>
            </div>
          )}
        </div>
      </section>

      {((c.collaborations && c.collaborations.length > 0) ||
        (c.testimonials && c.testimonials.length > 0)) && (
        <section className="page-shell grid gap-12 py-16 lg:grid-cols-2">
          {c.collaborations && c.collaborations.length > 0 && (
            <div>
              <p className="eyebrow">Previous collaborations</p>
              <h2 className="font-display text-3xl font-extrabold">Brands in the story</h2>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {c.collaborations.map((x) => (
                  <div
                    key={x}
                    className="grid min-h-24 place-items-center rounded-lg border border-border bg-card p-3 text-center font-display font-bold"
                  >
                    {x}
                  </div>
                ))}
              </div>
            </div>
          )}
          {c.testimonials && c.testimonials.length > 0 && (
            <div>
              <p className="eyebrow">Client notes</p>
              <h2 className="font-display text-3xl font-extrabold">Good work, remembered</h2>
              <div className="mt-6 grid gap-3">
                {c.testimonials.map((t) => (
                  <blockquote key={t.person} className="rounded-lg bg-brand-soft p-5">
                    <div className="flex gap-1 text-brand">
                      {[1, 2, 3, 4, 5].map((x) => (
                        <Star key={x} className="size-3 fill-current" />
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-6">“{t.quote}”</p>
                    <footer className="mt-3 text-xs text-muted-foreground">
                      <strong className="text-foreground">{t.person}</strong> · {t.role}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="page-shell">
        <div className="flex flex-col items-start justify-between gap-5 rounded-xl bg-ink p-8 text-primary-foreground sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-3xl font-extrabold">Want the full numbers?</h2>
            <p className="mt-2 text-sm text-primary-foreground/60">
              Download {c.name}'s media kit for audience and campaign details.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setMediaKitOpen(true)}>
            <Download /> Request Media Kit
          </Button>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="page-shell py-20">
          <SectionHeading eyebrow="Keep exploring" title="Similar creators" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((x) => (
              <CreatorCard key={x.slug} creator={x} />
            ))}
          </div>
        </section>
      )}

      {/* Media Kit Request Modal */}
      <Dialog open={mediaKitOpen} onOpenChange={setMediaKitOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              Request {c.name}'s Media Kit
            </DialogTitle>
            <DialogDescription>
              We'll send the latest verified analytics, past campaign metrics, and rate cards to your email.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleMediaKitSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Your Name *</label>
              <input
                required
                className="field"
                placeholder="Marketing Manager"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Work Email *</label>
              <input
                required
                type="email"
                className="field"
                placeholder="name@brand.com"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-3">
              <Button type="button" variant="ghost" onClick={() => setMediaKitOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={requestingKit}>
                {requestingKit ? "Sending..." : "Send Download Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Live Collaboration Inquiry Dialog connecting to Django Backend */}
      <CollaborationDialog
        creator={c}
        open={collabOpen}
        onOpenChange={setCollabOpen}
        defaultService={selectedService}
        defaultPrice={selectedPrice}
      />
    </Layout>
  );
}
