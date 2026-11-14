import { apiRequest, ApiError } from "@/lib/api-client";
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
  parent?:
    | {
        id: string;
        name: string;
      }
    | string
    | null;
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
  return await apiRequest<PublicCreatorsResponse>(endpoint, { timeoutMs: 8000 });
}

/**
 * Fetch list of creators from Django backend with search and query filters.
 * Returns results array directly for simple list consumers.
 */
export async function getMarketplaceCreators(params?: CreatorFilterParams): Promise<Creator[]> {
  const response = await getMarketplacePaginatedCreators(params);
  return response.results;
}

/**
 * Fetch full profile and showcase for a single creator by handle or slug.
 */
export async function getMarketplaceCreatorBySlug(slug: string): Promise<Creator | null> {
  const cleanSlug = slug.replace(/^@/, "").toLowerCase();

  try {
    const data = await apiRequest<Creator>(`/public/creators/${cleanSlug}/`, { timeoutMs: 6000 });
    if (data && data.name) {
      return data;
    }
    return null;
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

/**
 * Fetch active campaigns/requirements posted by business brands.
 */
export async function getMarketplaceCampaigns(
  params?: Record<string, unknown>,
): Promise<Campaign[]> {
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
  const data = await apiRequest<PublicCampaignsResponse>(endpoint, { timeoutMs: 6000 });
  return data?.results || [];
}

/**
 * Fetch complete public brief for a specific campaign opportunity by UUID.
 */
export async function getMarketplaceCampaignDetail(id: string): Promise<Campaign | null> {
  try {
    const data = await apiRequest<Campaign>(`/public/campaigns/${id}/`, { timeoutMs: 6000 });
    if (data && data.title) {
      return data;
    }
    return null;
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
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
  const data = await apiRequest<
    Array<{ id: string; name: string; slug: string; creator_count?: number | undefined }>
  >("/public/taxonomies/categories/", { timeoutMs: 5000 });

  if (Array.isArray(data)) {
    return data.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
      creator_count: c.creator_count,
    }));
  }
  return [];
}

/**
 * Fetch dynamic active locations from Django taxonomies API with hierarchical parent resolution.
 */
export async function getMarketplaceLocations(query?: string): Promise<Place[]> {
  const qs = query ? `?search=${encodeURIComponent(query)}` : "";
  const data = await apiRequest<{ count: number; results: BackendLocationNode[] }>(
    `/public/taxonomies/locations/${qs}`,
    { timeoutMs: 5000 },
  );

  if (data?.results && Array.isArray(data.results)) {
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
              : loc.country_code === "GB"
                ? "United Kingdom"
                : loc.country_code === "US"
                  ? "United States"
                  : loc.country_code === "SG"
                    ? "Singapore"
                    : "India",
        countryCode: loc.country_code || "IN",
        lat: loc.latitude ? Number(loc.latitude) : 10.8505,
        lng: loc.longitude ? Number(loc.longitude) : 76.2711,
      };
    });
  }
  return [];
}
