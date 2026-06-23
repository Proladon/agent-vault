---
name: extract-coding-style
description: >-
  Extract a person's individual coding style and signature patterns from their
  genuinely hand-written code in a git repository, then produce (or update) a
  portable, project-agnostic coding-style guide that other AI agents can follow
  to mimic that style. Use this whenever the user wants to capture, extract,
  document, or codify "how I write code" / their coding conventions / their
  personal style into a reusable guide — including phrasings like "extract my
  coding style", "document my coding conventions", "make a style guide from my
  code", "turn my code style into a doc for AI to imitate", or Chinese
  equivalents such as "提取我的 coding 風格", "把我的程式風格整理成文件",
  "讓 AI 仿照我的 coding 風格". Trigger even when the user doesn't say the word
  "skill" or "guide" — any request to analyze existing code in order to capture
  an author's personal style for reuse belongs here.
---

# Extract Coding Style

## What this does

Produce a coding-style guide that lets a future AI agent write code that looks
like a specific person wrote it. The guide is **descriptive** (it documents how
this person actually writes) and **portable** (it can be dropped into any repo,
so it must not hard-code one project's components/utilities/APIs).

The hard part isn't writing the document — it's making sure you're describing
the person's *real* style and not generic best-practice or someone else's code.
Two pitfalls dominate, and the workflow below is built around avoiding them:

1. **Recent commits are often AI-generated, not hand-written.** Modern repos are
   full of agent-authored code attributed to a human. Sampling only the latest
   work captures the *agent's* style, not the person's. You must trace back to
   genuinely hand-written code.
2. **It's easy to produce a project-specific doc by accident.** If the guide
   says "use `BobProPage` and `window.$message`", it's useless in another repo.
   Capture the *idiom*, not the proprietary name.

## When to read the reference files

- `references/extraction-checklist.md` — the dimensions to look for while reading
  code, plus how to recognize a person's "signature patterns". Read it before
  you start reading source files, so you know what you're hunting for.
- `references/output-template.md` — the structure and house rules for the output
  document (portability rules, placeholder conventions, section order). Read it
  before you start writing the guide.

## Workflow

### Step 1 — Pin down whose style, and which code is theirs

Confirm the target author and where to read their code. Usually it's "my style"
in the current repo, but don't assume — a person may have a more representative
body of work in another repo.

```bash
git config user.name && git config user.email      # current identity
git shortlog -sne --all | head -30                  # all authors + commit counts
```

If the user works under multiple identities (e.g. a personal email and a work
email, or a display name that differs from `user.name`), note all of them —
you'll match commits against any of them.

### Step 2 — Find the genuinely hand-written code (trace back through history)

This is the step people skip and regret. Recent work may be AI-assisted.

```bash
# Authored, non-merge commits, newest first
git log --author="<name-or-email>" --no-merges --oneline -50

# Authoring activity over time (spot the person's active eras).
# Note the `sort` before `uniq` — commits aren't strictly date-ordered across
# branches, so a bare `uniq -c` double-counts the same month and skews the histogram.
git log --no-merges --author="<name>" --date=format:'%Y-%m' \
  --pretty='%ad' | sort | uniq -c

# Which files a commit touched (to find substantial, authored files)
git log --author="<name>" --no-merges --name-only --pretty='COMMIT:%h %s' -15
```

Decide which commits reflect the person, not an agent. Heuristics:

- **Ask, don't guess.** A one-line question — "which features / which time period
  did you write by hand, vs. AI-assisted?" — is the most reliable signal. The user
  knows. In this skill's origin session the user volunteered "recent work is mostly
  AI" and that single fact reshaped the whole sample.
- **Go back far enough.** Sample across the person's active eras, including older
  ones that predate heavy AI use. Long-standing idioms that recur across *years*
  are almost certainly authentic personal style, not a passing agent artifact.
- **Cross-check with the repo's own convention docs.** Many repos already contain
  hand-curated pattern notes (`patterns/`, `docs/`, `references/`, `CONTRIBUTING`,
  `AGENTS.md`, `CLAUDE.md`). These were usually written by the person and are gold
  for confirming signature patterns. Look for them early.

### Step 3 — Select a representative sample

Read *real files*, not just diffs. Pick breadth across the kinds of code the
person writes, e.g. for a frontend codebase: an entry/page file, a reusable
component, a form, a shared utility/composable, a config/constants file, and a
data/API-access file. For each, you're reading to answer the checklist in
`references/extraction-checklist.md`.

Aim for ~6–12 files. Favor files the person clearly authored and that are stable
(not churned by many hands). Real long-standing files are usually co-authored, so
"the person touched it" isn't enough — confirm they *own* it before trusting it as
a style sample:

```bash
# Who has committed to this file, by commit count (ownership dominance)
git shortlog -sn -- <file>
# Who first created it (style origin), and when it was last meaningfully touched
git log --diff-filter=A --pretty='%an %ad' -- <file>
```

Prefer files where the target is the first author and owns the clear majority of
commits, and where the number of distinct authors is low. A file the person created
and overwhelmingly owns reflects *their* style; a heavily co-edited file is a blend.
If the repo has convention docs (Step 2), read those too.

### Step 4 — Extract the style

Work through `references/extraction-checklist.md`. The output you're building
toward has two layers:

- **Universal principles** — naming, error handling, comments, formatting,
  architecture instincts. These transfer to any language/stack.
- **Signature patterns** — the person's most identifiable, recurring idioms (the
  things you'd point at and say "that's how *they* write"). These are the heart
  of the guide. Name them, show a minimal example of each, and state the
  convention.

### Step 5 — Write the portable guide

Follow `references/output-template.md`. The non-negotiable rule: **strip every
project-specific name** (components, utilities, message helpers, API modules,
file paths, lint-config package names) and replace with neutral placeholders,
noting that the reader should substitute their project's real equivalent. The
content stays portable even though the file itself lives in the current repo.

To make the leak self-test (Quality bar) reliable rather than from-memory, **keep
a running list of proprietary names as you read source in Step 3** — every
component, helper, API function, store, and import path that's specific to this
project. That list is exactly what you grep the finished draft for.

Write in the language the person actually uses in their own comments and
conversation (e.g. if their code comments are in Traditional Chinese, write the
guide in Traditional Chinese with code examples in English).

### Step 6 — Place it, wire it, remember it

- **Place** the guide in the current repo. Detect where the repo keeps guidance:
  prefer an existing docs/guide directory (e.g. `references/guide/`, `docs/`).
  Otherwise create one at a sensible path (`references/guide/coding_style.md` or
  `docs/coding_style.md`, falling back to repo root).
  - **If a guide already exists** (a prior run of this skill, or a hand-written
    one), this is an *update*, not a fresh write — and updates are the common case.
    Derive your findings independently from source first (Steps 2–5), *then* read
    the existing guide and reconcile: keep what still holds, correct what's stale,
    add newly-found patterns, and preserve any human edits. Don't blindly overwrite
    it (you'd lose hand-tuning) and don't blindly trust it (it may predate the
    person's current style or the recent AI-generated noise you're filtering out).
- **Wire** a one-line pointer into the repo's agent-instruction file (`AGENTS.md`
  or `CLAUDE.md`) if one exists, so future agents discover it.
- **Remember**: if a persistent memory is available, record where the guide lives
  and the person's signature patterns, so future sessions apply them and know to
  trace hand-written commits when updating.

## Quality bar

A good output guide:

- Lets someone who's never seen the person's code reproduce its *feel* — naming,
  structure, error handling, the signature idioms.
- Contains **zero** names that only exist in one project. Grep your draft for the
  proprietary names you saw in Step 3; if any survive, replace them.
- Leads with the signature patterns — the 4–8 idioms that make the style
  recognizable — not with generic advice the person shares with everyone.
- Is honest about its basis: note that it's derived from hand-written code across
  versions, and what to do when updating it (re-trace authentic commits).

If the analysis is thin (too few authored files, ambiguous authorship), say so
and ask for direction rather than padding the guide with generic filler.
