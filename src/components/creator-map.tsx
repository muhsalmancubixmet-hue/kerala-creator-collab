import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { Creator } from "@/types/marketplace";

type Props = {
  items: Creator[];
  center?: { lat: number; lng: number } | null;
  radiusKm?: number | undefined;
  className?: string | undefined;
};

/** Reusable global creator map (Leaflet + OpenStreetMap). Leaflet is loaded after hydration. */
export function CreatorMap({ items, center, radiusKm, className }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const state = useRef<{
    L?: typeof import("leaflet");
    map?: import("leaflet").Map;
    layer?: import("leaflet").LayerGroup;
    circle?: import("leaflet").Circle;
  }>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      (window as unknown as { L: typeof L }).L = L;
      await import("leaflet.markercluster");
      if (cancelled || !el.current || state.current.map) return;
      const map = L.map(el.current, { worldCopyJump: true, minZoom: 2, zoomControl: true }).setView(
        [20, 20],
        2,
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);
      state.current = { L, map };
      render();
    })();
    return () => {
      cancelled = true;
      state.current.map?.remove();
      state.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const render = () => {
    const { L, map } = state.current;
    if (!L || !map) return;
    state.current.layer?.remove();
    state.current.circle?.remove();
    const cluster = (
      L as unknown as { markerClusterGroup: (o?: object) => import("leaflet").LayerGroup }
    ).markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50 });

    const validItems = items.filter(
      (c) => c.location && typeof c.location.lat === "number" && typeof c.location.lng === "number",
    );

    validItems.forEach((c) => {
      const avatarUrl = c.photo_url || c.sprite;
      const bgStyle = avatarUrl
        ? `background-image:url('${encodeURI(avatarUrl)}');background-size:cover;background-position:${c.position || "50% 50%"};`
        : "background-color:hsl(var(--brand-soft));";

      const icon = L.divIcon({
        className: "creator-pin",
        html: `<span style="${bgStyle}"></span>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      // Construct DOM elements securely to prevent DOM XSS
      const popupContent = document.createElement("a");
      popupContent.href = `/creator/${encodeURIComponent(c.slug)}`;
      popupContent.className = "creator-popup";

      const strongName = document.createElement("strong");
      strongName.textContent = c.name;
      popupContent.appendChild(strongName);

      const smallDetails = document.createElement("small");
      smallDetails.textContent = `${c.category || "Creator"} · ${c.city || c.location?.city || "Kerala"}, ${c.location?.countryCode || "IN"}`;
      popupContent.appendChild(smallDetails);

      const smallStats = document.createElement("small");
      smallStats.textContent = `${c.followersLabel || "0"} followers · ${c.engagement || "0.0"}%`;
      popupContent.appendChild(smallStats);

      L.marker([c.location.lat, c.location.lng], { icon, title: c.name })
        .bindPopup(popupContent)
        .addTo(cluster);
    });

    cluster.addTo(map);
    state.current.layer = cluster;

    if (center && radiusKm) {
      state.current.circle = L.circle([center.lat, center.lng], {
        radius: radiusKm * 1000,
        color: "var(--brand)",
        weight: 1.5,
        fillOpacity: 0.08,
      }).addTo(map);
      map.fitBounds(state.current.circle.getBounds(), { padding: [20, 20] });
    } else if (center) {
      map.setView([center.lat, center.lng], 9);
    } else if (validItems.length) {
      map.fitBounds(L.latLngBounds(validItems.map((c) => [c.location.lat, c.location.lng])), {
        padding: [40, 40],
        maxZoom: 8,
      });
    }
  };

  useEffect(render, [items, center, radiusKm]);

  return (
    <div
      ref={el}
      className={className ?? "h-[480px] w-full overflow-hidden rounded-lg border border-border"}
      role="region"
      aria-label="Creator map"
    />
  );
}
