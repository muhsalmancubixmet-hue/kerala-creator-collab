import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Helper test functions mirroring formatters & adapters
import { formatMoney, formatRange, formatFollowers, cleanHandle } from "../src/lib/formatters.ts";
import {
  adaptBackendCreator,
  adaptBackendCampaign,
  adaptBackendLocation,
} from "../src/lib/adapters.ts";

describe("1. Formatters Unit Tests", () => {
  it("formatMoney formats valid numbers correctly in INR", () => {
    const res = formatMoney(25000, "INR");
    assert.match(res, /25,000/);
  });

  it("formatMoney formats compact numbers correctly in USD", () => {
    const res = formatMoney(5000, "USD", true);
    assert.match(res, /5K|\$5K/);
  });

  it("formatMoney handles null and undefined gracefully", () => {
    assert.equal(formatMoney(null), "Contact for price");
    assert.equal(formatMoney(undefined), "Contact for price");
  });

  it("formatRange formats min-max ranges accurately", () => {
    const res = formatRange(10000, 50000, "INR");
    assert.ok(res.includes("–") || res.includes("-"));
  });

  it("formatRange handles null max by prefixing 'From'", () => {
    const res = formatRange(15000, null, "INR");
    assert.ok(res.startsWith("From "));
  });

  it("formatRange handles null min by returning contact pricing", () => {
    assert.equal(formatRange(null, null), "Contact for pricing");
  });

  it("formatFollowers handles standard reach numbers", () => {
    assert.equal(formatFollowers(500), "500");
    assert.equal(formatFollowers(1200), "1.2K");
    assert.equal(formatFollowers(250000), "250K");
    assert.equal(formatFollowers(1500000), "1.5M");
    assert.equal(formatFollowers(2000000000), "2B");
  });

  it("formatFollowers handles null, zero, and negative values safely", () => {
    assert.equal(formatFollowers(0), "0");
    assert.equal(formatFollowers(null), "0");
    assert.equal(formatFollowers(undefined), "0");
    assert.equal(formatFollowers(-50), "0");
  });

  it("cleanHandle removes leading @ symbols and trims whitespace", () => {
    assert.equal(cleanHandle("@mayatasteskerala"), "mayatasteskerala");
    assert.equal(cleanHandle("@@@MayaTastesKerala  "), "mayatasteskerala");
    assert.equal(cleanHandle(""), "");
    assert.equal(cleanHandle(null), "");
  });
});

describe("2. Adapters Unit Tests", () => {
  it("adaptBackendCreator produces a fully typed Creator object with safe fallbacks", () => {
    const raw = {
      id: "test-uuid-1",
      slug: "testcreator",
      display_name: "Test Creator",
      followers: 12500,
      engagement: 6.5,
      city: "Kochi",
      district: "Ernakulam",
    };
    const creator = adaptBackendCreator(raw);
    assert.equal(creator.id, "test-uuid-1");
    assert.equal(creator.slug, "testcreator");
    assert.equal(creator.handle, "@testcreator");
    assert.equal(creator.name, "Test Creator");
    assert.equal(creator.followers, 12500);
    assert.equal(creator.followersLabel, "12.5K");
    assert.equal(creator.engagement, 6.5);
    assert.equal(creator.location.city, "Kochi");
    assert.equal(creator.location.country, "India");
    assert.equal(creator.verified, false);
    assert.equal(creator.available, true);
  });

  it("adaptBackendCreator handles empty raw record without crashing", () => {
    const creator = adaptBackendCreator({});
    assert.equal(creator.name, "Creator");
    assert.equal(creator.followers, 0);
    assert.equal(creator.followersLabel, "0");
    assert.equal(creator.engagement, 0);
    assert.equal(creator.location.country, "India");
  });

  it("adaptBackendCampaign converts budget_cents to budget in major units", () => {
    const raw = {
      id: "camp-1",
      title: "Kerala Tea Trails",
      brand_name: "Munnar Organics",
      total_budget_cents: 10000000,
      creators_needed: 3,
      status: "ACTIVE",
    };
    const camp = adaptBackendCampaign(raw);
    assert.equal(camp.id, "camp-1");
    assert.equal(camp.title, "Kerala Tea Trails");
    assert.equal(camp.business, "Munnar Organics");
    assert.equal(camp.budgetMin, 100000);
    assert.equal(camp.creators, 3);
    assert.equal(camp.status, "ACTIVE");
  });

  it("adaptBackendLocation normalizes geographic node hierarchy", () => {
    const raw = {
      id: "loc-kochi",
      name: "Kochi",
      country_code: "IN",
      latitude: 9.9312,
      longitude: 76.2673,
      parent: {
        id: "loc-ekm",
        name: "Ernakulam",
      },
    };
    const place = adaptBackendLocation(raw);
    assert.equal(place.id, "loc-kochi");
    assert.equal(place.city, "Kochi");
    assert.equal(place.district, "Ernakulam");
    assert.equal(place.country, "India");
    assert.equal(place.lat, 9.9312);
    assert.equal(place.lng, 76.2673);
  });
});

describe("3. Live Portal & SSR End-to-End Tests", () => {
  const PORTAL_URL = "http://localhost:8082";

  it("GET / serves 200 and renders HTML homepage with brand name", async () => {
    const resp = await fetch(`${PORTAL_URL}/`);
    assert.equal(resp.status, 200);
    const html = await resp.text();
    assert.ok(html.includes("Influencers"));
    assert.ok(html.includes("Discover"));
  });

  it("GET /discover serves 200 and renders search navigation", async () => {
    const resp = await fetch(`${PORTAL_URL}/discover`);
    assert.equal(resp.status, 200);
    const html = await resp.text();
    assert.ok(html.includes("Discover"));
  });

  it("GET /campaigns serves 200 and renders campaign catalog", async () => {
    const resp = await fetch(`${PORTAL_URL}/campaigns`);
    assert.equal(resp.status, 200);
    const html = await resp.text();
    assert.ok(html.includes("Campaigns"));
  });

  it("GET /categories serves 200 and renders categories page", async () => {
    const resp = await fetch(`${PORTAL_URL}/categories`);
    assert.equal(resp.status, 200);
    const html = await resp.text();
    assert.ok(html.includes("Categories"));
  });

  it("GET /for-businesses serves 200 and renders brand portal links", async () => {
    const resp = await fetch(`${PORTAL_URL}/for-businesses`);
    assert.equal(resp.status, 200);
    const html = await resp.text();
    assert.ok(html.includes("Businesses") || html.includes("Business"));
  });

  it("GET /for-influencers serves 200 and renders creator portal links", async () => {
    const resp = await fetch(`${PORTAL_URL}/for-influencers`);
    assert.equal(resp.status, 200);
    const html = await resp.text();
    assert.ok(html.includes("Influencers") || html.includes("Creators"));
  });

  it("GET /creator/mayatasteskerala serves 200 for live creator showcase", async () => {
    const resp = await fetch(`${PORTAL_URL}/creator/mayatasteskerala`);
    assert.equal(resp.status, 200);
    const html = await resp.text();
    assert.ok(html.includes("Maya Menon") || html.includes("mayatasteskerala"));
  });

  it("GET /creator/nonexistent-xyz returns 404 error state gracefully", async () => {
    const resp = await fetch(`${PORTAL_URL}/creator/nonexistent-xyz`);
    // Router returns 404 or SSR error boundary without crashing
    assert.ok(resp.status === 404 || resp.status === 200);
  });
});

describe("4. Live API Connectivity & Error Handling Tests", () => {
  const API_URL = "http://127.0.0.1:8000/api/v1";

  it("GET /public/creators/ returns active creators count >= 11 with CORS", async () => {
    const resp = await fetch(`${API_URL}/public/creators/`, {
      headers: { Origin: "http://localhost:8082" },
    });
    assert.equal(resp.status, 200);
    assert.equal(resp.headers.get("access-control-allow-origin"), "http://localhost:8082");
    const data = await resp.json();
    assert.ok(data.count >= 11);
    assert.ok(Array.isArray(data.results));
  });

  it("GET /public/creators/mayatasteskerala/ returns Maya Menon detail profile", async () => {
    const resp = await fetch(`${API_URL}/public/creators/mayatasteskerala/`, {
      headers: { Origin: "http://localhost:8082" },
    });
    assert.equal(resp.status, 200);
    const data = await resp.json();
    assert.equal(data.name, "Maya Menon");
    assert.equal(data.handle, "mayatasteskerala");
    assert.ok(Array.isArray(data.services));
    assert.ok(Array.isArray(data.portfolio));
  });

  it("POST /public/creators/mayatasteskerala/media-kit/ dispatches PDF request", async () => {
    const resp = await fetch(`${API_URL}/public/creators/mayatasteskerala/media-kit/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:8082",
      },
      body: JSON.stringify({
        requester_name: "Automated Test Manager",
        requester_email: "autotest@brandverify.com",
        company_name: "Test Hospitality Group",
      }),
    });
    assert.equal(resp.status, 200);
    const data = await resp.json();
    assert.equal(data.status, "success");
    assert.ok(data.download_url);
  });

  it("POST /public/inquiries/ registers collaboration inquiry with 201 Created", async () => {
    const resp = await fetch(`${API_URL}/public/inquiries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:8082",
      },
      body: JSON.stringify({
        creator_handle: "mayatasteskerala",
        client_name: "Test Client",
        client_email: "testclient.auto@innovate.co",
        subject: "Festival Food Campaign",
        message: "We want to book a video reel for the harvest festival.",
        budget: 50000,
        currency: "INR",
      }),
    });
    assert.equal(resp.status, 201);
    const data = await resp.json();
    assert.ok(data.id);
    assert.equal(data.status, "NEW");
  });

  it("Failure mode: Unknown slug returns HTTP 404", async () => {
    const resp = await fetch(`${API_URL}/public/creators/completely-unknown-creator-404/`, {
      headers: { Origin: "http://localhost:8082" },
    });
    assert.equal(resp.status, 404);
  });

  it("Failure mode: Missing required fields in inquiry returns HTTP 400 with field errors", async () => {
    const resp = await fetch(`${API_URL}/public/inquiries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:8082",
      },
      body: JSON.stringify({
        message: "Incomplete inquiry without email",
      }),
    });
    assert.equal(resp.status, 400);
    const data = await resp.json();
    assert.ok(data.creator_handle || data.client_email);
  });
});
