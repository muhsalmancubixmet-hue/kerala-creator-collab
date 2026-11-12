import { apiRequest } from "@/lib/api-client";
import {
  creators as mockCreators,
  campaigns as mockCampaigns,
  categories as mockCategories,
  places as mockPlaces,
} from "@/data/marketplace";
import type {
  Creator,
  Campaign,
  Category,
  Place,
  PublicCreatorsResponse,
  PublicCampaignsResponse,
  CollaborationInquiryPayload,
  MediaKitRequestPayload,
  CreatorFilterParams,
} from "@/types/marketplace";

export type {
  Creator,
  Campaign,
  Category,
  Place,
  PublicCreatorsResponse,
  PublicCampaignsResponse,
  CollaborationInquiryPayload,
  MediaKitRequestPayload,
  CreatorFilterParams,
};

export interface BackendLocationNode {
  id: string;
  name: string;
  type: string;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
  parent_name?: string;
  parent?: {
    id: string;
    name: string;
  } | string | null;
}

/**
 * Fetch full paginated list of creators from Django backend with search and query filters.
 */
export async function getMarketplacePaginatedCreators(
  params?: CreatorFilterParams,
): Promise<PublicCreatorsResponse> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== false) {
        query.set(key, String(val));
      }
    });
  }

  const qs = query.toString();
  const endpoint = `/public/creators/${qs ? `?${qs}` : ""}`;

  try {
    const data = await apiRequest<PublicCreatorsResponse>(endpoint, { timeoutMs: 5000 });
    if (data && Array.isArray(data.results)) {
      return data;
    }
  } catch (err) {
    console.warn("Backend /public/creators/ request failed, utilizing resilient fallback:", err);
  }

  // Graceful fallback if backend is unreachable
  let filtered = [...mockCreators];
  if (params?.q) {
    const q = String(params.q).toLowerCase();
    filtered = filtered.filter((c) =>
      (c.name + c.handle + c.bio + c.city).toLowerCase().includes(q),
    );
  }
  if (params?.category) {
    filtered = filtered.filter(
      (c) => c.category.toLowerCase() === String(params.category).toLowerCase(),
    );
  }
  if (params?.location) {
    filtered = filtered.filter(
      (c) =>
        c.location?.id === params.location ||
        c.city.toLowerCase() === String(params.location).toLowerCase(),
    );
  }
  if (params?.verified) {
    filtered = filtered.filter((c) => c.verified);
  }
  if (params?.remote) {
    filtered = filtered.filter((c) => c.remote);
  }

  return {
    count: filtered.length,
    next: null,
    previous: null,
    results: filtered,
  };
}

/**
 * Fetch list of creators from Django backend with search and query filters.
 * Returns results array directly for simple list consumers.
 */
export async function getMarketplaceCreators(
  params?: CreatorFilterParams,
): Promise<Creator[]> {
  const response = await getMarketplacePaginatedCreators(params);
  return response.results;
}

/**
 * Fetch full profile and showcase for a single creator by handle or slug.
 */
export async function getMarketplaceCreatorBySlug(slug: string): Promise<Creator | null> {
  const cleanSlug = slug.replace(/^@/, "").toLowerCase();

  try {
    const data = await apiRequest<Creator>(`/public/creators/${cleanSlug}/`, { timeoutMs: 4000 });
    if (data && data.name) {
      return data;
    }
  } catch (err) {
    console.warn(`Backend /public/creators/${cleanSlug}/ failed, checking fallback catalog:`, err);
  }

  // Fallback to local mock data
  return (
    mockCreators.find(
      (c) =>
        c.slug.toLowerCase() === cleanSlug ||
        c.handle.replace(/^@/, "").toLowerCase() === cleanSlug,
    ) ?? null
  );
}

/**
 * Fetch active campaigns/requirements posted by business brands.
 */
export async function getMarketplaceCampaigns(params?: Record<string, unknown>): Promise<Campaign[]> {
  try {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          query.set(key, String(val));
        }
      });
    }

    const qs = query.toString();
    const endpoint = `/public/campaigns/${qs ? `?${qs}` : ""}`;
    const data = await apiRequest<PublicCampaignsResponse>(endpoint, { timeoutMs: 4000 });

    if (data?.results && data.results.length > 0) {
      return data.results;
    }
  } catch (err) {
    console.warn("Backend /public/campaigns/ failed, using fallback campaigns:", err);
  }

  return mockCampaigns;
}

/**
 * Fetch complete public brief for a specific campaign opportunity by UUID.
 */
export async function getMarketplaceCampaignDetail(id: string): Promise<Campaign | null> {
  try {
    const data = await apiRequest<Campaign>(`/public/campaigns/${id}/`, { timeoutMs: 4000 });
    if (data && data.title) {
      return data;
    }
  } catch (err) {
    console.warn(`Backend /public/campaigns/${id}/ failed:`, err);
  }

  return mockCampaigns.find((c) => c.id === id) ?? null;
}

/**
 * Dispatch a public collaboration inquiry from a client to a creator.
 * Persists in the Django backend Inquiry & InquiryMessage models.
 */
export async function submitCollaborationInquiry(
  payload: CollaborationInquiryPayload,
): Promise<{ id: string; status: string; detail: string }> {
  return await apiRequest<{ id: string; status: string; detail: string }>("/public/inquiries/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Submit a request for a creator's media kit PDF and verified rate card.
 */
export async function requestCreatorMediaKit(
  slug: string,
  payload: MediaKitRequestPayload,
): Promise<{ status: string; detail: string }> {
  const cleanSlug = slug.replace(/^@/, "").toLowerCase();
  return await apiRequest<{ status: string; detail: string }>(
    `/public/creators/${cleanSlug}/media-kit/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

/**
 * Fetch dynamic active categories from Django taxonomies API.
 */
export async function getMarketplaceCategories(): Promise<Category[]> {
  try {
    const data = await apiRequest<Array<{ id: string; name: string; slug: string; creator_count?: number | undefined }>>(
      "/public/taxonomies/categories/",
      { timeoutMs: 3000 },
    );
    if (Array.isArray(data) && data.length > 0) {
      return data.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
        creator_count: c.creator_count,
      }));
    }
  } catch (err) {
    console.warn("Backend categories fetch failed:", err);
  }
  return mockCategories.map((c) => ({
    name: c.name,
    slug: c.slug,
    creator_count: c.count,
  }));
}

/**
 * Fetch dynamic active locations from Django taxonomies API with hierarchical parent resolution.
 */
export async function getMarketplaceLocations(query?: string): Promise<Place[]> {
  try {
    const qs = query ? `?search=${encodeURIComponent(query)}` : "";
    const data = await apiRequest<{ count: number; results: BackendLocationNode[] }>(
      `/public/taxonomies/locations/${qs}`,
      { timeoutMs: 3000 },
    );
    if (data?.results && data.results.length > 0) {
      return data.results.map((loc) => {
        let parentName = "Kerala";
        if (loc.parent && typeof loc.parent === "object" && loc.parent.name) {
          parentName = loc.parent.name;
        } else if (typeof loc.parent_name === "string" && loc.parent_name) {
          parentName = loc.parent_name;
        }

        return {
          id: String(loc.id),
          city: loc.name,
          district: parentName,
          region: parentName,
          country:
            loc.country_code === "IN"
              ? "India"
              : loc.country_code === "AE"
                ? "United Arab Emirates"
                : "India",
          countryCode: loc.country_code || "IN",
          lat: loc.latitude ? Number(loc.latitude) : 10.8505,
          lng: loc.longitude ? Number(loc.longitude) : 76.2711,
        };
      });
    }
  } catch (err) {
    console.warn("Backend locations fetch failed, using fallback:", err);
  }
  return mockPlaces;
}
