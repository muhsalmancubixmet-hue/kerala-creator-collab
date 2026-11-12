# Kerala Creator Connect

Build a production-quality, highly attractive public marketplace website for a SaaS platform called **Influencers.com**.

The platform connects influencers/creators with businesses looking for influencers for promotions, collaborations, campaigns, events, products, and local marketing.

This is the **public-facing website**, not the influencer dashboard.

## Design Direction

Create a premium, modern social-media-inspired experience strongly influenced by the visual feel and usability of Instagram, but DO NOT copy Instagram's exact UI, branding, logo, or proprietary design.

Use:

- Clean white/light interface
- Black/dark typography
- Subtle gradients
- Rounded cards
- High-quality creator imagery
- Large profile photos
- Attractive media grids
- Smooth hover interactions
- Elegant shadows
- Modern typography
- Minimal but expressive accent colors
- Instagram-like visual richness
- Mobile-first responsive design

The website should feel like a combination of:

- Creator discovery platform
- Social profile directory
- Influencer marketplace
- Modern SaaS product

Avoid making it look like a generic corporate SaaS dashboard.

## Important

Use realistic **mock data based on Kerala influencers/creators** throughout the entire application.

Create enough mock data to make the marketplace feel populated and realistic.

Do not ask me to provide the mock data. Generate appropriate mock data yourself.

Use realistic Kerala:

- Names
- Cities
- Districts
- Languages
- Creator categories
- Social platforms
- Follower counts
- Engagement statistics
- Services
- Portfolio content
- Business collaboration examples

Do not use real people's private information.

---

# Navigation

Create a responsive navigation bar:

Logo:
**Influencers.com**

Navigation:

- Discover
- Categories
- Campaigns
- For Businesses
- For Influencers

Right side:

- Log in
- Join as Influencer
- For Business

On mobile, use a clean mobile navigation menu.

---

# Homepage

Create a visually impressive homepage.

Hero section:

Headline around the concept:

**Find the right influencer for your brand**

Supporting text explaining that businesses can discover creators based on niche, location, audience, platform, and services.

Search interface:

- Search creators
- Category
- Location
- Platform

Primary CTA:
**Discover Influencers**

Secondary CTA:
**Join as Influencer**

Below the hero, show a visually rich creator discovery section.

---

# Featured Influencers

Create a horizontal/scrollable creator section containing attractive creator cards.

Each creator card should contain:

- Profile image
- Name
- Verification indicator where appropriate
- Category
- Location
- Main social platforms
- Follower count
- Engagement rate
- Short description
- View Profile button

Make the cards visually attractive and image-focused.

---

# Discover Influencers Page

Create a dedicated discovery experience.

Desktop layout:

Left:
Filter sidebar

Right:
Creator results

Filters:

- Search
- Category
- Location
- District
- Language
- Social platform
- Followers
- Engagement rate
- Services
- Price range
- Availability
- Verified creators

Results should support:

- Grid view
- Optional compact list view

Include sorting:

- Relevance
- Most followers
- Highest engagement
- Recently joined

Add pagination or load-more functionality.

---

# Categories

Create an attractive category browsing page.

Categories should include realistic influencer niches such as:

- Food
- Travel
- Fashion
- Beauty
- Lifestyle
- Fitness
- Technology
- Gaming
- Education
- Photography
- Comedy
- Entertainment
- Parenting
- Business
- Local Creators

Each category should have visual cards and creator counts.

---

# Location Discovery

Create a Kerala-focused location browsing section.

Allow users to discover creators by:

- Kochi
- Kozhikode
- Thiruvananthapuram
- Thrissur
- Malappuram
- Kannur
- Kottayam
- Kollam
- Alappuzha
- Palakkad
- Wayanad
- Idukki
- Kasaragod
- Pathanamthitta

The UI should make location discovery visually appealing rather than just a dropdown.

---

# Influencer Profile Page

Create a premium public creator profile page.

Structure:

Top profile section:

- Large profile photo
- Creator name
- Verification status
- Category
- Location
- Bio
- Social links
- Contact button
- Request Collaboration button

Stats:

- Followers
- Engagement
- Platforms
- Audience information where available

Portfolio:
Create a beautiful Instagram-inspired media grid.

Support:

- Images
- Videos
- Reels/short-form content
- Campaign work

Services section:
Show services offered by the creator.

Example structure:

Service name
Description
Starting price / Contact for price

Also include:

- Previous collaborations
- Testimonials
- Media kit button
- Similar creators
- Contact/inquiry CTA

The profile should feel like a professional creator website combined with a marketplace profile.

---

# Campaigns / Requirements

Create a public campaign discovery page.

Businesses can publish influencer requirements.

Each campaign card should show:

- Campaign title
- Business/category
- Location
- Required platform
- Creator category
- Budget indicator
- Deliverables
- Deadline
- Number of influencers required

CTA:
**View Campaign**

Allow influencers to discover opportunities from this section.

---

# For Businesses

Create a landing page explaining how businesses use Influencers.com.

Sections:

1. Find creators
2. Filter creators
3. Shortlist creators
4. Contact creators
5. Create campaigns
6. Manage collaborations

Include CTA:

**Find Influencers**

and

**Create Business Account**

Show realistic mock examples of discovery and campaign workflows.

---

# For Influencers

Create a landing page explaining the creator side.

Explain that influencers can:

- Create a professional profile
- Build a portfolio
- Create their own website
- Add social media accounts
- Showcase services
- Share a media kit
- Get discovered by businesses
- Receive collaboration opportunities

CTA:

**Create Your Influencer Profile**

Include a visual preview of what a creator website could look like.

---

# Search Experience

Make search feel central to the platform.

Add:

- Search suggestions
- Category suggestions
- Creator suggestions
- Recent searches
- Popular categories
- Location suggestions

Use attractive dropdowns and micro-interactions.

---

# Responsive Design

The entire website must be fully responsive.

Desktop:

- Wide marketplace layout
- Large creator grids
- Advanced filtering

Tablet:

- Adaptive grid
- Collapsible filters

Mobile:

- Bottom-friendly interactions
- Compact filters
- Swipeable creator cards
- Instagram-inspired media presentation
- Sticky search/filter controls where appropriate

---

# UX Details

Add polished interactions:

- Hover animations
- Card lift effects
- Smooth transitions
- Image loading states
- Skeleton loaders
- Empty states
- Toast notifications
- Favorite/save creator interaction
- Share profile interaction
- Copy profile link interaction

Do not overuse animations.

The overall feeling should be **premium, social, modern, visual, and trustworthy**.

---

# Mock Data Requirements

Populate every relevant page with realistic Kerala-focused mock data.

The mock data should be internally consistent.

For example, the same creator shown on the homepage should have the same:

- Name
- Profile image
- Category
- Followers
- Location
- Portfolio
- Services

when opened from the profile page.

Create enough data so the application does not feel empty.

Use placeholder/stock-style creator imagery where necessary.

---

# Technical UI Structure

Build the frontend with reusable components.

Important reusable components:

- CreatorCard
- CreatorGrid
- CreatorProfileHeader
- SocialPlatformBadge
- FollowerStats
- CategoryCard
- CampaignCard
- FilterPanel
- SearchBar
- PortfolioGrid
- ServiceCard
- TestimonialCard
- Navbar
- Footer
- Modal
- Drawer
- Pagination
- EmptyState
- LoadingSkeleton

Use mock data from a centralized data layer rather than hardcoding the same information into multiple components.

The application should be structured so that the mock data can later be replaced by APIs from a Django backend without redesigning the frontend.

Do not implement the real backend yet.

Focus on creating a polished, complete frontend prototype with realistic navigation and interactions.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5a336bff-faf6-43fd-ad67-f35b898d7e0a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
