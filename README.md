# Kerala Creator Collab (`kerala-creator-collab`)

Production-ready public marketplace portal for the Kerala Creator ecosystem. Built with **TanStack Start**, **Vite**, **TypeScript**, **Tailwind CSS**, and fully integrated with the Django REST Framework backend.

---

## 1. Overview & Architecture

`kerala-creator-collab` serves as the public discovery front-door of the Kerala Creator platform. It allows businesses, brands, and visitors to discover local creators across Kerala, view creator portfolios and verified analytics, submit collaboration inquiries, explore brand campaigns, and request downloadable PDF media kits.

### System Architecture
```
                         ┌─────────────────────────────────────────┐
                         │   Kerala Creator Collab (Port 8082)     │
                         │   Public Discovery & Inquiries Portal   │
                         └──────────────────┬──────────────────────┘
                                            │ HTTP / JSON
                                            ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             Django REST API Backend                              │
│                             (http://127.0.0.1:8000)                              │
│  /api/v1/public/creators/   /api/v1/public/campaigns/   /api/v1/public/inquiries/│
└──────────────┬────────────────────────────────────────────────────┬──────────────┘
               │ DB Link (Inquiries)                                │
               ▼                                                    ▼
┌──────────────────────────────────┐       ┌───────────────────────────────────────┐
│     Creator Hub (Port 8080)      │       │     Business Portal (Port 8083)       │
│  Creator Inquiries & Management  │       │     Brand Campaigns & Collaborations  │
└──────────────────────────────────┘       └───────────────────────────────────────┘
```

### Key Technical Characteristics
- **SSR & SEO Optimized**: Full server-side rendering and client hydration via TanStack Start.
- **Zero Mock Data**: 100% powered by live Django REST endpoints with error boundaries and retry states.
- **Strict TypeScript & Domain Adapters**: `src/lib/adapters.ts` safely maps backend `snake_case` models to type-safe domain structures with null guards.
- **Currency & Money Precision**: Formatted via `formatMoney` (`Intl.NumberFormat('en-IN')`) backed by integer-cents in backend storage.

---

## 2. Environment Variables

Create a `.env` file in the root of `kerala-creator-collab` based on `.env.example`:

```bash
cp .env.example .env
```

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api/v1` | Django REST Framework API root |
| `VITE_CREATOR_HUB_URL` | `http://localhost:8080` | Link to Creator management portal |
| `VITE_BUSINESS_HUB_URL` | `http://localhost:8083` | Link to Business collaboration portal |
| `VITE_SITE_URL` | `http://localhost:8082` | Public portal origin URL |

---

## 3. Getting Started & Development

### Prerequisites
- Node.js 20+ (Node 22 LTS recommended)
- Running Django backend (`http://127.0.0.1:8000`)

### Installation
```bash
npm install
```

### Development Server
Starts the dev server strictly on port **8082**:
```bash
npm run dev
```
Open [http://localhost:8082](http://localhost:8082) in your browser.

---

## 4. Testing & Verification

The portal includes automated unit, adapter, SSR, and API integration test suites:

### Run Automated Tests
```bash
npm test
```
Executes `tests/portal.test.mjs` using Node's native test runner (`node --experimental-strip-types --test`).
- **Suite 1**: Formatters Unit Tests (currency, range, follower formatting, handle normalization)
- **Suite 2**: Adapters Unit Tests (creator, campaign, location null safety)
- **Suite 3**: Live Portal SSR & E2E Tests (all 9 routes, viewport readiness)
- **Suite 4**: Live API Connectivity & Error Handling Tests (live endpoints, 404/400 handling)

### Verification Commands
```bash
# Typecheck TypeScript (Strict zero-error check)
npm run typecheck

# Lint with ESLint
npm run lint

# Format code with Prettier
npm run format

# Production Build (Client bundle, SSR bundle, and Nitro server output)
npm run build
```

---

## 5. Portal Pages & Routing

All routes are located under `src/routes/`:
- `/`: Hero landing, featured Kerala creators, active brand campaigns, platform highlights.
- `/discover`: Creator catalog with live search, category filtering, city filtering, and pagination.
- `/categories`: Marketplace taxonomies showcasing 17 verticals (Food, Travel, Fashion, Tech, etc.).
- `/campaigns`: Active sponsorship and brand collaboration opportunities for creators.
- `/for-businesses`: Brand onboarding, collaboration workflow, and deep links to Business Portal (8083).
- `/for-influencers`: Creator onboarding, monetization features, and deep links to Creator Hub (8080).
- `/creator/:slug`: Detailed creator showcase (Maya Menon, etc.) with services, packages, dynamic ReportLab media kit download, and collaboration dialog.

---

## 6. API Documentation

Detailed endpoint schemas, request/response payloads, and cURL examples are documented in:
- [docs/KCC_API_CONTRACT.md](file:///d:/project/fadi/3/kerala-creator-collab/docs/KCC_API_CONTRACT.md)

For the comprehensive launch gate verification report, see:
- [TEST_REPORT.md](file:///d:/project/fadi/3/kerala-creator-collab/TEST_REPORT.md)
