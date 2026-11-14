# Kerala Creator Collab (KCC) — Public API Specification & Contract

Version: 1.0.0 (As Implemented)  
Base URL: `http://127.0.0.1:8000/api/v1/public/` (Production: configurable via `VITE_API_BASE_URL`)  
Auth: None required for `/api/v1/public/*` routes.  
CORS: Allowed frontend origins: `http://localhost:8080`, `http://localhost:8081`, `http://localhost:8082`, `http://localhost:8083`, `http://localhost:5173`.

---

## 1. Design & Money Conventions

- **Money Units**:
  - **Database Storage**: Fixed-point integer cents / paise (`budget_cents`, `total_budget_cents`, `rate_cents`, `starting_price_cents`) to eliminate floating-point rounding errors.
  - **API Contract**: Standard major currency units (e.g. `5000.00` or `5000` for INR) as JSON numbers or strings. Currency defaults to `INR` unless specified.
  - **Portal Frontend Display**: Formatted through `formatMoney(amount, currency)` using `Intl.NumberFormat('en-IN')` (e.g., `₹5,000`).
- **Data Privacy**:
  - No private creator or business emails, phone numbers, password hashes, or internal staff notes are ever returned in public payloads.
- **Naming Convention**:
  - Request and response payloads use `snake_case` in accordance with `BACKEND_ENGINEERING_RULES.md`.
  - Frontend adapters map `snake_case` to camelCase domain models with full TypeScript type safety.
- **Envelope**:
  - List endpoints return DRF pagination envelopes: `{"count": <int>, "next": <str|null>, "previous": <str|null>, "results": [...]}`.

---

## 2. Public Endpoints Specification

### 2.1 Creators List
`GET /api/v1/public/creators/`

Returns a paginated list of active public creators.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search across creator handle, display name, and bio |
| `category` | string | No | Category slug (e.g., `food-dining`, `travel-adventure`) |
| `city` | string | No | Filter by city name (e.g., `Kochi`, `Trivandrum`) |
| `platform` | string | No | Filter by platform (e.g., `instagram`, `youtube`) |
| `page` | integer | No | Page number (default: 1) |
| `page_size` | integer | No | Number of records per page (default: 10, max: 50) |

#### Response (200 OK)
```json
{
  "count": 11,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "e67412ca-115f-40c2-9e20-7f28731adbc0",
      "slug": "mayatasteskerala",
      "handle": "mayatasteskerala",
      "name": "Maya Menon",
      "profile_image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      "bio": "Culinary storyteller exploring authentic Kerala flavors, traditional recipes, and local dining.",
      "category": "Food & Dining",
      "categories": ["Food & Dining", "Travel & Adventure"],
      "location": "Kochi, Ernakulam",
      "city": "Kochi",
      "district": "Ernakulam",
      "state": "Kerala",
      "followers": 185000,
      "engagement_rate": 4.8,
      "pricing": 15000,
      "starting_rate": 15000,
      "currency": "INR",
      "verified": true,
      "platforms": ["instagram", "youtube"]
    }
  ]
}
```

#### cURL Example
```bash
curl -s -H "Origin: http://localhost:8082" \
  "http://127.0.0.1:8000/api/v1/public/creators/?category=food-dining"
```

---

### 2.2 Creator Detail
`GET /api/v1/public/creators/{slug}/`

Returns comprehensive public profile details for a creator.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Creator unique handle / slug (e.g. `mayatasteskerala`) |

#### Response (200 OK)
```json
{
  "id": "e67412ca-115f-40c2-9e20-7f28731adbc0",
  "slug": "mayatasteskerala",
  "handle": "mayatasteskerala",
  "name": "Maya Menon",
  "profile_image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  "cover_image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "bio": "Culinary storyteller exploring authentic Kerala flavors.",
  "about": "Detailed background story, culinary journey, and brand collaboration history.",
  "category": "Food & Dining",
  "categories": ["Food & Dining"],
  "location": "Kochi, Ernakulam",
  "city": "Kochi",
  "district": "Ernakulam",
  "state": "Kerala",
  "followers": 185000,
  "engagement_rate": 4.8,
  "verified": true,
  "platforms": [
    {
      "platform": "instagram",
      "handle": "mayatasteskerala",
      "followers": 145000,
      "url": "https://instagram.com/mayatasteskerala"
    },
    {
      "platform": "youtube",
      "handle": "MayaTastesKerala",
      "followers": 40000,
      "url": "https://youtube.com/@MayaTastesKerala"
    }
  ],
  "packages": [
    {
      "id": "pkg-1",
      "title": "Dedicated Reel & Recipe Showcase",
      "description": "High-production 60s Reel featuring product integration with recipe walkthrough.",
      "price": 25000,
      "currency": "INR",
      "deliverables": ["1x 60s Instagram Reel", "3x Stories with link sticker", "Usage rights for 30 days"]
    }
  ],
  "portfolio_items": [
    {
      "id": "port-1",
      "title": "Traditional Sadya Experience",
      "media_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
      "likes": 14200,
      "comments": 430
    }
  ]
}
```

#### Error Responses
- **404 Not Found**: If creator handle does not exist, or creator is soft-deleted or inactive (`{"detail": "Not found."}`).

#### cURL Example
```bash
curl -s -H "Origin: http://localhost:8082" \
  "http://127.0.0.1:8000/api/v1/public/creators/mayatasteskerala/"
```

---

### 2.3 Media Kit Request
`POST /api/v1/public/creators/{slug}/media-kit/`

Generates and returns a downloadable PDF media kit for the creator.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Creator unique handle / slug |

#### Request Body (JSON)
```json
{
  "requester_name": "Rohan Nair",
  "requester_email": "rohan@keralabrand.com",
  "requester_company": "Kerala Artisan Foods"
}
```

#### Response (200 OK)
```json
{
  "status": "success",
  "download_url": "/media/media_kits/mayatasteskerala_media_kit.pdf",
  "expires_at": "2026-11-15T12:00:00Z"
}
```

#### Error Responses
- **400 Bad Request**: Missing `requester_name` or `requester_email`.
- **404 Not Found**: Unknown creator handle.

#### cURL Example
```bash
curl -X POST -H "Content-Type: application/json" -H "Origin: http://localhost:8082" \
  -d '{"requester_name":"Rohan Nair","requester_email":"rohan@keralabrand.com"}' \
  "http://127.0.0.1:8000/api/v1/public/creators/mayatasteskerala/media-kit/"
```

---

### 2.4 Public Campaigns List
`GET /api/v1/public/campaigns/`

Returns published/active brand campaign opportunities.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Category filter |
| `city` | string | No | City filter |
| `page` | integer | No | Page number (default: 1) |
| `page_size` | integer | No | Results per page (default: 10) |

#### Response (200 OK)
```json
{
  "count": 7,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "f8c88667-72b3-40d6-8f48-d18be5f0f03e",
      "title": "Onam Festive Traditional Brand Campaign",
      "description": "Collaborate with heritage brand for authentic festive promotions.",
      "category": "Food & Dining",
      "business_name": "Malabar Heritage Foods",
      "location": "Kochi, Kerala",
      "city": "Kochi",
      "budget": 50000,
      "currency": "INR",
      "compensation_type": "Paid",
      "deadline": "2026-12-15",
      "status": "ACTIVE"
    }
  ]
}
```

#### cURL Example
```bash
curl -s -H "Origin: http://localhost:8082" \
  "http://127.0.0.1:8000/api/v1/public/campaigns/"
```

---

### 2.5 Campaign Detail
`GET /api/v1/public/campaigns/{id}/`

Returns details for a specific published campaign.

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Campaign unique identifier |

#### Response (200 OK)
```json
{
  "id": "f8c88667-72b3-40d6-8f48-d18be5f0f03e",
  "title": "Onam Festive Traditional Brand Campaign",
  "description": "Collaborate with heritage brand for authentic festive promotions.",
  "category": "Food & Dining",
  "business_name": "Malabar Heritage Foods",
  "location": "Kochi, Kerala",
  "city": "Kochi",
  "budget": 50000,
  "currency": "INR",
  "compensation_type": "Paid",
  "deadline": "2026-12-15",
  "status": "ACTIVE",
  "requirements": [
    "Minimum 25k followers on Instagram or YouTube",
    "Focus on Kerala culinary culture or lifestyle",
    "Must create high-quality 4K vertical video reel"
  ],
  "deliverables": [
    "1x Instagram Reel",
    "2x Stories",
    "Product review and recipe mention"
  ]
}
```

#### Error Responses
- **404 Not Found**: If UUID does not exist or campaign is in DRAFT/ARCHIVED/CANCELLED status.

---

### 2.6 Public Collaboration Inquiry
`POST /api/v1/public/inquiries/`

Submits a business collaboration inquiry to a creator. Creates an `Inquiry` (status `NEW`) and initial `InquiryMessage` in the database, appearing immediately in the creator's Creator Hub portal (port 8080).

#### Request Body (JSON)
```json
{
  "creator_handle": "mayatasteskerala",
  "requester_name": "Rohan Nair",
  "requester_email": "rohan@keralabrand.com",
  "requester_company": "Kerala Artisan Foods",
  "subject": "Product Collaboration - Organic Spice Blend",
  "message": "Hi Maya, we love your authentic recipe videos and would like to sponsor an upcoming reel featuring our organic Malabar spice kit.",
  "budget": 20000,
  "currency": "INR"
}
```

#### Response (201 Created)
```json
{
  "id": "inq-981723-uuid",
  "creator_handle": "mayatasteskerala",
  "requester_name": "Rohan Nair",
  "requester_email": "rohan@keralabrand.com",
  "subject": "Product Collaboration - Organic Spice Blend",
  "status": "NEW",
  "budget": 20000,
  "currency": "INR",
  "created_at": "2026-11-14T06:33:12.190412Z"
}
```

#### Error Responses
- **400 Bad Request**: Missing mandatory fields (`creator_handle`, `requester_name`, `requester_email`, `subject`, `message`).
- **404 Not Found**: Unknown `creator_handle`.

#### cURL Example
```bash
curl -X POST -H "Content-Type: application/json" -H "Origin: http://localhost:8082" \
  -d '{
    "creator_handle": "mayatasteskerala",
    "requester_name": "Rohan Nair",
    "requester_email": "rohan@keralabrand.com",
    "subject": "Product Collaboration",
    "message": "We would love to sponsor an upcoming reel.",
    "budget": 20000,
    "currency": "INR"
  }' \
  "http://127.0.0.1:8000/api/v1/public/inquiries/"
```

---

### 2.7 Taxonomies: Categories
`GET /api/v1/public/taxonomies/categories/`

Returns active marketplace taxonomy categories.

#### Response (200 OK)
```json
[
  { "id": 1, "name": "Food & Dining", "slug": "food-dining", "icon": "utensils", "creator_count": 4 },
  { "id": 2, "name": "Travel & Adventure", "slug": "travel-adventure", "icon": "compass", "creator_count": 3 },
  { "id": 3, "name": "Fashion & Lifestyle", "slug": "fashion-lifestyle", "icon": "sparkles", "creator_count": 2 }
]
```

---

### 2.8 Taxonomies: Locations
`GET /api/v1/public/taxonomies/locations/`

Returns Kerala location hierarchy (State -> District -> City).

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search query for city/district/state name |
| `type` | string | No | Node type filter (`STATE`, `DISTRICT`, `CITY`) |

#### Response (200 OK)
```json
[
  { "id": 10, "name": "Kochi", "type": "CITY", "parent_name": "Ernakulam" },
  { "id": 11, "name": "Ernakulam", "type": "DISTRICT", "parent_name": "Kerala" },
  { "id": 12, "name": "Thiruvananthapuram", "type": "CITY", "parent_name": "Thiruvananthapuram" }
]
```
