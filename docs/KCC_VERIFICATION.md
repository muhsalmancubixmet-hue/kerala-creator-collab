# Kerala Creator Collab (KCC) — Verified Public API Contract & Empirical Audit

**Status**: Verified against live Django REST Framework backend (`http://127.0.0.1:8000`) and serializers.  
**Base URL**: `http://127.0.0.1:8000/api/v1/public/` (Production: configurable via `VITE_API_BASE_URL`)  
**Auth**: None required for `/api/v1/public/*` routes (`AllowAny`).  
**CORS**: Permitted origins: `http://localhost:8080`, `http://localhost:8081`, `http://localhost:8082`, `http://localhost:8083`, `http://localhost:5173`.  
**Note**: This file contains the empirical reality of the backend implementation. `KCC_API_CONTRACT.md` remains untouched as the historical design specification.

---

## 1. Specification & Serialization Architecture

1. **Envelope Architecture**:
   - List endpoints (`/public/creators/`, `/public/campaigns/`, `/public/taxonomies/locations/`) enforce standard DRF pagination:
     ```json
     {
       "count": <integer>,
       "next": <string|null>,
       "previous": <string|null>,
       "results": [...]
     }
     ```
   - `/public/taxonomies/categories/` returns an unpaginated flat JSON array `[...]`.
2. **Identification Strategy**:
   - Entities use UUID4 strings (e.g., `8e435042-75b7-4ebb-8069-9404f1b4118b`) across all models (`CreatorProfile`, `Campaign`, `Category`, `Location`, `Inquiry`), not integer IDs or mock slugs (`pkg-1`, `inq-981723-uuid`).
3. **Location Schema**:
   - Locations are serialized as structured nested JSON objects:
     ```json
     {
       "id": "81f185ef-cce3-4ae3-9d0d-21019623c2a6",
       "city": "Kochi",
       "district": "Ernakulam",
       "region": "Ernakulam",
       "country": "India",
       "countryCode": "IN",
       "lat": 9.9312,
       "lng": 76.2673
     }
     ```

---

## 2. Corrected Public Endpoints Contract

### 2.1 Public Creators List
`GET /api/v1/public/creators/`

- **Serializer**: `PublicCreatorListSerializer` in `backend/apps/creators/api/v1/serializers.py:631-659`
- **Service**: `get_public_creators` in `backend/apps/creators/api/v1/services.py:244-270`
- **View**: `PublicCreatorListView` in `backend/apps/creators/api/v1/views.py:247-268`

#### Supported Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` or `q` | string | No | Full-text query on handle, name, bio |
| `category` | string | No | Category slug or name |
| `location` | string | No | City or district name / UUID filter |
| `district` | string | No | Filter by district name |
| `country` | string | No | Filter by country name |
| `platform` | string | No | Filter by platform (e.g., `instagram`, `youtube`) |
| `language` | string | No | Filter by primary spoken language |
| `min_followers` | integer | No | Minimum audience reach |
| `min_engagement` | float | No | Minimum engagement percentage |
| `min_price` | integer | No | Minimum starting price in cents / paise |
| `max_price` | integer | No | Maximum starting price in cents / paise |
| `verified` | boolean | No | Verified creators only |
| `available` | boolean | No | Available for bookings only |
| `remote` | boolean | No | Remote work supported |
| `sort` | string | No | Sort order: `followers`, `engagement`, `newest`, `price_asc`, `price_desc`, `relevance` |
| `lat`, `lng`, `radius` | float | No | Geospatial radius search in kilometers |
| `page` | integer | No | Page number (default: 1) |
| `page_size` | integer | No | Records per page (default: 12) |

#### Verified Real Response (200 OK)
```json
{
  "count": 11,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "8e435042-75b7-4ebb-8069-9404f1b4118b",
      "slug": "mayatasteskerala",
      "name": "Maya Menon",
      "handle": "mayatasteskerala",
      "category": "Food & Dining",
      "location": {
        "id": "81f185ef-cce3-4ae3-9d0d-21019623c2a6",
        "city": "Kochi",
        "district": "Ernakulam",
        "region": "Ernakulam",
        "country": "India",
        "countryCode": "IN",
        "lat": 9.9312,
        "lng": 76.2673
      },
      "city": "Kochi",
      "district": "Ernakulam",
      "country": "India",
      "serviceLocations": ["Kochi", "Ernakulam", "Kottayam"],
      "remote": true,
      "travels": true,
      "languages": ["Malayalam", "English"],
      "platforms": ["Instagram", "YouTube"],
      "followers": 185000,
      "followersLabel": "185K",
      "engagement": 4.8,
      "bio": "Culinary storyteller exploring authentic Kerala flavors, traditional recipes, and local dining gems.",
      "verified": true,
      "available": true,
      "currency": "INR",
      "startingPrice": null,
      "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "sprite": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "position": "0% 20%",
      "accent": "brand",
      "joined": "Nov 2024"
    }
  ]
}
```

---

### 2.2 Public Creator Detail
`GET /api/v1/public/creators/{slug}/`

- **Serializer**: `PublicCreatorDetailSerializer` in `backend/apps/creators/api/v1/serializers.py:849-938`
- **Service**: `get_public_creator_detail` in `backend/apps/creators/api/v1/services.py:273-305`
- **View**: `PublicCreatorDetailView` in `backend/apps/creators/api/v1/views.py:271-292`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Creator handle or slug (e.g. `mayatasteskerala` or `@mayatasteskerala`) |

#### Verified Real Response (200 OK)
```json
{
  "id": "8e435042-75b7-4ebb-8069-9404f1b4118b",
  "slug": "mayatasteskerala",
  "name": "Maya Menon",
  "handle": "mayatasteskerala",
  "category": "Food & Dining",
  "location": {
    "id": "81f185ef-cce3-4ae3-9d0d-21019623c2a6",
    "city": "Kochi",
    "district": "Ernakulam",
    "region": "Ernakulam",
    "country": "India",
    "countryCode": "IN",
    "lat": 9.9312,
    "lng": 76.2673
  },
  "city": "Kochi",
  "district": "Ernakulam",
  "country": "India",
  "serviceLocations": ["Kochi", "Ernakulam", "Kottayam"],
  "remote": true,
  "travels": true,
  "languages": ["Malayalam", "English"],
  "platforms": ["Instagram", "YouTube"],
  "followers": 185000,
  "followersLabel": "185K",
  "engagement": 4.8,
  "bio": "Culinary storyteller exploring authentic Kerala flavors, traditional recipes, and local dining gems.",
  "verified": true,
  "available": true,
  "currency": "INR",
  "startingPrice": null,
  "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "sprite": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "position": "0% 20%",
  "accent": "brand",
  "joined": "Nov 2024",
  "about": "Maya has spent over 6 years documenting the traditional culinary heritage of God's Own Country. From spice plantation tours in Wayanad to sea-to-table seafood in Kozhikode, her content connects food enthusiasts with trusted culinary establishments.",
  "services": [
    {
      "id": "3f1be160-c97a-4ec6-8aa2-d8f997cb6400",
      "name": "Dedicated Instagram Reel",
      "description": "60-second high-energy recipe video or restaurant review reel with custom background score and call to action.",
      "price": 25000,
      "currency": "INR",
      "delivery_time_days": 5
    },
    {
      "id": "72097931-e174-4b55-8d5f-4a0b27464011",
      "name": "Story Blast (3x Stories)",
      "description": "Three sequential 24-hour stories with swipe-up/link sticker, discount promo code, and brand tagging.",
      "price": 10000,
      "currency": "INR",
      "delivery_time_days": 2
    }
  ],
  "portfolio": [
    {
      "id": "4da185e3-4ff0-4820-94cb-fa73507cfb19",
      "title": "Traditional Malabar Biryani Walkthrough",
      "caption": "Filmed on location at Paragon Kozhikode, highlighting slow-cooked dum techniques and heritage ghee rice.",
      "media_type": "VIDEO",
      "media_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
      "thumbnail_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
      "brand_name": "Paragon Hospitality",
      "format_tag": "REEL"
    }
  ],
  "collaborations": ["Paragon Hospitality", "Eastern Condiments", "Double Horse"],
  "testimonials": [
    {
      "quote": "Maya delivered exceptional brand recall for our new spice powder line. Her audience genuinely trusts her cooking advice.",
      "author": "Anjali Nair",
      "brand": "Eastern Condiments",
      "role": "Brand Marketing Lead"
    }
  ]
}
```

---

### 2.3 Creator Media Kit Request
`POST /api/v1/public/creators/{slug}/media-kit/`

- **Serializer**: `PublicMediaKitRequestSerializer` in `backend/apps/creators/api/v1/serializers.py:941-949`
- **Service**: `request_creator_media_kit` in `backend/apps/creators/api/v1/services.py:709-778`
- **View**: `PublicMediaKitRequestView` in `backend/apps/creators/api/v1/views.py:295-316`

#### Request Body (JSON)
```json
{
  "requester_name": "Rohan Nair",
  "requester_email": "rohan@keralabrand.com",
  "company_name": "Kerala Artisan Foods",
  "notes": "Planning campaign for Onam season"
}
```
*Note*: `company_name` and `notes` are optional. Contract's `requester_company` is rejected; field must be named `company_name`.

#### Verified Real Response (200 OK)
```json
{
  "status": "success",
  "creator_handle": "mayatasteskerala",
  "creator_name": "Maya Menon",
  "download_url": "/media/media_kits/8e435042-75b7-4ebb-8069-9404f1b4118b_mediakit.pdf",
  "recipient_email": "rohan@keralabrand.com",
  "detail": "Media kit for Maya Menon generated successfully and dispatched to rohan@keralabrand.com."
}
```
*Note*: `expires_at` does not exist in the real response. The response provides `creator_handle`, `creator_name`, `recipient_email`, and `detail`.

---

### 2.4 Public Campaigns List
`GET /api/v1/public/campaigns/`

- **Serializer**: `PublicCampaignListSerializer` in `backend/apps/campaigns/api/v1/serializers.py:345-386`
- **View**: `PublicCampaignListView` in `backend/apps/campaigns/api/v1/views.py:406-464`

#### Supported Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` or `search` | string | No | Search across title and objective |
| `category` | string | No | Category name or slug |
| `location` | string | No | Location city or district |
| `country` | string | No | Country name or code |
| `remote` | boolean | No | Filter remote campaigns |
| `sort` | string | No | Sort by `new` or `budget` |
| `page` | integer | No | Page number (default: 1) |
| `page_size` | integer | No | Records per page (default: 12) |

#### Verified Real Response (200 OK)
```json
{
  "count": 7,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "f8c88667-72b3-40d6-8f48-d18be5f0f03e",
      "title": "Kerala Traditional Spice Launch",
      "business": "Malabar Spice Co.",
      "category": "Food & Dining",
      "location": {
        "id": "81f185ef-cce3-4ae3-9d0d-21019623c2a6",
        "city": "Kochi",
        "district": "Ernakulam",
        "region": "Ernakulam",
        "country": "India",
        "countryCode": "IN",
        "lat": 9.9312,
        "lng": 76.2673
      },
      "remote": false,
      "platform": "Instagram",
      "currency": "INR",
      "budgetMin": 50000,
      "budgetMax": 75000,
      "budgetNote": "+ deliverables",
      "deliverables": "2 reels · 4 stories",
      "deadline": "Open",
      "creators": 3,
      "description": "Collaborate with authentic culinary and lifestyle influencers to showcase our single-origin Wayanad black pepper and organic cardamom range.",
      "cover_image_url": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
      "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
    }
  ]
}
```

---

### 2.5 Public Campaign Detail
`GET /api/v1/public/campaigns/{id}/`

- **Serializer**: `PublicCampaignDetailSerializer` in `backend/apps/campaigns/api/v1/serializers.py:441-458`
- **View**: `PublicCampaignDetailView` in `backend/apps/campaigns/api/v1/views.py:467-495`

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Campaign UUID |

#### Verified Real Response (200 OK)
```json
{
  "id": "f8c88667-72b3-40d6-8f48-d18be5f0f03e",
  "title": "Kerala Traditional Spice Launch",
  "business": "Malabar Spice Co.",
  "category": "Food & Dining",
  "location": {
    "id": "81f185ef-cce3-4ae3-9d0d-21019623c2a6",
    "city": "Kochi",
    "district": "Ernakulam",
    "region": "Ernakulam",
    "country": "India",
    "countryCode": "IN",
    "lat": 9.9312,
    "lng": 76.2673
  },
  "remote": false,
  "platform": "Instagram",
  "currency": "INR",
  "budgetMin": 50000,
  "budgetMax": 75000,
  "budgetNote": "+ deliverables",
  "deliverables": "2 reels · 4 stories",
  "deadline": "Open",
  "creators": 3,
  "description": "Collaborate with authentic culinary and lifestyle influencers to showcase our single-origin Wayanad black pepper and organic cardamom range.",
  "cover_image_url": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
  "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
  "business_website": "https://malabarspice.example.com",
  "target_audience": "Food enthusiasts, home cooks, and lifestyle seekers aged 22-45 in South India.",
  "status": "ACTIVE",
  "created_at": "2026-11-08T10:15:00.000000Z"
}
```
*Note*: `requirements` field from contract does not exist in backend model or serializer. `deliverables` is a single serialized string, not a string array.

---

### 2.6 Public Collaboration Inquiry
`POST /api/v1/public/inquiries/`

- **Serializer**: `PublicInquiryCreateSerializer` in `backend/apps/campaigns/api/v1/serializers.py:461-475`
- **Service**: `create_public_inquiry` in `backend/apps/campaigns/api/v1/services.py:219-270`
- **View**: `PublicInquiryCreateView` in `backend/apps/campaigns/api/v1/views.py:519-525`

#### Request Body (JSON)
```json
{
  "creator_handle": "mayatasteskerala",
  "client_name": "Rohan Nair",
  "client_email": "rohan@keralabrand.com",
  "client_phone": "+919447000111",
  "company_name": "Kerala Artisan Foods",
  "subject": "Product Collaboration - Organic Spice Blend",
  "message": "Hi Maya, we love your authentic recipe videos and would like to sponsor an upcoming reel featuring our organic Malabar spice kit.",
  "budget": 20000,
  "currency": "INR",
  "service_id": "3f1be160-c97a-4ec6-8aa2-d8f997cb6400"
}
```
*Note*: Field name differences from contract:
- `client_name` (NOT `requester_name`)
- `client_email` (NOT `requester_email`)
- `company_name` (NOT `requester_company`)
- Supports optional `client_phone` and `service_id`.

#### Verified Real Response (201 Created)
```json
{
  "id": "2423798a-c2f9-4ee0-a248-3d16a9658cad",
  "status": "NEW",
  "creator": "mayatasteskerala",
  "business": "Kerala Artisan Foods",
  "detail": "Collaboration inquiry submitted successfully. The creator has been notified."
}
```
*Note*: The contract claimed the response echoes back `requester_name`, `requester_email`, `subject`, `budget`, `currency`, `created_at`. In reality, the view returns the exact dictionary above with `id` (UUID), `status`, `creator` (handle), `business` (company name), and `detail`.

---

### 2.7 Taxonomies: Categories
`GET /api/v1/public/taxonomies/categories/`

- **Serializer**: `CategorySerializer` in `backend/apps/taxonomies/api/v1/serializers.py:5-13`
- **View**: `PublicCategoryListView` in `backend/apps/taxonomies/api/v1/views.py:20-45`

#### Verified Real Response (200 OK)
```json
[
  {
    "id": "df9e54bb-bbb9-4063-a5c8-31c64faf741e",
    "name": "Food & Dining",
    "slug": "food-dining",
    "order": 1,
    "is_active": true,
    "creator_count": 4,
    "created_at": "2026-11-01T05:00:00.000000Z"
  },
  {
    "id": "5fa23bb2-9b27-44a3-a7bb-4366e6b528be",
    "name": "Travel & Adventure",
    "slug": "travel-adventure",
    "order": 2,
    "is_active": true,
    "creator_count": 3,
    "created_at": "2026-11-01T05:00:00.000000Z"
  }
]
```
*Note*:
- `id` is a UUID string, not an integer.
- `icon` is NOT present on the Category model or serializer.
- Real fields include `order`, `is_active`, `creator_count`, `created_at`.

---

### 2.8 Taxonomies: Locations
`GET /api/v1/public/taxonomies/locations/`

- **Serializer**: `LocationSerializer` in `backend/apps/taxonomies/api/v1/serializers.py:16-37`
- **View**: `PublicLocationListView` in `backend/apps/taxonomies/api/v1/views.py:164-210`

#### Supported Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search query for location name (supports 3+ char fallback geocoding) |
| `type` | string | No | Node type filter (`STATE`, `DISTRICT`, `CITY`) |
| `parent_id` | UUID | No | Filter children of parent location node |
| `country_code` | string | No | ISO 2-letter country code (e.g., `IN`, `AE`) |
| `page` | integer | No | Page number (default: 1) |

#### Verified Real Response (200 OK)
```json
{
  "count": 14,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "81f185ef-cce3-4ae3-9d0d-21019623c2a6",
      "name": "Kochi",
      "type": "CITY",
      "parent": "020c1569-b541-41c1-8ce2-6b9be2fc59d9",
      "parent_name": "Ernakulam",
      "country_code": "IN",
      "latitude": "9.931200",
      "longitude": "76.267300",
      "full_path": "Kerala / Ernakulam / Kochi",
      "is_active": true,
      "creators": 5
    }
  ]
}
```
*Note*:
- Contract specified an unpaginated array; reality is paginated with standard DRF envelope (`count`, `next`, `previous`, `results`).
- `id` and `parent` are UUIDs, not integers.
- Real fields include `country_code`, `latitude`, `longitude`, `full_path`, `is_active`, `creators`.
