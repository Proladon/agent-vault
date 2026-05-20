---
name: update-repo-wiki
description: "Update the wiki/ folder with validated project specs. Use when: updating wiki; syncing wiki with implementation; promoting in_progress entries to wiki; writing spec documentation; filling wiki gaps; aligning wiki with codebase; audit wiki; 更新 wiki; 補齊 wiki; 同步規格; 將 in_progress 合併到 wiki; 比對實作與規格; 規格文件; 整理 wiki"
argument-hint: "Optional: specific area to focus on (e.g. 'auth', 'roles', 'recycle flow')"
---

# Update Wiki

## Purpose

Keep `wiki/` as the single source of truth for validated, production-level specs. This skill audits the wiki against the actual codebase and `in_progress.md`, fills gaps, and promotes confirmed entries.

**Wiki content rules:**

- Describe _what_ the system does and _why_ — not _how_ it's implemented
- No code snippets, SQL DDL, or file paths (unless naming a module)
- Written in present tense, factual, free of "in progress" language
- Each page covers one coherent topic within a module

**Wiki folder structure:**

```
wiki/
├── README.md              ← root index: lists all modules + one-line summary + links
├── <module>/
│   ├── index.md           ← module index: lists pages in this module with descriptions
│   └── <topic>.md         ← individual spec pages
└── ...
```

Modules map to coherent product domains, not application layers. Examples:

| Module folder | Covers                                          |
| ------------- | ----------------------------------------------- |
| `auth/`       | Login, roles, permissions, session              |
| `members/`    | Personal and enterprise member lifecycle        |
| `recycling/`  | Recycling application flow, locations, statuses |
| `points/`     | P幣 issuance, Shopline sync, multipliers        |
| `admin/`      | Admin portal features, staff management         |
| `settings/`   | Recyclables, sources, rate configuration        |

---

## When to Use

- After implementing a feature and wanting to promote it from `in_progress.md`
- When the wiki is stale or gaps are suspected
- Periodic spec audits to ensure wiki reflects reality
- Explicitly invoked via `/update-repo-wiki`

---

## Procedure

### Step 1 — Read Current State

Load all three sources in parallel before writing anything:

1. **`in_progress.md`** — entries pending promotion to wiki
2. **`wiki/`** — list all existing pages and read their contents
3. **PRDs** (`prds/`) — authoritative business intent; wiki must align with these

### Step 2 — Audit the Codebase

Explore the implementation to surface undocumented behavior. Focus on:

| Area                | Where to look                                                                      |
| ------------------- | ---------------------------------------------------------------------------------- |
| Roles & permissions | `apps/admin/src/`, `apps/client/src/`, server middleware/auth                      |
| Data models         | `apps/server/src/db/`, shared schemas in `packages/shared/src/schemas/`            |
| API contracts       | `apps/server/src/routes/` — method, path, auth requirement, request/response shape |
| Business rules      | validators, service logic, constants in `packages/shared/src/`                     |
| Feature flows       | page components, composables, store actions                                        |

Use `explore_subagent` or `grep_search` to navigate. Do **not** read every file — focus on interfaces, types, route definitions, and validators.

### Step 3 — Gap Analysis

Compare what you found against the wiki. For each domain:

- Does a wiki page exist?
- Is it complete and accurate?
- Does it contradict `in_progress.md` or the PRD?

Produce a mental (or written) list of:

- **Missing pages** — domains with no wiki coverage
- **Incomplete pages** — pages that exist but are missing sections
- **Stale content** — pages that contradict current implementation
- **Promotable entries** — `in_progress.md` items that are confirmed and ready for wiki

### Step 4 — Write / Update Wiki Pages

For each gap or promotable entry, create or update the relevant wiki page.

**File placement:** `wiki/<module>/<topic>.md` — all lowercase, hyphenated. Group related topics under the same module folder.

**Always maintain index files:**

- **`wiki/README.md`** — root index listing every module with a one-line description and link to its `index.md`
- **`wiki/<module>/index.md`** — module index listing every page in that folder with a one-line description

Index files exist so agents can navigate the wiki without listing every file. Keep them updated whenever pages are added, removed, or renamed.

**Root index template (`wiki/README.md`):**

```markdown
# Wiki Index

| Module                        | Description                |
| ----------------------------- | -------------------------- |
| [auth](./auth/index.md)       | Login, roles, permissions  |
| [members](./members/index.md) | Member lifecycle and types |
| ...                           | ...                        |
```

**Module index template (`wiki/<module>/index.md`):**

```markdown
# <Module Name>

Brief one-paragraph summary of this domain.

## Pages

| Page                    | Description                            |
| ----------------------- | -------------------------------------- |
| [roles](./roles.md)     | Role definitions and permission matrix |
| [session](./session.md) | Session lifecycle and token rules      |
```

**Standard topic page structure:**

```markdown
# <Topic Name>

## Overview

One paragraph describing what this topic covers.

## <Section> (e.g. Roles, Flow, Rules, States)

Content as tables, bullet lists, or prose — no code.

## Constraints & Invariants

Non-obvious rules the system enforces.

## Open Questions

Any unresolved decisions (remove once resolved).
```

**Content guidelines:**

- Roles/permissions → tables
- Flows → numbered steps or Mermaid state diagrams
- Rules → bullet lists with clear "must / must not" language
- Data entities → field names + description, no types or SQL

### Step 5 — Promote from in_progress.md

For each `in_progress.md` entry that has been confirmed (implemented and stable):

1. Extract the spec-relevant decisions and constraints
2. Merge them into the appropriate wiki page (create the page if needed)
3. Remove or mark the entry in `in_progress.md` as promoted

**Do NOT promote entries that are:**

- Still under active development
- Contradicted by current implementation
- Pending user confirmation

### Step 6 — Summarize Changes

After writing, report:

```
## Wiki Update Summary

### Pages Created
- wiki/<module>/<topic>.md — <one-line description>

### Pages Updated
- wiki/<module>/<topic>.md — <what changed>

### Index Files Updated
- wiki/README.md — added <module> entry
- wiki/<module>/index.md — created / added <topic> entry

### Promoted from in_progress.md
- "YYYY-MM-DD — <title>" → merged into wiki/<module>/<topic>.md

### Gaps Remaining
- <anything left undocumented and why>
```

---

## Quality Checklist

Before finishing, verify:

- [ ] No code snippets or implementation details in wiki pages
- [ ] All promoted `in_progress.md` entries are accurately reflected
- [ ] No wiki page contradicts a PRD
- [ ] All role/permission tables are consistent across pages
- [ ] Open questions are clearly marked and not presented as resolved
- [ ] `in_progress.md` entries that were promoted are removed or annotated
- [ ] `wiki/README.md` lists every module that exists in `wiki/`
- [ ] Every module folder has an `index.md` that lists all pages in that folder
- [ ] No orphaned pages (pages not referenced by their module `index.md`)

---

## Conflict Resolution

If you encounter a contradiction between `in_progress.md`, wiki, and the actual codebase:

1. The **codebase is ground truth** for what currently exists
2. The **PRD is authority** for what _should_ exist
3. If codebase contradicts PRD, **surface the conflict** to the user before writing anything
4. Never silently pick one side
