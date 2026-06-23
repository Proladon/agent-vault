---
name: extract-design-system
description: >-
  Extract a project's visual design system — color tokens, typography, radius,
  spacing, shadows/elevation, motion, and component patterns — into a single
  reusable, copy-paste-ready design.md guide that another AI agent can read to
  rebuild the same look in a different project. Use this whenever the user wants
  to capture, document, port, hand off, or reuse a project's visual style, theme,
  color scheme, design tokens, or "look and feel", or asks for a "design guide",
  "style guide", "design.md", a named "theme", or "make this style reusable in
  the next project" — even if they never say the words "design system".
---

# Extract Design System

## What this does

Reverse-engineer a project's *visual* design language from its source and
distill it into one self-contained Markdown file (default name `design.md`) that
a **future AI agent can read and faithfully reproduce in a different project** —
without ever opening the original codebase.

The output is not prose *about* the design; it is a **portable spec**: a
copy-paste CSS token block, lookup tables, and ready-to-use component recipes.
Optimize the whole document for "an agent in another repo pastes this and gets
the same look."

## Core principles

These shape every decision below:

1. **Token-first.** The heart of any modern theme is its set of design tokens
   (CSS custom properties / variables). Capture them verbatim and make them the
   spine of the document. Everything else references the tokens.
2. **Copy-paste ready.** Every token block and component recipe must be valid,
   self-contained code the reader can paste and run. No `...` placeholders in
   the parts meant to be copied.
3. **Decouple from the source.** The guide describes a *style*, not *this app*.
   Strip product-specific names, business logic, and one-off IDs. Rename the
   theme to something memorable and project-neutral (see "Name the theme").
4. **Explain the conventions, not just the values.** A hex code is data; "hover
   always uses the soft accent tint, focus only changes the border color" is the
   reusable knowledge. Capture the *rules* a designer was following.
5. **Faithful, not inventive.** Report what the project actually does. If the
   project has no dark mode, don't fabricate one. If a scale is irregular, say
   so rather than smoothing it into a tidy fiction.

## Workflow

### Step 1 — Locate the design source

Styling can live in many places. Search broadly before reading; don't assume.
Look, in roughly this priority order, for wherever the *tokens* and *component
styles* actually are:

- **Token / theme definitions:** `:root {}` and `[data-theme]` / `.dark` blocks
  in CSS; `tailwind.config.{js,ts}` `theme`/`extend`; CSS-in-JS theme objects
  (`theme.ts`, styled-components/emotion `ThemeProvider`); design-token files
  (`tokens.json`, `*.tokens.*`, Style Dictionary); Sass/Less variables
  (`_variables.scss`, `variables.less`); `@theme` blocks (Tailwind v4).
- **Global styles:** `global.css`, `globals.css`, `app.css`, `index.css`,
  `styles/`, or a large inline `<style>` in an HTML entry file.
- **Component styles:** component CSS/SCSS modules, styled-components, or utility
  classes scattered across components — sample several to infer recurring recipes.
- **Config & meta:** existing `tailwind`/`unocss` config, fonts loaded in
  `<head>` or `next/font`, favicon/logo for brand cues.

Use Glob/Grep to find these (`**/*.css`, `tailwind.config.*`, `theme.*`,
`*tokens*`, `:root`, `--[a-z]`). If styling turns out to be one big file (common
with single-file HTML apps), read it in full — the design system is usually
denser than the line count suggests.

If you genuinely can't find a coherent design source, say so and ask the user to
point you at it rather than inventing tokens.

### Step 2 — Extract into the design-system model

Pull what exists into these categories. Skip a category cleanly if the project
has nothing for it — never pad with invented values.

- **Surfaces & color tokens** — background, panel/card, border, text, muted,
  accent, and any soft/tint variants. Capture **light AND dark** if both exist,
  side by side.
- **Semantic colors** — success / danger / warning / info, plus their soft
  backgrounds. Note how tints are derived (e.g. `color-mix()`, fixed rgba, opacity).
- **Category / accent palettes** — any per-type or per-status color set (tags,
  labels, charts).
- **Typography** — font stacks (incl. fallbacks and any CJK fonts), base size &
  line-height, the size/weight ladder, letter-spacing conventions, mono stack.
- **Shape** — the radius scale (which radius is used where) and border conventions.
- **Spacing & sizing** — the spacing rhythm (often a 4px multiple), and key fixed
  dimensions (header height, sidebar/drawer width, icon size, max content width,
  responsive breakpoints).
- **Elevation** — the shadow ladder by level, plus backdrop/overlay colors and
  the z-index ladder.
- **Motion** — transition durations and easings by interaction type, and any
  keyframe animations.
- **Component recipes** — the actual CSS for buttons (primary/secondary), inputs,
  cards, badges/pills, modals, drawers, toasts, segmented controls, etc. — only
  the ones the project actually has. Distill the *recurring pattern*, not every
  one-off rule.
- **Theming mechanism** — how light/dark (or any theme) switches: the attribute/
  class toggled, where it's stored, default behavior.

### Step 3 — Write the guide

Write to `design.md` in the project root (or the path the user asks for). Match
the document's prose language to the user / project (e.g. Traditional Chinese
headings with English code is fine and common). Follow the structure in
`references/design-md-template.md` — read it now; it is the canonical skeleton
and explains what each section is for. Adapt sections to the project: drop ones
that don't apply, but keep the token block and component recipes — those carry
most of the reuse value.

Quality bar before you finish:
- The token block is valid, complete CSS the reader can paste as-is.
- Every component recipe references tokens (`var(--x)`), not raw hex (semantic/
  category colors are the allowed exception, and even those should derive tints).
- Tables let a reader find "what color/size/radius do I use for X" in seconds.
- A short Do / Don't list captures the conventions that keep the style coherent.
- No leftover product-specific names, routes, or IDs.

### Step 4 — Name the theme

Give the design a short, memorable, **project-neutral** name (decoupled from the
source app's name) and put it in the title. Derive it from the design's own
character — most often the accent color (a color, gem, flower, or mood that
matches it). Offer 2–3 alternatives so the user can swap easily. This makes the
theme feel like a reusable product, and gives future projects a handle to refer to.

## Output

A single `design.md` (or user-specified name/path). Then briefly report: the
theme name, where the file is, and a one-line summary of the captured palette /
character. Mention any categories that were absent in the source so the user
knows what wasn't invented.
