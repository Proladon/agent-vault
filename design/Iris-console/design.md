# Iris Console — Design System

> **Theme: Iris** — neutral slate surfaces under a faint indigo/iris halo (the accent
> identity is Discord-blurple `#5865F2`, which surfaces only as a soft glow and in
> dark-mode charts). Alternatives: **Slate Halo**, **Periwinkle**.
>
> A cross-project, reusable visual design system, written as design tokens +
> component recipes so an AI agent can rebuild this look without reading the
> original source.
>
> **Style in a sentence:** clean, modern SaaS admin console — monochrome neutral
> grays as the dominant palette, near-black/near-white "primary", thin hairline
> borders, soft `shadow-sm` cards, pill badges, restrained ~150–300ms motion, a
> subtle indigo radial glow on the page background, full light + dark themes.
> Built on **shadcn-vue ("new-york" style, `neutral` base)** + **Tailwind CSS v4**.

---

## 1. Design Principles

- **Token-driven, OKLCH neutral spine.** Every surface/text/border color is an
  OKLCH grayscale token (`--background`, `--foreground`, `--card`, `--border`,
  `--muted`, `--primary`…). Components reference the Tailwind semantic aliases
  (`bg-background`, `text-muted-foreground`, `border-border`), never raw hex.
- **Monochrome first, accent as a whisper.** The applied palette is essentially
  grayscale. "Primary" is near-black in light mode / near-white in dark mode —
  not a color. Indigo (`#5865F2`) appears only as a soft body glow and as the
  dark-mode `chart-1` / `sidebar-primary`. Resist adding a loud brand color.
- **Hairline borders + soft elevation.** 1px `--border` everywhere; cards lift with
  `shadow-sm`, inputs/outline buttons with `shadow-xs`. No heavy drop shadows.
- **One radius language.** Everything derives from `--radius: 0.625rem` (10px):
  inputs/buttons `rounded-md`, cards/nav items `rounded-xl`, pills `rounded-full`.
- **Unified focus ring.** Every interactive control focuses the same way:
  `focus-visible:border-ring` + `focus-visible:ring-ring/50 ring-[3px]`. Invalid
  state swaps the ring to `destructive`.
- **Soft tints via opacity, not new tokens.** Status/hover backgrounds are the
  base color at low alpha (`bg-emerald-500/10`, `border-emerald-500/30`, `bg-primary/12`),
  or `color-mix(... 14%, transparent)` in the legacy layer — never a bespoke variable.
- **Faithful note:** a second, hand-rolled blurple token set exists in source
  (`--bg-base`, `--accent-hover`, `--text-primary`…) but is **not wired into the
  Tailwind theme and is unused** by components. Treat §3.3 as optional/legacy.

## 2. Design Tokens

The heart of the theme. Paste this whole block. It is Tailwind v4 (`@theme inline`
maps CSS vars → utility colors) + shadcn-vue's `:root` / `.dark` token sets.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* Map design tokens → Tailwind utility colors (bg-*, text-*, border-*, ring-*) */
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent-surface);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-heading: var(--font-sans);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
}

:root {
  --radius: 0.625rem;                          /* 10px — the only radius anchor */

  /* surfaces */
  --background: oklch(1 0 0);                  /* pure white */
  --foreground: oklch(0.145 0 0);              /* near-black ink */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);

  /* primary = near-black (monochrome, NOT a color) */
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);        /* mid gray */

  /* "accent" surface = a barely-tinted cool gray (hover/selected backgrounds) */
  --accent-surface: oklch(0.954 0.007 247.896);
  --accent-foreground: oklch(0.205 0 0);

  --destructive: oklch(0.577 0.245 27.325);    /* the only wired semantic color */

  --border: oklch(0.922 0 0);                  /* hairline */
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);                     /* focus ring base */

  /* sidebar (own token namespace; near-white in light) */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);

  /* charts (warm/categorical in light) */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);

  /* layout dimensions */
  --sidebar-width: 264px;
  --sidebar-collapsed-width: 72px;
  --header-height: 56px;

  color-scheme: light;
  font-family: 'Geist', 'IBM Plex Sans', 'Noto Sans TC', 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

.dark {
  --background: oklch(0.145 0 0);              /* near-black */
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);                 /* near-white in dark */
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent-surface: oklch(0.278 0.014 259.73);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);                /* white at 10% alpha */
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);

  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);   /* indigo surfaces here in dark */
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);

  --chart-1: oklch(0.488 0.243 264.376);       /* indigo */
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);

  color-scheme: dark;
}
```

### Quick reference

| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | page base (under the glow) |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | body ink |
| `--card` / `--popover` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | panels, menus, dialogs |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | solid buttons, active nav (mono) |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | text on primary |
| `--secondary` / `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | quiet fills, muted bg |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | secondary/label text |
| `--accent` (`--accent-surface`) | `oklch(0.954 0.007 248)` | `oklch(0.278 0.014 260)` | hover/selected surface |
| `--border` / `--input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10–15%)` | hairlines, field borders |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | focus ring |
| `--destructive` | `oklch(0.577 0.245 27)` | `oklch(0.704 0.191 22)` | danger/delete |
| `--sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264)` | active item (indigo in dark) |
| `--radius` | `0.625rem` | — | radius anchor (10px) |

## 3. Semantic & Category Colors

### 3.1 Wired semantic
Only **destructive** lives in the OKLCH token set. Apply via `bg-destructive`,
`text-destructive`, and the invalid-state ring `aria-invalid:ring-destructive/20`
(`/40` in dark). There is intentionally **no** wired success/warning/info token.

### 3.2 Status colors — the real convention (Tailwind palette + alpha)
Success/warning/danger statuses are built inline from Tailwind's `emerald` /
`amber` / `rose` (and `slate` for offline), using the **`/10` soft fill + `/30`
border + `-600/-300` text** formula. This is the pattern to copy:

```ts
// status pill: dot + soft-tinted outline badge
const STATUS = {
  online: { label: 'Online', dot: 'bg-emerald-500',
            badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
  idle:   { label: 'Idle',   dot: 'bg-amber-500',
            badge: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300' },
  dnd:    { label: 'Busy',   dot: 'bg-rose-500',
            badge: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300' },
  offline:{ label: 'Offline',dot: 'bg-slate-400',
            badge: 'border-border bg-muted text-muted-foreground' },
}
```
Rule: **soft background = color `/10`, border = color `/30`, text = color `-600`
(light) → `-300` (dark)**. Dot is the solid `-500`.

### 3.3 Legacy blurple layer (defined in source, **unused** — optional)
`style.css` also declares a hand-authored indigo brand set. It is **not** exposed
as Tailwind utilities and no component references it; it only feeds the legacy
plain-CSS classes in §8.5. Keep it only if you want that hand-rolled layer.

```css
:root {
  --accent: oklch(0.97 0 0);            /* NOTE: grey, not blurple (legacy quirk) */
  --accent-hover: #4752c4;              /* blurple-dark */
  --accent-light: #6d78f7;
  --bg-base: #f6f7fb;  --bg-sidebar: #eef2ff;  --bg-card: #ffffff;
  --bg-hover: rgba(88, 101, 242, 0.08);          /* #5865F2 @ 8% — the iris glow */
  --border-strong: rgba(92, 108, 133, 0.22);
  --text-primary: #141b34; --text-secondary: #56627a; --text-muted: #7b869e;
  --success: #16a34a;  --warning: #d29922;  --danger: #dc2626;
}
.dark {
  --bg-base: #0b1020;  --bg-sidebar: #11182d;  --bg-card: #171f36;
  --bg-hover: rgba(255,255,255,0.06);  --border-strong: rgba(255,255,255,0.16);
  --text-primary: #ecf2ff; --text-secondary: #99a7c2; --text-muted: #66748f;
  --success: #3fb950;  --warning: #d29922;  --danger: #f85149;
}
```
The brand color (`#5865F2`, Discord blurple) is the theme's identity even though
it renders only faintly — see the body glow in §8.1.

## 4. Typography

| Aspect | Value |
|---|---|
| Active font stack | `'Geist', 'IBM Plex Sans', 'Noto Sans TC', 'Segoe UI', sans-serif` |
| CJK | `'Noto Sans TC'` (Traditional Chinese — UI mixes zh-TW + English) |
| Also loaded | **Inter** 400/500/600/700 via Google Fonts (shadcn default; imported but not first in the stack) |
| Base size / line-height | `14px` / `1.5` (set on `:root`) |
| Smoothing | `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; font-synthesis: none` |

Weight & size ladder (as used in chrome):

| Role | Classes | Notes |
|---|---|---|
| Page / card title | `text-sm`–`text-base font-semibold` | sidebar collapses to `text-sm` |
| Section eyebrow | `text-[11px] font-semibold uppercase tracking-[0.18em] text-…/50` | sidebar group labels |
| Header eyebrow | `text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground` | over the page title |
| Body / control | `text-sm` (14px) | buttons `font-medium`, inputs `text-base md:text-sm` |
| Badge / micro | `text-xs` (badges) · `text-[10px]` (counts) | `font-medium`/`font-semibold` |
| Legacy `view-header h2` | `font-size: 1.5rem; line-height: 1.15` | the one hand-CSS heading |

Letter-spacing convention: **uppercase eyebrows always get wide tracking**
(`tracking-[0.18em]`, legacy `0.06em` on table `th`). Body text uses default tracking.

## 5. Shape, Spacing & Sizing

**Radius** (all from `--radius: 0.625rem`):

| Utility | Value | Used for |
|---|---|---|
| `rounded-md` (`--radius-md`) | `calc(r - 2px)` ≈ 8px | buttons, inputs, menu items |
| `rounded-lg` (`--radius-lg`) | `0.625rem` (10px) | small surfaces |
| `rounded-xl` (`--radius-xl`) | `calc(r + 4px)` ≈ 14px | **cards, nav items, status chips, avatars-box** |
| `rounded-full` | 999px | badges, status pills, icon avatars |
| `--radius-sm` | `calc(r - 4px)` ≈ 6px | tight inner elements |

**Borders:** 1px solid `--border` is the default on `*` (set globally). Dark mode
borders are white at 10–15% alpha. There is no 2px/“strong” border in practice.

**Spacing rhythm:** Tailwind 4px scale. Recurring values: page padding
`px-4 py-5 sm:px-6 lg:px-8/10`; content stack `gap-6`; card inner `gap-6 py-6`;
nav item `px-3 py-2.5`; field gap `gap-1.5`/`0.375rem`.

**Key fixed dimensions:**

| Token / value | Meaning |
|---|---|
| `--header-height: 56px` (`h-14`) | sticky top bar |
| `--sidebar-width: 264px` | expanded sidebar (`lg:w-[264px]`) |
| `--sidebar-collapsed-width: 72px` | collapsed rail (`lg:w-[72px]`) |
| `max-w-7xl` (80rem / 1280px) | centered content + header max width |
| Control height | `h-9` default · `h-8` sm · `h-10` lg (buttons/inputs) |
| Icon size | `size-4` (16px) default; `size-5` brand mark; badge svg `size-3` |
| Breakpoints | Tailwind defaults; **`lg` = 1024px** is the desktop/sidebar pivot, `sm` = 640px |

## 6. Elevation

Uses Tailwind's shadow scale — no custom shadow ladder defined.

| Level | Token | Where |
|---|---|---|
| Flat hairline | `border` only | tables, nested nav |
| Raised | `shadow-xs` | inputs, outline/secondary buttons |
| Card | `shadow-sm` | cards, active sidebar item, popovers |
| Sidebar rail | `border-r` (no shadow) | relies on `bg-sidebar` contrast |

**Overlays & backdrop:**
- Mobile sidebar scrim: `bg-slate-950/45` + `transition-opacity`.
- Sticky header: translucent + blur — `bg-background/85 backdrop-blur`, `border-b border-border/80`.
- Dialog/popover surfaces: `bg-popover` / `bg-card` with `border`.

**z-index ladder:** sticky header `z-20` · mobile scrim `z-30` · sidebar `z-40`
(toasts via Sonner sit above, `top-center`).

## 7. Motion

Restrained, color/transform-only transitions. Durations cluster at **150ms**
(legacy controls), **200ms** (width collapse), **300ms** (sidebar slide).

| Interaction | Transition |
|---|---|
| Buttons | `transition-all` (shadcn) — color, bg, shadow, ring |
| Badges / inputs | `transition-[color,box-shadow]` |
| Nav item hover/active | `transition-colors` |
| Sidebar collapse (width) | `transition-[width] duration-200 ease-linear` |
| Sidebar slide in/out (mobile) | `transition-transform duration-300` |
| Mobile scrim | `transition-opacity` |
| Legacy field/button | `transition: … 150ms ease`; primary press `:active { translateY(1px) }` |

`html { scroll-behavior: smooth }`. Animations come from **`tw-animate-css`**
(accordion/collapsible expand, dialog fade/zoom) — prefer its utilities over
hand-written keyframes. Avoid `transition: all` on large surfaces.

## 8. Component Recipes

These are the **shadcn-vue "new-york"** variants actually in use. Colors are
Tailwind semantic aliases backed by §2 tokens.

### 8.1 Page background (the "iris glow")
The one place the indigo identity renders. Apply to `body`:
```css
body {
  margin: 0;
  background:
    radial-gradient(circle at top, rgba(88, 101, 242, 0.12), transparent 32%),
    linear-gradient(180deg,
      color-mix(in oklab, var(--background) 94%, white 6%),
      var(--background));
  color: var(--foreground);
}
/* in @layer base: */
* { @apply border-border outline-ring/50; }
body { @apply bg-background text-foreground; }
```

### 8.2 Button (cva) — `default` is solid mono; one primary per view
```
base: inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md
      text-sm font-medium transition-all shrink-0 outline-none
      disabled:pointer-events-none disabled:opacity-50
      [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
      focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
      aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive

variants.variant:
  default      bg-primary text-primary-foreground hover:bg-primary/90
  destructive  bg-destructive text-white hover:bg-destructive/90
               focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60
  outline      border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground
               dark:bg-input/30 dark:border-input dark:hover:bg-input/50
  secondary    bg-secondary text-secondary-foreground hover:bg-secondary/80
  ghost        hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50
  link         text-primary underline-offset-4 hover:underline

variants.size:
  default h-9 px-4 py-2 has-[>svg]:px-3   sm h-8 rounded-md gap-1.5 px-3
  lg h-10 rounded-md px-6                  icon size-9   icon-sm size-8   icon-lg size-10
```
Convention: **hover = same color at `/90` (solid) or the soft `accent` surface
(ghost/outline)**; focus only adds the 3px ring. Pill action buttons add
`rounded-full px-3` (e.g. header logout).

### 8.3 Badge (cva) — pill, used for status & counts
```
base: inline-flex items-center justify-center rounded-full border px-2 py-0.5
      text-xs font-medium w-fit whitespace-nowrap gap-1 [&>svg]:size-3
      transition-[color,box-shadow] focus-visible:ring-ring/50 focus-visible:ring-[3px]
variants:
  default      border-transparent bg-primary text-primary-foreground
  secondary    border-transparent bg-secondary text-secondary-foreground
  destructive  border-transparent bg-destructive text-white
  outline      text-foreground            ← status pills extend this with the §3.2 color classes
```
Status pill = `<Badge variant="outline" class="rounded-full px-3 py-1 gap-2">` +
a `size-2 rounded-full` dot + the `border-*/30 bg-*/10 text-*-600 dark:text-*-300` set.

### 8.4 Card / Input
```html
<!-- Card -->
<div class="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">…</div>

<!-- Input -->
<input class="border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1
              text-base md:text-sm shadow-xs transition-[color,box-shadow] outline-none
              placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground
              dark:bg-input/30 disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
              aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
```

### 8.5 Sidebar nav item (the signature chrome pattern)
Active = solid `sidebar-primary` + `shadow-sm`; idle = translucent foreground that
fills with the `sidebar-accent` surface on hover. Nested/section items use the
soft `sidebar-primary/12` selected tint.
```html
<a class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
   :class="active
     ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
     : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'">
  <Icon class="size-4 shrink-0" /><span class="truncate">Label</span>
</a>

<!-- selected sub-item (soft tint) -->
<a class="… rounded-lg px-3 py-2 text-sm bg-sidebar-primary/12 text-sidebar-primary">…</a>

<!-- brand mark / icon avatar -->
<div class="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary/12 text-sidebar-primary">
  <Icon class="size-5" />
</div>
```
Opacity ladder for idle text: `/72` (items) → `/68` (sub-items) → `/50` (group eyebrow) → `/65` (captions).

### 8.6 Sticky header
```html
<header class="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur">
  <div class="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-10"> … </div>
</header>
```
User chip: `rounded-full border border-border/70 bg-card/80 px-3 py-1.5` + a
`size-8 rounded-full bg-sidebar-primary/10 text-sidebar-primary` icon disc.

### 8.7 App shell layout
```html
<div class="flex h-screen overflow-hidden bg-background text-foreground">
  <Toaster rich-colors position="top-center" />   <!-- vue-sonner -->
  <AppSidebar />                                    <!-- sticky lg:w-[264px] / collapsed lg:w-[72px] -->
  <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
    <AppHeader />
    <ScrollArea class="min-h-0 flex-1">
      <main class="flex-1 px-4 py-5 sm:px-6 lg:px-10 transition-all">
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-6"> <RouterView /> </div>
      </main>
    </ScrollArea>
  </div>
</div>
```
Toasts: **vue-sonner**, `rich-colors` + `position="top-center"`.

### 8.8 Legacy plain-CSS components (optional — present but unused by views)
Hand-authored utility classes in `style.css` (`.field`, `.btn-primary`, `table`,
`.badge`/`.badge-green|red|yellow|gray`, `.card`, `.view-header`). They demonstrate
the same conventions in raw CSS — soft tints via `color-mix(in oklab, <c> 14%, transparent)`,
focus ring via `box-shadow: 0 0 0 3px color-mix(…18%, transparent)`, pill badges
`border-radius: 999px`. Prefer the shadcn components above; reach here only if
rebuilding without the component library.

## 9. Theming Mechanism

- **Switch:** toggling the **`.dark` class on `<html>`** (Tailwind v4 custom variant
  `@custom-variant dark (&:is(.dark *))`).
- **Driver:** VueUse `useDark({ disableTransition: false })` + `useToggle` in a Pinia
  store; the header sun/moon button calls `toggleDark()`.
- **Persistence & default:** `useDark` persists to `localStorage` (key
  `vueuse-color-scheme`) and **defaults to following the OS** (`prefers-color-scheme`).
- `color-scheme: light|dark` is set per theme so native controls/scrollbars match.

```ts
// stores/app.ts
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark({ disableTransition: false })
const toggleDark = useToggle(isDark)
```

## 10. Drop-in Starter

Minimal paste to get the Iris look in a new Tailwind v4 project: copy the **entire
§2 block** (the `@import`s, `@theme inline`, `:root`, `.dark`) into your entry CSS,
then add the reset + glow:

```css
*, *::before, *::after { box-sizing: border-box; }
* { border-color: var(--border); outline-color: var(--ring); }
html { scroll-behavior: smooth; }
html, body, #app { min-height: 100%; }
#app { min-height: 100vh; }
body {
  margin: 0;
  background:
    radial-gradient(circle at top, rgba(88,101,242,0.12), transparent 32%),
    linear-gradient(180deg, color-mix(in oklab, var(--background) 94%, white 6%), var(--background));
  color: var(--foreground);
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; font-synthesis: none;
}
@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
```
Then scaffold components with `shadcn-vue` (`style: new-york`, `baseColor: neutral`,
`cssVariables: true`) so the cva recipes in §8 line up with these tokens.

## 11. Do & Don't

✅ **Do**
- Drive everything off the tokens / Tailwind aliases (`bg-card`, `text-muted-foreground`, `border-border`).
- Keep the palette monochrome; let indigo stay a whisper (body glow, dark charts).
- Use the unified focus ring (`focus-visible:ring-ring/50 ring-[3px]` + `border-ring`).
- Build status colors from Tailwind palette + alpha: `/10` fill, `/30` border, `-600`→`dark:-300` text.
- Match the radius language: `rounded-md` controls, `rounded-xl` cards/nav, `rounded-full` pills.
- Lift with `shadow-sm`/`shadow-xs` only; separate the sidebar with a border, not a shadow.
- Show light + dark for every new token; set `color-scheme`.

❌ **Don't**
- Hardcode hex in components (the OKLCH tokens are the source of truth).
- Introduce a loud second brand color or make "primary" colored — primary is mono.
- Use `transition: all` on large surfaces or add heavy/glowing drop shadows.
- Revive the legacy `--bg-*` / `--accent-hover` block as if it were wired — it isn't.
- Invert colors naively for dark mode; use the provided `.dark` token set.
- Forget CJK fallback (`Noto Sans TC`) — the UI is bilingual zh-TW + English.

---
*Source of truth: `apps/admin/src/style.css` (tokens, body glow, legacy classes),
`apps/admin/components.json` (shadcn-vue new-york / neutral), `src/components/ui/*`
(cva recipes), `src/components/layout/*` (shell), `src/stores/app.ts` (theming).
Update this file if the style changes.*
