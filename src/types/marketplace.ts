/**
 * Influencers.com Marketplace Data Contracts
 * Pure TypeScript types aligning the public frontend with the Django REST backend.
 */

export interface Place {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  region?: string | undefined;
  district?: string | undefined;
  area?: string | undefined;
  lat: number;
  lng: number;
}

export interface Service {
  id?: string | undefined;
  name: string;
  description: string;
  price: number | null;
  currency?: string | undefined;
  delivery_time_days?: number | undefined;
}

export interface PortfolioItem {
  id: string;
  title: string;
  caption?: string | undefined;
  media_type?: string | undefined;
  media_url: string;
  thumbnail_url?: string | undefined;
  brand_name?: string | undefined;
  format_tag?: string | undefined;
}

export interface Testimonial {
  quote: string;
  person: string;
  role: string;
}

export interface Creator {
  id?: string | undefined;
  slug: string;
  name: string;
  handle: string;
  category: string;
  location: Place;
  city: string;
  district: string;
  country: string;
  serviceLocations: string[];
  remote: boolean;
  travels: boolean;
  languages: string[];
  platforms: string[];
  followers: number;
  followersLabel: string;
  engagement: number;
  bio: string;
  verified: boolean;
  available: boolean;
  currency: string;
  startingPrice: number | null;
  photo_url?: string | undefined;
  sprite?: string | undefined;
  position?: string | undefined;
  accent?: string | undefined;
  joined: string;
  about?: string | undefined;
  services?: Service[] | undefined;
  portfolio?: PortfolioItem[] | undefined;
  collaborations?: string[] | undefined;
  testimonials?: Testimonial[] | undefined;
  topAudience?: string | undefined;
}

export interface Campaign {
  id: string;
  title: string;
  business: string;
  category: string;
  location: Place | null;
  remote: boolean;
  platform: string;
  currency: string;
  budgetMin: number;
  budgetMax: number | null;
  budgetNote?: string | undefined;
  deliverables: string;
  deadline: string;
  creators: number;
  description: string;
  business_website?: string | undefined;
  target_audience?: string | undefined;
  status?: string | undefined;
  created_at?: string | undefined;
}

export interface Category {
  id?: string | undefined;
  name: string;
  slug: string;
  order?: number | undefined;
  creator_count?: number | undefined;
}

export interface CollaborationInquiryPayload {
  creator_handle: string;
  client_name: string;
  client_email: string;
  client_phone?: string | undefined;
  company_name?: string | undefined;
  subject: string;
  message: string;
  budget?: number | undefined;
  currency?: string | undefined;
  service_id?: string | undefined;
}

export interface MediaKitRequestPayload {
  requester_name: string;
  requester_email: string;
  company_name?: string | undefined;
  notes?: string | undefined;
}

export interface PublicCreatorsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Creator[];
}

export interface PublicCampaignsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Campaign[];
}

export interface CreatorFilterParams {
  q?: string | undefined;
  category?: string | undefined;
  location?: string | undefined;
  country?: string | undefined;
  platform?: string | undefined;
  language?: string | undefined;
  min_followers?: number | undefined;
  min_engagement?: number | undefined;
  min_price?: number | undefined;
  max_price?: number | undefined;
  verified?: boolean | undefined;
  remote?: boolean | undefined;
  available?: boolean | undefined;
  lat?: number | undefined;
  lng?: number | undefined;
  radius?: number | undefined;
  sort?: string | undefined;
  page?: number | undefined;
  page_size?: number | undefined;
}
