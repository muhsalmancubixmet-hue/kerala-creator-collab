<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Public marketplace content uses `src/data/marketplace.ts` as the single source of truth so a future API can replace mock data without redesigning pages.
- Shared marketplace UI belongs in `src/components/marketplace.tsx`; route files compose these primitives and own only page-specific state.
- Locations, currencies, languages and platforms are config lists in `src/data/marketplace.ts` (global hierarchy Country→Region→District→City→Area; prices formatted via `formatMoney`) — never hardcode a region or currency symbol in components, so the SaaS Manager API can supply them later.
- Maps use Leaflet + OpenStreetMap via `src/components/creator-map.tsx`, lazy-loaded after hydration — Leaflet touches `window` and breaks SSR.
