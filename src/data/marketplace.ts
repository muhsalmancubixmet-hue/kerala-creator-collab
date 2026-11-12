import creatorsOne from "@/assets/kerala-creators-1.jpg";
import creatorsTwo from "@/assets/kerala-creators-2.jpg";
import globalCreators from "@/assets/global-creators.jpg";
import portfolioGrid from "@/assets/kerala-portfolio-grid.jpg";
import type {
  Creator,
  Service,
  PortfolioItem,
  Campaign,
  Place,
  Testimonial,
  Category,
} from "@/types/marketplace";

export type {
  Creator,
  Service,
  PortfolioItem,
  Campaign,
  Place,
  Testimonial,
  Category,
};

/* ------------------------------------------------------------------
 * Platform configuration — global and data-driven.
 * These lists are placeholders for values later served by the SaaS
 * Manager API. Components must read from here, never hardcode.
 * ------------------------------------------------------------------ */

export type Currency = { code: string; symbol: string; locale: string };
export const currencies: Record<string, Currency> = {
  USD: { code: "USD", symbol: "$", locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB" },
  AED: { code: "AED", symbol: "AED", locale: "en-AE" },
  INR: { code: "INR", symbol: "₹", locale: "en-IN" },
  CAD: { code: "CAD", symbol: "CA$", locale: "en-CA" },
  AUD: { code: "AUD", symbol: "A$", locale: "en-AU" },
  SAR: { code: "SAR", symbol: "SAR", locale: "en-SA" },
  SGD: { code: "SGD", symbol: "S$", locale: "en-SG" },
};
export const defaultCurrency = "USD";

export const formatMoney = (
  amount: number | null,
  currency: string = defaultCurrency,
  compact = false,
) => {
  if (amount == null) return "Contact for price";
  const cfg = currencies[currency] ?? currencies[defaultCurrency]!;
  return new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: cfg.code,
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(amount);
};
export const formatRange = (min: number, max: number | null, currency: string) =>
  max == null
    ? `From ${formatMoney(min, currency, true)}`
    : `${formatMoney(min, currency, true)}–${formatMoney(max, currency, true)}`;

export const languages = [
  "English",
  "Arabic",
  "Spanish",
  "French",
  "German",
  "Hindi",
  "Malayalam",
  "Tamil",
  "Mandarin",
  "Portuguese",
];

export const platforms = [
  "Instagram",
  "YouTube",
  "TikTok",
  "Facebook",
  "X",
  "LinkedIn",
  "Snapchat",
  "Threads",
  "Pinterest",
  "Twitch",
];

/* ------------------------------------------------------------------
 * Global hierarchical location model.
 * Country → (Region) → (District) → City → (Area). Only country and
 * city are required so any administrative structure fits.
 * ------------------------------------------------------------------ */


export const places: Place[] = [
  {
    id: "kochi",
    city: "Kochi",
    district: "Ernakulam",
    region: "Kerala",
    country: "India",
    countryCode: "IN",
    lat: 9.9312,
    lng: 76.2673,
  },
  {
    id: "kozhikode",
    city: "Kozhikode",
    district: "Kozhikode",
    region: "Kerala",
    country: "India",
    countryCode: "IN",
    lat: 11.2588,
    lng: 75.7804,
  },
  {
    id: "thrissur",
    city: "Thrissur",
    district: "Thrissur",
    region: "Kerala",
    country: "India",
    countryCode: "IN",
    lat: 10.5276,
    lng: 76.2144,
  },
  {
    id: "thiruvananthapuram",
    city: "Thiruvananthapuram",
    district: "Thiruvananthapuram",
    region: "Kerala",
    country: "India",
    countryCode: "IN",
    lat: 8.5241,
    lng: 76.9366,
  },
  {
    id: "kottayam",
    city: "Kottayam",
    district: "Kottayam",
    region: "Kerala",
    country: "India",
    countryCode: "IN",
    lat: 9.5916,
    lng: 76.5222,
  },
  {
    id: "wayanad",
    city: "Kalpetta",
    district: "Wayanad",
    region: "Kerala",
    country: "India",
    countryCode: "IN",
    lat: 11.6085,
    lng: 76.083,
  },
  {
    id: "mumbai",
    city: "Mumbai",
    region: "Maharashtra",
    country: "India",
    countryCode: "IN",
    lat: 19.076,
    lng: 72.8777,
  },
  {
    id: "dubai",
    city: "Dubai",
    region: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    lat: 25.2048,
    lng: 55.2708,
  },
  {
    id: "abu-dhabi",
    city: "Abu Dhabi",
    region: "Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
    lat: 24.4539,
    lng: 54.3773,
  },
  {
    id: "london",
    city: "London",
    region: "England",
    district: "Greater London",
    country: "United Kingdom",
    countryCode: "GB",
    lat: 51.5072,
    lng: -0.1276,
  },
  {
    id: "new-york",
    city: "New York",
    region: "New York",
    country: "United States",
    countryCode: "US",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: "los-angeles",
    city: "Los Angeles",
    region: "California",
    district: "Los Angeles County",
    country: "United States",
    countryCode: "US",
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    lat: 1.3521,
    lng: 103.8198,
  },
  {
    id: "toronto",
    city: "Toronto",
    region: "Ontario",
    country: "Canada",
    countryCode: "CA",
    lat: 43.6532,
    lng: -79.3832,
  },
  {
    id: "paris",
    city: "Paris",
    region: "Île-de-France",
    country: "France",
    countryCode: "FR",
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    id: "sydney",
    city: "Sydney",
    region: "New South Wales",
    country: "Australia",
    countryCode: "AU",
    lat: -33.8688,
    lng: 151.2093,
  },
  {
    id: "riyadh",
    city: "Riyadh",
    region: "Riyadh Province",
    country: "Saudi Arabia",
    countryCode: "SA",
    lat: 24.7136,
    lng: 46.6753,
  },
];
export const placeById = (id: string) => places.find((p) => p.id === id);
export const countries = [...new Set(places.map((p) => p.country))].sort();
export const placeLabel = (p: Place) =>
  [p.area, p.city, p.region && p.region !== p.city ? p.region : undefined, p.country]
    .filter(Boolean)
    .join(", ");
/** Kept for existing UI that lists browseable cities. */
export const locations = places.map((p) => p.city);

export const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const r = (d: number) => (d * Math.PI) / 180,
    R = 6371;
  const dLat = r(b.lat - a.lat),
    dLng = r(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

/* ------------------------------------------------------------------
 * Demo data. Kerala is one sample market among several.
 * ------------------------------------------------------------------ */


const services = (reel: number, story: number): Service[] => [
  {
    name: "Brand reel",
    description: "Concept, shoot, edit and one collaborative short-form video.",
    price: reel,
  },
  {
    name: "Story set",
    description: "Three narrative story frames with link and brand mention.",
    price: story,
  },
  {
    name: "Event appearance",
    description: "On-location coverage with real-time social stories.",
    price: null,
  },
];

const mockPortfolio = (category: string): PortfolioItem[] => [
  {
    id: "sample-1",
    title: `${category} Narrative Series`,
    caption: "Collaborative short-form story",
    media_type: "IMAGE",
    media_url: portfolioGrid,
    brand_name: "Nila Foods",
  },
  {
    id: "sample-2",
    title: "Editorial Campaign Spotlight",
    caption: "Cinematic product reel",
    media_type: "VIDEO",
    media_url: portfolioGrid,
    brand_name: "Fernway Stays",
  },
];

type Seed = Omit<
  Creator,
  | "location"
  | "city"
  | "district"
  | "country"
  | "followersLabel"
  | "services"
  | "startingPrice"
  | "portfolio"
  | "collaborations"
  | "testimonials"
> & { placeId: string; reel: number; story: number };

const build = (s: Seed): Creator => {
  const location = placeById(s.placeId)!;
  const { placeId: _p, reel, story, ...rest } = s;
  return {
    ...rest,
    location,
    city: location.city,
    district: location.district ?? location.region ?? "",
    country: location.country,
    followersLabel: formatFollowers(s.followers),
    startingPrice: story,
    photo_url: s.sprite,
    services: services(reel, story),
    portfolio: mockPortfolio(s.category),
    collaborations: ["Nila Foods", "Fernway Stays", "Sahra Atelier"],
    testimonials: [
      {
        quote: "They understood the brief and turned it into a story people genuinely saved and shared.",
        person: "Anjali Rao",
        role: "Brand Lead, Nila Foods",
      },
    ],
  };
};

export const formatFollowers = (value: number) =>
  value >= 1000000
    ? `${(value / 1000000).toFixed(1)}M`
    : value >= 1000
      ? `${Math.round(value / 1000)}K`
      : `${value}`;

export const creators: Creator[] = (
  [
    {
      slug: "maya-menon",
      name: "Maya Menon",
      handle: "@mayatasteskerala",
      category: "Food",
      placeId: "kochi",
      serviceLocations: ["Kochi", "Thrissur", "Dubai"],
      remote: true,
      travels: true,
      languages: ["Malayalam", "English"],
      platforms: ["Instagram", "YouTube"],
      followers: 248000,
      engagement: 6.8,
      bio: "Food storyteller tracing home kitchens, new cafés and the people behind every plate.",
      verified: true,
      available: true,
      currency: "INR",
      reel: 18000,
      story: 6500,
      sprite: creatorsOne,
      position: "0% 50%",
      accent: "coral",
      joined: "2025-02-10",
    },
    {
      slug: "arjun-nair",
      name: "Arjun Nair",
      handle: "@arjuntrails",
      category: "Travel",
      placeId: "kozhikode",
      serviceLocations: ["Worldwide"],
      remote: true,
      travels: true,
      languages: ["Malayalam", "English", "Hindi"],
      platforms: ["Instagram", "YouTube"],
      followers: 412000,
      engagement: 5.4,
      bio: "Slow travel, hidden trails and cinematic stories from India and beyond.",
      verified: true,
      available: true,
      currency: "INR",
      reel: 28000,
      story: 9000,
      sprite: creatorsOne,
      position: "33.33% 50%",
      accent: "green",
      joined: "2024-11-02",
    },
    {
      slug: "diya-varma",
      name: "Diya Varma",
      handle: "@diyainframe",
      category: "Fashion",
      placeId: "thrissur",
      serviceLocations: ["Thrissur", "Kochi"],
      remote: false,
      travels: true,
      languages: ["Malayalam", "English"],
      platforms: ["Instagram", "Pinterest"],
      followers: 186000,
      engagement: 7.2,
      bio: "Contemporary regional style, conscious labels and occasionwear with an editorial eye.",
      verified: true,
      available: false,
      currency: "INR",
      reel: 22000,
      story: 7000,
      sprite: creatorsOne,
      position: "66.66% 50%",
      accent: "gold",
      joined: "2025-04-21",
    },
    {
      slug: "rohan-joseph",
      name: "Rohan Joseph",
      handle: "@rohanreviews",
      category: "Technology",
      placeId: "kochi",
      serviceLocations: ["Remote"],
      remote: true,
      travels: false,
      languages: ["Malayalam", "English"],
      platforms: ["YouTube", "Instagram"],
      followers: 325000,
      engagement: 4.9,
      bio: "Useful tech, cameras and creator tools explained simply.",
      verified: true,
      available: true,
      currency: "INR",
      reel: 32000,
      story: 10000,
      sprite: creatorsOne,
      position: "100% 50%",
      accent: "blue",
      joined: "2024-08-15",
    },
    {
      slug: "nayana-k",
      name: "Nayana K",
      handle: "@nayanaglow",
      category: "Beauty",
      placeId: "kozhikode",
      serviceLocations: ["Kozhikode", "Bengaluru"],
      remote: true,
      travels: false,
      languages: ["Malayalam", "English"],
      platforms: ["Instagram", "YouTube"],
      followers: 154000,
      engagement: 8.1,
      bio: "Honest beauty reviews and warm-weather skincare for every skin tone.",
      verified: true,
      available: true,
      currency: "INR",
      reel: 16000,
      story: 5500,
      sprite: creatorsTwo,
      position: "0% 50%",
      accent: "rose",
      joined: "2025-06-01",
    },
    {
      slug: "akhil-dev",
      name: "Akhil Dev",
      handle: "@akhil.moves",
      category: "Fitness",
      placeId: "thiruvananthapuram",
      serviceLocations: ["Thiruvananthapuram"],
      remote: true,
      travels: false,
      languages: ["Malayalam", "English"],
      platforms: ["Instagram", "TikTok"],
      followers: 98000,
      engagement: 9.3,
      bio: "Approachable strength, mobility and sustainable everyday fitness.",
      verified: false,
      available: true,
      currency: "INR",
      reel: 12000,
      story: 4000,
      sprite: creatorsTwo,
      position: "33.33% 50%",
      accent: "lime",
      joined: "2025-07-12",
    },
    {
      slug: "sreelakshmi-r",
      name: "Sreelakshmi R",
      handle: "@littlethingsbysree",
      category: "Parenting",
      placeId: "kottayam",
      serviceLocations: ["Kottayam", "Remote"],
      remote: true,
      travels: false,
      languages: ["Malayalam", "English"],
      platforms: ["Instagram", "Facebook"],
      followers: 121000,
      engagement: 7.7,
      bio: "Gentle parenting, playful learning and honest notes from family life.",
      verified: false,
      available: true,
      currency: "INR",
      reel: 14000,
      story: 4500,
      sprite: creatorsTwo,
      position: "66.66% 50%",
      accent: "mint",
      joined: "2025-01-18",
    },
    {
      slug: "jishnu-joy",
      name: "Jishnu Joy",
      handle: "@jishnujokes",
      category: "Comedy",
      placeId: "thrissur",
      serviceLocations: ["Thrissur", "Dubai", "Remote"],
      remote: true,
      travels: true,
      languages: ["Malayalam"],
      platforms: ["Instagram", "YouTube"],
      followers: 538000,
      engagement: 10.2,
      bio: "Everyday characters, quick sketches and culture-led comedy.",
      verified: true,
      available: true,
      currency: "INR",
      reel: 35000,
      story: 12000,
      sprite: creatorsTwo,
      position: "100% 50%",
      accent: "orange",
      joined: "2024-05-30",
    },
    {
      slug: "layla-hassan",
      name: "Layla Hassan",
      handle: "@laylastyle.ae",
      category: "Fashion",
      placeId: "dubai",
      serviceLocations: ["Dubai", "Abu Dhabi", "Sharjah", "Remote / Worldwide"],
      remote: true,
      travels: true,
      languages: ["Arabic", "English"],
      platforms: ["Instagram", "TikTok", "Snapchat"],
      followers: 672000,
      engagement: 5.9,
      bio: "Modest fashion, desert-city style and luxury launches across the Gulf.",
      verified: true,
      available: true,
      currency: "AED",
      reel: 9500,
      story: 3200,
      sprite: globalCreators,
      position: "0% 50%",
      accent: "gold",
      joined: "2025-03-05",
    },
    {
      slug: "tom-ellis",
      name: "Tom Ellis",
      handle: "@tomeatslondon",
      category: "Food",
      placeId: "london",
      serviceLocations: ["London", "Manchester", "Paris"],
      remote: false,
      travels: true,
      languages: ["English", "French"],
      platforms: ["Instagram", "TikTok", "YouTube"],
      followers: 289000,
      engagement: 6.1,
      bio: "Neighbourhood bakeries, market stalls and honest restaurant reviews.",
      verified: true,
      available: true,
      currency: "GBP",
      reel: 2200,
      story: 650,
      sprite: globalCreators,
      position: "33.33% 50%",
      accent: "coral",
      joined: "2025-05-14",
    },
    {
      slug: "kiara-brooks",
      name: "Kiara Brooks",
      handle: "@kiaramoves",
      category: "Fitness",
      placeId: "new-york",
      serviceLocations: ["New York", "Remote / Worldwide"],
      remote: true,
      travels: true,
      languages: ["English", "Spanish"],
      platforms: ["Instagram", "TikTok", "YouTube"],
      followers: 845000,
      engagement: 7.4,
      bio: "Street workouts, run clubs and strength for busy city lives.",
      verified: true,
      available: false,
      currency: "USD",
      reel: 4800,
      story: 1400,
      sprite: globalCreators,
      position: "66.66% 50%",
      accent: "lime",
      joined: "2024-10-09",
    },
    {
      slug: "daniel-tan",
      name: "Daniel Tan",
      handle: "@danieltan.tech",
      category: "Technology",
      placeId: "singapore",
      serviceLocations: ["Singapore", "Kuala Lumpur", "Remote"],
      remote: true,
      travels: false,
      languages: ["English", "Mandarin"],
      platforms: ["YouTube", "Instagram", "LinkedIn"],
      followers: 398000,
      engagement: 5.2,
      bio: "Clear gadget reviews and productivity setups for creators and teams.",
      verified: true,
      available: true,
      currency: "SGD",
      reel: 3600,
      story: 1100,
      sprite: globalCreators,
      position: "100% 50%",
      accent: "blue",
      joined: "2025-08-22",
    },
  ] as Seed[]
).map(build);

export const categories = [
  "Food",
  "Travel",
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Fitness",
  "Technology",
  "Gaming",
  "Education",
  "Photography",
  "Comedy",
  "Entertainment",
  "Parenting",
  "Business",
  "Finance",
  "Sports",
  "Automotive",
  "Local Creators",
].map((name, index) => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  count:
    [342, 298, 316, 194, 373, 181, 167, 144, 175, 203, 189, 209, 112, 98, 86, 121, 64, 464][
      index
    ] ?? 50,
}));
export const portfolioImage = portfolioGrid;

const at = (id: string) => placeById(id) ?? null;
export const campaigns: Campaign[] = [
  {
    id: "monsoon-malabar",
    title: "Monsoon flavours of Malabar",
    business: "Nila Foods",
    category: "Food",
    location: at("kozhikode"),
    remote: false,
    platform: "Instagram",
    currency: "INR",
    budgetMin: 30000,
    budgetMax: 55000,
    deliverables: "2 reels · 4 stories",
    deadline: "Oct 18",
    creators: 3,
    description: "Celebrate regional monsoon recipes through personal, story-led content.",
  },
  {
    id: "dubai-launch",
    title: "Autumn capsule launch",
    business: "Sahra Atelier",
    category: "Fashion",
    location: at("dubai"),
    remote: false,
    platform: "Instagram + TikTok",
    currency: "AED",
    budgetMin: 8000,
    budgetMax: 15000,
    deliverables: "1 reel · event visit",
    deadline: "Oct 20",
    creators: 4,
    description: "Attend and cover an intimate boutique launch in Dubai Design District.",
  },
  {
    id: "weekend-wayanad",
    title: "A weekend in the hills",
    business: "Fernway Stays",
    category: "Travel",
    location: at("wayanad"),
    remote: false,
    platform: "Instagram + YouTube",
    currency: "INR",
    budgetMin: 45000,
    budgetMax: null,
    budgetNote: "+ stay",
    deliverables: "1 vlog · 2 reels",
    deadline: "Oct 24",
    creators: 2,
    description: "An immersive two-night property story for couples and young travellers.",
  },
  {
    id: "london-brunch",
    title: "London brunch trail",
    business: "Crumb & Co",
    category: "Food",
    location: at("london"),
    remote: false,
    platform: "TikTok",
    currency: "GBP",
    budgetMin: 800,
    budgetMax: 1500,
    deliverables: "3 short videos",
    deadline: "Oct 30",
    creators: 5,
    description: "Visit three new locations and share your honest brunch picks.",
  },
  {
    id: "smart-learning",
    title: "Learning made local",
    business: "Akshara Learn",
    category: "Education",
    location: null,
    remote: true,
    platform: "YouTube",
    currency: "USD",
    budgetMin: 500,
    budgetMax: 900,
    deliverables: "1 integration · 3 shorts",
    deadline: "Nov 02",
    creators: 4,
    description:
      "Introduce native-language learning tools to parents and students — remote, worldwide.",
  },
  {
    id: "nyc-run",
    title: "Run the city",
    business: "Pulse Athletics",
    category: "Fitness",
    location: at("new-york"),
    remote: false,
    platform: "Instagram",
    currency: "USD",
    budgetMin: 1500,
    budgetMax: 3000,
    deliverables: "3 reels · race day",
    deadline: "Oct 28",
    creators: 8,
    description: "A high-energy community run challenge across city neighbourhoods.",
  },
  {
    id: "creator-phone",
    title: "Shot on the move",
    business: "Nova Mobile",
    category: "Technology",
    location: at("singapore"),
    remote: true,
    platform: "Instagram + YouTube",
    currency: "SGD",
    budgetMin: 2000,
    budgetMax: 4000,
    deliverables: "1 review · 2 reels",
    deadline: "Nov 10",
    creators: 3,
    description: "Showcase mobile filmmaking through distinctive places and stories.",
  },
];
export const campaignBudget = (c: Campaign) =>
  `${formatRange(c.budgetMin, c.budgetMax, c.currency)}${c.budgetNote ? ` ${c.budgetNote}` : ""}`;
export const campaignLocation = (c: Campaign) =>
  c.location ? `${c.location.city}, ${c.location.countryCode}` : "Remote";

export const collaborations = ["Nila Foods", "Fernway Stays", "Sahra Atelier", "Nova Mobile"];
export const testimonials = [
  {
    quote:
      "They understood the brief and turned it into a story people genuinely saved and shared.",
    person: "Anjali Rao",
    role: "Brand Lead, Nila Foods",
  },
  {
    quote: "Clear communication, thoughtful production and one of our strongest campaign results.",
    person: "Kevin Thomas",
    role: "Marketing, Fernway Stays",
  },
];

/** Approximate demo conversion rates to USD for cross-currency price filtering. */
export const usdRates: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  AED: 0.272,
  INR: 0.012,
  CAD: 0.73,
  AUD: 0.66,
  SAR: 0.267,
  SGD: 0.74,
};
export const toUSD = (amount: number, currency: string) => amount * (usdRates[currency] ?? 1);
