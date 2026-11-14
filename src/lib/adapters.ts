import type { Creator, Campaign, Place, Service, PortfolioItem } from "../types/marketplace";
import { formatFollowers, cleanHandle } from "./formatters.ts";

export interface RawBackendCreator {
  id?: string;
  slug?: string;
  name?: string;
  handle?: string;
  display_name?: string;
  category?: string;
  location?: {
    id?: string;
    city?: string;
    district?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    lat?: number;
    lng?: number;
  };
  city?: string;
  district?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  serviceLocations?: string[];
  remote?: boolean;
  travels?: boolean;
  languages?: string[];
  platforms?: string[];
  followers?: number;
  followersLabel?: string;
  engagement?: number;
  bio?: string;
  verified?: boolean;
  available?: boolean;
  currency?: string;
  startingPrice?: number | null;
  photo_url?: string;
  sprite?: string;
  position?: string;
  accent?: string;
  joined?: string;
  services?: Service[];
  portfolio?: PortfolioItem[];
}

export interface RawBackendCampaign {
  id?: string;
  title?: string;
  brand_name?: string;
  business?: string;
  category?: string;
  location?: Place | null;
  remote?: boolean;
  platform?: string;
  currency?: string;
  budget?: number;
  total_budget_cents?: number;
  budget_cents?: number;
  deliverables?: string;
  deliverables_spec?: string;
  deadline?: string;
  creators?: number;
  creators_needed?: number;
  description?: string;
  objective?: string;
  status?: string;
  created_at?: string;
}

export interface RawBackendLocation {
  id?: string;
  name?: string;
  type?: string;
  country_code?: string;
  latitude?: number | null;
  longitude?: number | null;
  parent?: {
    id?: string;
    name?: string;
  } | null;
}

/**
 * Adapt raw backend creator payload to frontend Creator contract with safe null defaults.
 */
export function adaptBackendCreator(raw: RawBackendCreator): Creator {
  const handle = cleanHandle(raw.handle || raw.slug || "");
  const name = raw.name || raw.display_name || handle || "Creator";
  const followers = typeof raw.followers === "number" ? raw.followers : 0;
  const engagement = typeof raw.engagement === "number" ? raw.engagement : 0.0;
  const loc = raw.location || {};

  return {
    id: raw.id || handle,
    slug: handle,
    name,
    handle: `@${handle}`,
    category: raw.category || "Creator",
    location: {
      id: loc.id || "kerala",
      city: loc.city || raw.city || "Kerala",
      district: loc.district || raw.district || "Kerala",
      region: loc.region || raw.region || "Kerala",
      country: loc.country || raw.country || "India",
      countryCode: loc.countryCode || raw.countryCode || "IN",
      lat: typeof loc.lat === "number" ? loc.lat : 10.8505,
      lng: typeof loc.lng === "number" ? loc.lng : 76.2711,
    },
    city: raw.city || loc.city || "Kerala",
    district: raw.district || loc.district || "Kerala",
    country: raw.country || loc.country || "India",
    serviceLocations: Array.isArray(raw.serviceLocations) ? raw.serviceLocations : ["Kerala"],
    remote: Boolean(raw.remote ?? true),
    travels: Boolean(raw.travels ?? false),
    languages: Array.isArray(raw.languages) ? raw.languages : ["Malayalam", "English"],
    platforms: Array.isArray(raw.platforms) ? raw.platforms : [],
    followers,
    followersLabel: raw.followersLabel || formatFollowers(followers),
    engagement,
    bio: raw.bio || "",
    verified: Boolean(raw.verified ?? false),
    available: Boolean(raw.available ?? true),
    currency: raw.currency || "INR",
    startingPrice: typeof raw.startingPrice === "number" ? raw.startingPrice : null,
    photo_url: raw.photo_url || "",
    sprite: raw.sprite || raw.photo_url || "",
    position: raw.position || "50% 50%",
    accent: raw.accent || "brand",
    joined: raw.joined || "2026-01-01",
    services: Array.isArray(raw.services) ? raw.services : [],
    portfolio: Array.isArray(raw.portfolio) ? raw.portfolio : [],
  };
}

/**
 * Adapt raw backend campaign payload to frontend Campaign contract with safe defaults.
 */
export function adaptBackendCampaign(raw: RawBackendCampaign): Campaign {
  const totalCents =
    typeof raw.total_budget_cents === "number" ? raw.total_budget_cents : raw.budget_cents;
  const budget =
    typeof raw.budget === "number" ? raw.budget : totalCents ? Math.round(totalCents / 100) : 0;

  return {
    id: raw.id || "",
    title: raw.title || "Campaign",
    business: raw.brand_name || raw.business || "Brand",
    category: raw.category || "General",
    location: raw.location || null,
    remote: Boolean(raw.remote ?? true),
    platform: raw.platform || "Instagram",
    currency: raw.currency || "INR",
    budgetMin: budget,
    budgetMax: budget,
    deliverables: raw.deliverables || raw.deliverables_spec || "Content Creation",
    deadline: raw.deadline || "Open",
    creators:
      typeof raw.creators_needed === "number"
        ? raw.creators_needed
        : typeof raw.creators === "number"
          ? raw.creators
          : 1,
    description: raw.description || raw.objective || "",
    status: raw.status || "ACTIVE",
  };
}

/**
 * Adapt backend taxonomy location to frontend Place format.
 */
export function adaptBackendLocation(raw: RawBackendLocation): Place {
  const name = raw.name || "";
  const countryCode = raw.country_code || "IN";
  const parent = raw.parent;

  return {
    id: raw.id || name.toLowerCase(),
    city: name,
    district: parent?.name || name,
    region: "Kerala",
    country: countryCode === "IN" ? "India" : "International",
    countryCode: countryCode,
    lat: typeof raw.latitude === "number" ? raw.latitude : 10.8505,
    lng: typeof raw.longitude === "number" ? raw.longitude : 76.2711,
  };
}
