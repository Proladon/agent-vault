# `design.md` template / skeleton

This is the canonical structure for the extracted design guide. It is written so
that **another AI agent can paste pieces of it into a new project and reproduce
the look**. Keep that reader in mind: favor copy-paste code blocks and lookup
tables over narrative.

Adapt to the project: drop sections the source has nothing for, reorder if it
reads better, and match the prose language to the user. But always keep **§2
Design Tokens** and **§8 Component Recipes** — they carry most of the reuse value.

Use real, complete values from the source. The `<...>` markers below are slots
for you to fill, not literal text to keep.

---

```markdown
# <Theme Name> — Design System

> **Theme: <Name>** — <one line on why this name; usually tied to the accent color>.
>
> A cross-project, reusable visual design system, written as design tokens +
> component recipes so an AI agent can rebuild this look without reading the
> original source.
>
> **Style in a sentence:** <e.g. clean, modern SaaS / document-tool aesthetic;
> single accent color; neutral grays; thin borders; soft shadows; restrained motion;
> light + dark themes.>

## 1. Design Principles
<3–7 bullets capturing the decision rules a designer was following — token-driven,
single accent, neutral-dominant, how tints/elevation/motion are handled, radius language.>

## 2. Design Tokens
<The single most important section. A complete, paste-ready token block. Include
the dark variant if the project has one. Then a quick-reference table.>

​```css
:root {
  /* surfaces */   --bg: ...; --panel: ...; --border: ...; --code-bg: ...;
  /* text */       --text: ...; --muted: ...;
  /* accent */     --accent: ...; --accent-soft: ...;
  /* shape */      --radius: ...;
  /* elevation */  --shadow: ...;
}
html[data-theme="dark"] { /* or .dark, [data-mode=dark], etc. */
  --bg: ...; --panel: ...; /* ...overrides... */
}
​```

| Token | Light | Dark | Use |
|---|---|---|---|
| `--accent` | ... | ... | ... |
<...one row per token...>

## 3. Semantic Colors
<success / danger / warning / info: main color + soft background, and how the soft
tint is derived (color-mix / rgba / opacity). Include any category or per-type palette.>

## 4. Typography
<font stack with fallbacks (note CJK fonts if present); base size + line-height;
the size/weight ladder as a table; letter-spacing & mono-stack conventions.>

## 5. Shape, Spacing & Sizing
<radius scale (value → where used); spacing rhythm; key fixed dimensions —
header height, sidebar/drawer width, icon size, max content width, breakpoints.>

## 6. Elevation
<shadow ladder by level → use; backdrop/overlay colors; z-index ladder.>

## 7. Motion
<transition durations + easings by interaction type; keyframe animations like spin/flash.>

## 8. Component Recipes
<Paste-ready CSS for each component the project actually has — buttons (primary &
secondary), inputs, cards, badges/pills, segmented controls, modals, drawers,
toasts, avatars, custom scrollbar, etc. Distill the recurring pattern; note the
convention in a line above each (e.g. "secondary = outlined; primary = solid accent;
one primary per view").>

## 9. Theming Mechanism
<How themes switch: attribute/class toggled, where the choice is stored, default
behavior (e.g. follow system). Minimal JS snippet if relevant.>

## 10. Drop-in Starter
<Minimal reset + the token block, so a new project gets the theme in one paste.>

## 11. Do & Don't
<The conventions that keep the style coherent. ✅ token-driven, unified hover/focus,
single accent, lean transitions. ❌ hardcoded hex, transition:all, heavy shadows,
second accent color, glow-style focus, naive dark-mode inversion.>

---
*Source of truth: <path to the styling source in the original project>. Update this
file if the style changes.*
```

---

## Notes for the author

- **Light + dark side by side.** If the project themes, always show both values
  in the same table row — the diff between them *is* the dark-mode design.
- **Derive, don't enumerate, tints.** If the source uses
  `color-mix(in srgb, <c> 14%, transparent)` or `rgba(c, .1)` to make soft
  backgrounds, document that *formula* once; don't invent a new variable per tint.
- **Recipes over rules.** A component recipe should be the distilled, reusable
  pattern (the button that appears everywhere), not a dump of every selector.
- **Keep it honest.** Absent categories get omitted, not invented. Irregular
  scales get described as-is. The reader is trusting this to be accurate.
