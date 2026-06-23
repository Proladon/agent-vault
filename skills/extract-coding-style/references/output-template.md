# Output Template & House Rules

How to write the style guide produced in Step 5.

## Portability rules (the part that's easy to get wrong)

The guide lives in one repo but must read as if it could be dropped into any
repo. That means:

- **No project-specific names.** Strip component names, utility/helper names,
  message/toast helpers, API module names, store names, file paths, and even the
  lint-config package name. Replace each with a neutral placeholder and tell the
  reader to substitute their project's equivalent.
  - `BobProPage` → `ListPage` (or "the project's list-page container")
  - `window.$message.error(err)` → `MessageToast.error(err)` ("the project's toast helper")
  - `@/api/signatureRecordMapping` → `@/api/xxx`
  - `BaseElForm` → `<Form>` / `<FormItem>`
- **Principles stay framework-light; idioms may assume the person's stack.** State
  the substrate explicitly at the top (e.g. "assumes Vue Composition API") so the
  reader knows which parts are universal and which are stack-specific.
- **Self-test:** after drafting, grep the draft for the running list of proprietary
  names you collected while reading source (Step 5). If any remain, neutralize them.
  This catches real leaks — in testing it routinely surfaces a handful (a stray
  `FindReservation`, a `useBaseForm()`, a `featureKey`) that look generic but aren't.

## Language

Write the prose in the natural language the person uses in their own code
comments and conversation. Keep code identifiers/examples in English (as code
normally is). Section headers can be bilingual (`## 命名慣例 (Naming)`) if that
matches the person's own docs.

## Recommended structure

Lead with what's most identifiable. Suggested order (adapt to what you actually
found — drop empty sections, don't pad):

```
# <Person>'s Personal Coding Style — <substrate, e.g. Vue Composition API>

> Purpose: let an AI agent reproduce this author's style in any project.
> Portability: no project-specific names; placeholders mark substitution points.
> Substrate: <framework/version assumptions>; principle sections are stack-agnostic.
> Basis: derived from long-standing hand-written code across versions (not recent AI-assisted work).

## 0. Style in three sentences
   <the 3 instincts that explain most decisions>

## 1. Signature patterns (most identifiable)   ← the heart; put it FIRST
   For each: name, minimal neutralized example, the convention.

## 2. Naming conventions
   A compact table: identifier kind → rule → example.

## 3. Component / module structure
## 4. Async & error handling
## 5. Safe access & defaults
## 6. Config-driven / data-as-config
## 7. Enums & options (config-object conventions)
## 8. Logic extraction (helpers / composables / layering)
## 9. i18n / externalized strings
## 10. Local state & lifecycle conventions
## 11. Reuse & composition habits
## 12. Styling conventions
## 13. Comments
## 14. Formatting & lint outcomes
## 15. Copy-paste skeleton   ← a ready starter using placeholder names
## 16. Anti-patterns to avoid
```

## Writing style for the guide itself

- Show, don't just tell — every pattern gets a short example.
- Explain the *why* behind a convention when it isn't obvious; it helps the reader
  generalize to cases the examples don't cover.
- Keep examples minimal and focused on the one idea they illustrate.
- A compact table beats prose for naming rules.
- Mark legacy/"do not imitate" habits explicitly so the guide reflects current style.

## Wiring (Step 6)

- Add a one-line pointer in the repo's `AGENTS.md` / `CLAUDE.md` References
  section if present, describing the guide and noting it's portable.
- The pointer should make the signature patterns discoverable by name.
