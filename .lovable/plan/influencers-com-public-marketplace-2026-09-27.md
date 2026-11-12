# Influencers.com public marketplace

## Goal

Build a complete, polished public marketplace prototype for discovering Kerala creators and public campaign opportunities, with consistent mock data and responsive interactions throughout.

## Pages and navigation

- Add a shared responsive header, mobile menu, and footer.
- Build separate routes for Home, Discover, Categories, Campaigns, For Businesses, For Influencers, and creator profiles.
- Keep authentication/account actions as polished prototype dialogs or calls to action; no real backend or account system.

## Shared marketplace foundation

- Create one typed mock-data layer for Kerala creators, categories, locations, campaigns, services, testimonials, collaborations, and portfolio items.
- Build reusable creator, category, campaign, portfolio, service, testimonial, search, filter, pagination, empty, loading, modal, and drawer components.
- Use consistent creator details everywhere so homepage cards, discovery results, and profile pages always match.

## Visual direction

- Create a light, editorial social-marketplace design with crisp dark type, restrained coral/rose and teal accents, subtle gradients, rounded media, and soft shadows.
- Use high-quality generated creator and Kerala lifestyle imagery, with large portraits and dense visual grids.
- Add purposeful motion for card elevation, saved states, menus, search suggestions, and image loading while respecting reduced-motion preferences.

## Core experiences

- Home: immersive search-led introduction, featured creators, category exploration, Kerala location browsing, campaign highlights, and audience-specific calls to action.
- Discover: working search, filter drawer/sidebar, multi-select filters, sorting, grid/list controls, favorites, empty state, and load-more pagination.
- Categories: visual niche directory with creator counts and route-aware discovery links.
- Campaigns: filterable public opportunities with budget, deliverables, platform, deadline, location, and required creator count.
- Creator profile: profile overview, audience statistics, social links, portfolio media grid, services, collaborations, testimonials, media-kit action, sharing, and similar creators.
- Business and influencer pages: realistic step-by-step workflows, product previews, and conversion actions.
- Search: interactive suggestions for creators, categories, recent searches, and Kerala locations.

## Technical details

- Use TanStack Router routes and search parameters for shareable discovery/filter states.
- Use project design tokens and existing interface primitives, with all visual values centralized in the global design system.
- Add route-specific metadata for every public page.
- Keep all data and behavior frontend-only so APIs can replace the mock data later without redesigning the UI.

## Validation

- Check the full navigation and central discovery/profile flows in the running preview.
- Verify desktop and mobile layouts, interactive states, overflow, console errors, and the latest build status.
