# Developer Portfolio Slide Prompt

Copy the **Main Prompt** below into Gamma, v0, Figma Make, Claude, ChatGPT, or Cursor to generate a single 16:9 case-study slide for this repo.

Repo: https://github.com/KrupaBele/AI-Travel-Planner  
Live: https://ai-travel-planner-wheat-eta.vercel.app

---

## Main Prompt

```
You are a senior product designer and art director creating ONE cinematic 16:9 developer portfolio case-study slide for a hiring manager, recruiter, or design-minded engineer. This is not a generic project card. It should feel like a product launch keynote frame: confident, specific, and scannable in 8 seconds.

PROJECT
Name: AI Travel Planner
One-line: Personalized multi-day travel itineraries generated with Groq Llama 3.3, then mapped onto a live OpenStreetMap view.
Author: Krupa Bele
Role on the project: Sole full-stack builder — product, UI, LLM prompting, mapping, and deployment.
GitHub: https://github.com/KrupaBele/AI-Travel-Planner
Live: https://ai-travel-planner-wheat-eta.vercel.app

PROBLEM
Planning a trip still means bouncing between blogs, maps, hotel lists, and generic AI chat. Travelers want a destination-aware plan that matches budget, trip length, travel style, and party size — plus a map of real places, not a wall of text.

SOLUTION
A Next.js 16 / React 19 web app. The user lands, fills a trip brief, and Groq (Llama 3.3 70B Versatile) returns structured JSON: day-by-day morning / afternoon / evening plans, food, tips, key landmarks, and hotels. Leaflet then geocodes the destination and up to six real landmarks via OpenStreetMap Nominatim, and plots them against the user’s current location.

USER FLOW
1. Landing — sky-to-indigo hero, “Plan My Trip”
2. Form — destination, days (1–30), travelers (1–50), budget (Low / Medium / Luxury), style (Adventure / Relaxing / Culture / Food), with validation
3. Loading — AI is generating the itinerary
4. Result — map + day cards + food + tips + hotels; copy to clipboard or download as .txt
5. More Hotels — second Groq call returns 3 additional hotels, excluding names already shown

FEATURE HIGHLIGHTS (pick 4–6 for the slide, not all as equal bullets)
- Groq Llama 3.3 70B structured itinerary generation (JSON-only system + user prompt)
- Interactive Leaflet map: current location, destination pin, key-place pins, Nominatim geocoding with 1 req/sec rate limit
- Day-by-day morning / afternoon / evening activity cards
- Food suggestions and practical travel tips tailored to style and budget
- Hotel recommendations by tier (Budget, Hostel, Mid-range, Boutique, Luxury) with price range, description, highlights, and “load more”
- Copy itinerary / download as destination-named .txt
- Client-side form validation and error recovery back to the form

TECH STACK (render as a compact badge row, not a paragraph)
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Groq SDK · Llama 3.3 70B · Leaflet · React-Leaflet · OpenStreetMap Nominatim · Geist · Vercel

ARCHITECTURE NOTES (one small callout, not a diagram dump)
- MapView is dynamically imported with SSR disabled because Leaflet needs the browser
- LLM output is cleaned of markdown fences and parsed as typed Itinerary JSON
- Groq runs from the browser via NEXT_PUBLIC_GROQ_API_KEY (groq-sdk, dangerouslyAllowBrowser)
- Hotel pagination sends the existing hotel name list so the model does not repeat suggestions

VISUAL DIRECTION — match the product, do not invent a dark cyber theme
- Canvas: 1920×1080, 16:9, single slide, no extra pages
- Palette: sky-100 / blue-50 / indigo-100 background; slate-800 headlines; sky-500 → indigo-600 gradient accent; white/70 glass cards; amber morning, sky afternoon, indigo evening; violet map/hotels; orange-rose food; emerald tips
- Atmosphere: travel, light, airy, glassmorphism, soft sky/indigo orbs, generous whitespace. Geist or a clean geometric sans. No neon, no brutalist black, no emoji wallpaper
- Photography/illustration: one large UI mockup of the result screen (map on top, day cards below) as the hero visual. Optional small landing-page thumbnail. If you cannot screenshot the live app, illustrate a plausible UI that matches the described layout
- Typography hierarchy: tiny kicker “CASE STUDY / FULL-STACK” → huge product name → one sentence of proof → feature chips → stack badges → links

LAYOUT (lock this composition)
Left 42%:
  - Kicker: CASE STUDY
  - Title: AI Travel Planner
  - Subtitle: From a 5-field trip brief to a mapped, day-by-day itinerary — generated with Groq, plotted on OpenStreetMap.
  - 4 feature chips with short labels (AI itinerary, Live map, Hotels by budget, Export plan)
  - Stack badge row
  - Footer meta: Built by Krupa Bele · Next.js 16 · Groq Llama 3.3 · Leaflet
  - Two text links: GitHub · Live demo

Right 58%:
  - Large device/browser frame of the itinerary result (map + Day 1 cards). This is the visual hero. It must occupy the most pixels on the slide.
  - Tiny floating stat pills on the mockup, e.g. “JSON itinerary”, “Nominatim pins”, “1–30 days”

Copy rules
- No lorem ipsum, no “innovative solution”, no “leveraging cutting-edge AI”
- Prefer concrete nouns: Groq, Llama 3.3, Nominatim, Leaflet, JSON itinerary
- Max 1 headline, 1 supporting sentence, 4 chips, 1 stack row
- Recruiters should understand the product without reading the repo

Output
Produce a finished 16:9 slide (HTML/CSS or high-fidelity design). Do not explain the design. Do not add speaker notes unless asked. Export-ready, presentation-quality, single frame.
```

---

## Optional: 4-slide mini deck

Use this only if you want a short case-study deck instead of one frame.

```
Create a 4-slide 16:9 case-study deck for AI Travel Planner (https://github.com/KrupaBele/AI-Travel-Planner). Same visual language as the product: light sky-to-indigo glass UI, Geist, no dark cyber look.

Slide 1 — Cover
AI Travel Planner. “A trip brief in. A mapped itinerary out.” Built by Krupa Bele. Next.js 16 · Groq Llama 3.3 · Leaflet.

Slide 2 — Product
Show the flow: Landing → Form (destination, days, travelers, budget, style) → Groq JSON itinerary → map + days + food + tips + hotels. Highlight copy/download and More Hotels.

Slide 3 — Build
Architecture callouts: App Router + React 19; Groq structured JSON with typed Itinerary; dynamic SSR-off MapView; Nominatim geocode of destination + 6 key places at 1 req/sec; geolocation pin vs destination pin vs place pins.

Slide 4 — Outcome
What to remember: end-to-end AI travel product, not a chat wrapper. Stack badges. GitHub + live URL. “Sole builder — product, prompt, map, UI.”
```

---

## Optional: image-generation prompt

Use this in Midjourney, Ideogram, or Flux if you only need a still.

```
Cinematic 16:9 developer portfolio case-study slide, light travel-app aesthetic, sky-blue to indigo glassmorphism, soft blurred orbs, lots of whitespace. Left side: large title “AI Travel Planner”, subtitle “Groq Llama 3.3 itineraries mapped on OpenStreetMap”, four small feature chips, tech badges (Next.js, React, TypeScript, Tailwind, Groq, Leaflet). Right side: oversized browser mockup of a travel itinerary result — Leaflet map with red destination pin and green place pins, then Day 1 morning/afternoon/evening cards in amber, sky, and indigo. Footer: Krupa Bele · GitHub. Clean Geist-like sans, no neon, no clutter, no unreadable fake text, photoreal UI mockup, presentation keynote quality --ar 16:9
```
