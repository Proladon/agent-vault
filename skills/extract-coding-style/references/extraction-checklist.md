# Extraction Checklist

What to look for while reading the person's code (Step 4). Not every item
applies to every codebase — capture what's *present and consistent*, skip what
isn't. Consistency across files is the signal that something is real style and
not a one-off.

## A. Universal dimensions (transfer to any language/stack)

- **Naming conventions** — casing per identifier kind (variables, functions,
  classes, files, folders, constants). Verb prefixes for functions (`fetch*`,
  `get*`, `on*`, `handle*`, `is*`/`can*`/`has*` for booleans). How they name
  derived data vs. raw data. Whether they preserve upstream/backend names verbatim.
- **Error & async handling** — return-tuple vs throw vs result-object; how errors
  surface (toast/log/rethrow); early-return vs nesting; loading-state handling;
  guarding double-submit; debounce/throttle habits; parallelism idioms.
- **Defensive access** — safe nested access (optional chaining, `get(obj,path,default)`),
  default/fallback values, null-guards.
- **Comments** — language (which natural language!), density, and *what* they
  explain (intent/"why" vs. mechanics/"what"); doc-comment style (JSDoc/docstrings)
  and where they're applied (public functions, modules, config helpers).
- **Formatting** — indentation, quotes, semicolons, trailing commas, import
  ordering/grouping, line-length habits, blank-line rhythm. (Confirm against the
  repo's linter/formatter config, but report the *outcome*, not the tool name.)
- **Module/architecture instincts** — where logic lives (thin views + extracted
  logic units), separation of data-access into a dedicated layer, colocation vs.
  layering, what gets pulled into shared helpers.
- **i18n / config-as-data** — whether UI strings/enums are externalized;
  config-object shapes; how options/enums are declared and derived.

## B. Signature patterns (the heart of the guide)

A *signature pattern* is a recurring, named-able idiom that makes the person's
code instantly recognizable — the thing you'd point at and say "that's how *they*
write." These matter far more than generic advice. To find them, look for shapes
that repeat across unrelated files.

For each signature pattern, capture:
1. **A name** — use the person's own name for it if they have one (often visible
   as a recurring variable/function/file name), otherwise coin a clear one.
2. **The shape** — a *minimal* code example (10–20 lines), neutralized of
   project-specific names.
3. **The convention** — when to reach for it and the rules of thumb.

Categories of signature pattern to scan for (examples are illustrative — the
person may have entirely different ones):

- **Collapsing computed objects** — a single derived object that centralizes a
  concern instead of scattering it through templates/logic. (Origin-session
  example: `showControl` for visibility, `displayText` for labels, `displayData`
  for formatted data — each a `computed` returning one object.)
- **State-shape conventions** — e.g. a reactive `formData` paired with a computed
  `formRules` that *dynamically assembles* rules by current state; a fixed form
  lifecycle (`init → sync-from-props → compact-for-submit → submit`).
- **Wrapper/binding idioms** — how they wrap two-way binding, refs, or models
  (e.g. a `syncModel` via a vmodel helper).
- **Declarative / config-driven construction** — building UI (columns, filters,
  actions, fields) or behavior from object arrays with a fixed item shape
  (`{ key, label, component, render, props, on }`) handed to a generic renderer,
  rather than hand-writing repetitive markup.
- **Fixed call-and-handle shapes** — e.g. `const [res, err] = await Api(...)` then
  `if (err) { toast(err); return }`; payload-building idioms (`field || undefined`).
- **Reuse-by-flags** — one component serving multiple contexts via `hideX` /
  mode props plus `.filter()`, instead of duplicated components.

## C. Anti-patterns the person avoids (and ones they tolerate)

Note what the person deliberately *doesn't* do (e.g. never calls HTTP directly
from a view; never hard-codes UI strings). Also note legacy habits visible in
*older* files that newer files have moved away from — flag these as "do not
imitate" so the guide captures the person's *current* style, not their history.

## D. Things to verify, not assume

- Distinguish "the person's style" from "the framework's defaults" and "the
  repo's house rules imposed on everyone." All three appear in their code; the
  guide should foreground what's genuinely *theirs*.
- When two eras disagree, prefer the more recent *hand-written* convention and
  say so.
