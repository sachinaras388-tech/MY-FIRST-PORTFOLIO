# Irappa Mali — Developer Portfolio

A React, TypeScript, and Vite portfolio for Irappa Mali, a BCA student at KLE,
Mahalingpur. It presents a growing skills toolkit, eight projects with clear
development statuses, hackathon participation, and a mailto-based contact form.
The hero opens with a first-person flight through a dark chrome tunnel: the
camera banks past brief skill, project, and ledger previews before settling on
the amber-lit monolith. The flight HUD and camera motion respect reduced-motion
preferences. The remaining portfolio content is preserved.
The About section uses an optimized, color-adjusted portrait at
`public/images/irappa-mali-portrait.jpg`.

## Run

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Personal details

Edit **`src/config/site.ts`** to set the display name, email, social profile
links, and theme colors. The contact form validates its fields and opens a
pre-filled email in the visitor's default mail app. Add your email address to
`site.email` to activate it; no email service credentials are required.

## Projects and skills

Project details, stack labels, categories, development status, and verified
demo URLs live in **`src/data/portfolio.ts`**. Set a project's `liveUrl` only
when a public demo is available. Project rows support category filters and open
accessible detail dialogs.

The same file contains the skills and interest cards. Update those arrays as
your experience changes. Do not list awards, certifications, or social
accounts until you have details to add.

## Main structure

```
src/
  App.tsx                    ← portfolio sections, filtering, dialog, contact
  config/site.ts             ← personal details and theme
  data/portfolio.ts          ← skills, interests, and project content
  components/
    hero/Hero.tsx            ← responsive navigation and hero
    Scene.tsx                ← R3F environment, post-processing, scroll and pointer
    scene/HeroMonolith.tsx   ← FPV tunnel choreography and black-chrome monolith
    scene/FlightHud.tsx      ← intro telemetry overlay
    ui/                      ← loader, cursor, scroll progress
  styles/index.css           ← responsive theme and component styles
```
# MY-FIRST-PORTFOLIO
# MY-FIRST-PORTFOLIO
