import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Camera,
  Dumbbell,
  Gamepad2,
  GraduationCap,
  Heart,
  Laptop,
  Laugh,
  MapPin,
  Plane,
  Shirt,
  Sparkles,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout, SectionHeading, pageMeta, emptyDiscover } from "@/components/marketplace";
import { categories as fallbackCategories } from "@/data/marketplace";
import type { Category } from "@/types/marketplace";
import { getMarketplaceCategories } from "@/services/marketplace-api";

const icons = [
  Utensils,
  Plane,
  Shirt,
  Sparkles,
  Heart,
  Dumbbell,
  Laptop,
  Gamepad2,
  GraduationCap,
  Camera,
  Laugh,
  Sparkles,
  Heart,
  Laptop,
  MapPin,
];

export const Route = createFileRoute("/categories")({
  head: () =>
    pageMeta(
      "Browse Creator Categories — Influencers.com",
      "Explore influencers across food, travel, fashion, beauty, technology, comedy and more.",
    ),
  component: Categories,
});

function Categories() {
  const [catList, setCatList] = useState<Category[]>(fallbackCategories);

  useEffect(() => {
    let active = true;
    getMarketplaceCategories().then((cats) => {
      if (active && cats && cats.length > 0) {
        setCatList(cats);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Layout>
      <section className="page-shell py-14">
        <div className="max-w-3xl">
          <p className="eyebrow">Explore every niche</p>
          <h1 className="font-display text-5xl font-extrabold sm:text-6xl">
            Find the voice your story needs.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Browse our creator community by craft, audience and cultural point of view.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catList.map((c, i) => {
            const Icon = icons[i % icons.length] ?? Sparkles;
            const countDisplay = typeof c.creator_count === "number" ? c.creator_count : 10;
            return (
              <Link
                key={c.name}
                to="/discover"
                search={{ ...emptyDiscover, category: c.name }}
                className={`group relative min-h-52 overflow-hidden rounded-lg border border-border p-6 transition hover:-translate-y-1 hover:shadow-elevated ${
                  i === 0 || i === 4 || i === 10 ? "bg-ink text-primary-foreground" : "bg-card"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`grid size-12 place-items-center rounded-lg ${
                      i === 0 || i === 4 || i === 10
                        ? "bg-primary-foreground/10"
                        : "bg-brand-soft text-brand"
                    }`}
                  >
                    <Icon />
                  </span>
                  <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div className="absolute inset-x-6 bottom-6">
                  <h2 className="font-display text-2xl font-bold">{c.name}</h2>
                  <p
                    className={`mt-1 text-sm ${
                      i === 0 || i === 4 || i === 10
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {countDisplay} {countDisplay === 1 ? "creator" : "creators"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="bg-secondary/60 py-20">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Not sure where to start?"
            title="Tell us what you're making."
            copy="Search by your campaign idea and discover creators with the right audience, format and location."
          />
          <Button asChild>
            <Link to="/discover" search={emptyDiscover}>
              Explore all creators
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
