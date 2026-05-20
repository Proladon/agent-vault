---
name: update-repo-in-progress
description: "Update in_progress.md with completed implementation details. Use when: finishing a feature, fix, or refactor; after any coding task; recording implementation decisions; writing spec entries; logging what was built; appending to in_progress; spec update; 更新 in_progress; 記錄實作; 寫規格; 完成功能後更新; 完成後記錄"
argument-hint: "Brief title of what was just implemented (optional)"
---

# Update in_progress.md

## Purpose

Append a dated spec entry to `in_progress.md` after completing any implementation task. This keeps the incremental spec up to date and prevents spec drift.

## When to Use

- After finishing any feature, bug fix, or refactor
- When the user says "update in_progress", "記錄一下", "寫規格", or similar
- At the end of any coding session where implementation decisions were made
- When explicitly invoked via `/update-repo-in-progress`

---

## Procedure

### 1. Gather Context

Read the following before writing anything:

- `in_progress.md` — understand existing entries and avoid duplication
- Relevant `wiki/` pages — confirm the change doesn't contradict archived specs
- If invoked with an argument, use it as the entry title; otherwise infer from the conversation

### 2. Determine Entry Scope

Identify what was done in this session:

- **What** was implemented (feature name, file paths, API endpoints, schema changes, etc.)
- **Why** — the motivation or ticket/PRD that drove it
- **Decisions made** — design choices, trade-offs, things that aren't obvious from the code
- **Constraints added** — new invariants, rules, or limitations the codebase now has
- **Corrections** — any prior assumption or spec that was changed

### 3. Write the Entry

Append to `in_progress.md` using this exact format:

```markdown
## YYYY-MM-DD — <Brief Title>

### What Was Implemented

- <bullet list of concrete changes>

### Decisions & Constraints

- <design choices, trade-offs, new invariants>

### Files Changed

- `path/to/file.ts` — <one-line reason>

### Notes

- <any warnings, TODOs, or follow-ups> (omit section if none)
```

Rules:

- Date must be today's date in `YYYY-MM-DD` format (today is 2026-05-20)
- Title must be ≤ 60 characters, sentence-case
- Each bullet point must be a complete, standalone fact — no vague phrases like "made improvements"
- Omit any section that has nothing to say (except "What Was Implemented" and "Decisions & Constraints", which are always required)
- Append at the **bottom** of the file, after all existing entries

### 4. Validate

After writing:

- Confirm the entry was appended (not overwritten)
- Check that no existing entry was modified
- Verify the date is correct

### 5. Promote to wiki/ (If Production-Ready)

If the change has been validated and is considered stable:

1. Create or update the relevant page under `wiki/`
2. Remove the corresponding entry from `in_progress.md`
3. Wiki pages must use stable, declarative language — no "in progress" phrases

---

## Example Entry

```markdown
## 2026-05-20 — Add JWT refresh token rotation

### What Was Implemented

- Added `POST /auth/refresh` endpoint in `apps/server/src/routes/auth.ts`
- Refresh tokens are now single-use; a new token is issued on each rotation
- Old tokens are invalidated immediately upon use

### Decisions & Constraints

- Rotation window is 15 minutes; configurable via `AUTH_REFRESH_TTL` env var
- Revoked tokens are stored in Redis with TTL matching expiry — no DB table needed
- If a revoked token is reused, the entire token family is invalidated (detect theft)

### Files Changed

- `apps/server/src/routes/auth.ts` — added refresh endpoint
- `apps/server/src/middleware/auth.ts` — updated token validation logic
- `packages/shared/src/types/auth.ts` — added `RefreshTokenPayload` type
```
