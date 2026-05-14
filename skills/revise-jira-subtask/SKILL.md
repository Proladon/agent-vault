---
name: revise-jira-subtask
description: 'Revise an already-implemented Jira sub-task based on new feedback. Use when: user provides a Jira sub-task URL or issue key and asks to fix it, revise it, adjust it, or correct it after UAT feedback. Reads previous agent implementation notes from the sub-task comments as context, applies the correction on a new branch off the story branch, merges back, posts an updated implementation comment, and transitions the sub-task back to "WAIT UAT".'
argument-hint: '<Jira sub-task URL or issue key> [correction details]'
---

# Revise Jira Sub-task

This skill corrects or adjusts an already-implemented sub-task. It uses the sub-task's existing Jira comment history (from a prior `implement-jira-story` run) as full implementation context, then applies the user's revision, merges the fix into the story branch, and posts a follow-up comment.

## When to Use

- User provides a Jira sub-task link or key and asks to fix, revise, adjust, correct, or update it.
- The sub-task was previously implemented (it has an agent implementation comment) but needs changes based on UAT feedback or new requirements.
- User may supply the correction in the chat message, or the correction may be described in a new comment on the Jira card.

Trigger phrases: "fix this sub-task", "revise", "adjust", "correction", "UAT feedback", "修正", "調整", "修改", "根據反饋", "按照留言修正"

---

## Pre-flight Checks

Before beginning, obtain:

1. **Sub-task issue key** — parse from the URL argument or ask the user.
2. **`cloudId`** — call `getAccessibleAtlassianResources` if not already cached.
3. **Correction details** — from the user's message or from a new Jira comment. If neither is provided, ask the user to describe the correction needed.
4. **Current git branch** — run `git branch --show-current` to confirm the current working branch.

---

## Workflow

### Step 1: Fetch the Sub-task Card

Call `getJiraIssue` with the sub-task key. Collect:

- `summary` — sub-task title.
- `status.name` — current status (for reference).
- `parent` — story issue key (used to determine the story branch name).
- `comments` — **read all comments**. Identify:
  - The most recent **agent implementation comment** (formatted as `## 實作總結`) — this is your primary context for what was previously done and which files were changed.
  - Any **new comments** added after the implementation comment — these contain the feedback or correction requirements.

### Step 2: Determine the Correction Scope

Consolidate correction requirements from (in priority order):

1. User's message (highest priority).
2. New Jira comments added after the last `## 實作總結` comment.
3. Story-level context if needed (call `getJiraIssue` on the parent story for API notes or spec).

If the correction scope is still unclear, ask the user before proceeding.

### Step 3: Locate the Story Branch

The story branch name is `story/<STORY-KEY>` with the parent story key in uppercase (e.g. `story/PROJ-123`).

```bash
git branch -a | grep <STORY-KEY>
```

Check out the story branch:

```bash
git checkout story/<STORY-KEY>
git pull  # sync if needed
```

### Step 4: Create the Revision Branch

Name the branch using the sub-task key with a `-fix` or `-fix-N` suffix to avoid collision with the original branch:

```bash
git checkout -b <sub-task-key>-fix
```

If `<sub-task-key>-fix` already exists, use `-fix-2`, `-fix-3`, etc.

### Step 5: Gather Code Context

Using the previous implementation comment (`## 實作總結 → 變更檔案`), read the relevant files to understand the current state of the code before making changes.

Also read the applicable instruction files for file types that will be touched (vue, api, views, etc.) from the project's `instructions/` folder.

### Step 6: Apply the Correction

Implement the minimal changes required to address the correction. Follow all project conventions (AGENTS.md, coding guidelines, design system):

- Backend access only through `src/api/`.
- Business logic in `src/use/` composables.
- UI in `src/views/` or `src/components/` as appropriate.
- Prefer i18n keys; add new keys to `src/locales/` if needed.

Do **not** refactor, clean up, or extend beyond what the correction requires.

**Backend blockers**: If during implementation you discover that the correction requires a missing API endpoint, missing response fields, or any other backend support that does not yet exist:

1. Add a clearly marked comment in the affected code (e.g. `// TODO: blocked — requires backend support, see <BUG-KEY>`) and skip that part of the correction.
2. Record each blocker in a list (blocker description + affected file/line) — you will need this in Steps 8a and 8b.

### Step 7: Merge Back into the Story Branch

> If the entire correction was blocked and **no code changes were made**, skip the commit but still proceed with Steps 8a, 8b, and 9.

```bash
git add -A
git commit -m "<SUB-TASK-KEY>-fix: <brief description of correction>"
git checkout story/<STORY-KEY>
git merge --no-ff <SUB-TASK-KEY>-fix -m "Merge <SUB-TASK-KEY>-fix: <brief description of correction>"
```

### Step 8a: Create Backend Bug Cards (if any blockers were found)

For each backend blocker recorded in Step 6, create a new Jira issue under the **same parent story** using `createJiraIssue`:

- **Issue type**: Bug
- **Parent**: the story issue key (same `parent` field as this sub-task).
- **Summary**: a concise description of what backend support is missing.
- **Description**: include the affected frontend file/line, the expected API endpoint or field, and why it is needed.
- **Assignee**: `hank_chen` — look up the account ID with `lookupJiraAccountId` if needed.

After creation, use `createIssueLink` to link the newly created bug card to **this sub-task** with the relationship **"is blocked by"** (this sub-task is blocked by the bug card).

Collect all created bug card keys (e.g. `PROJ-456`) for reference in Step 8b.

### Step 8b: Post Follow-up Comment to Jira

Call `addCommentToJiraIssue` on the **sub-task** card with the following template:

```
## 修正實作總結

### 修正原因
[此次修正的觸發原因，來自哪條留言或哪位使用者的反饋]

### 修正內容
[具體修正了什麼，與上次實作的差異]

### 變更檔案
[異動的檔案清單，每行一個，說明做了什麼]

### API 串接
[若此次修正有影響 API 串接，列出說明；若無則省略]

### 未修正項目（待 Backend 支援）
[若有因缺少 API / 資料欄位而略過的修正，逐項列出：
- 問題描述
- 影響的檔案與位置
- 已開立的 Backend Bug 卡：<BUG-KEY>（is blocked by）
若無略過項目，省略此段]

### 備註
[任何未來 agent 或開發者需要知道的上下文、假設、或待確認事項]
```

Keep the comment factual and concise so the next agent or developer has full context without reading the diff.

### Step 9: Transition Sub-task to "WAIT UAT"

Call `getTransitionsForJiraIssue` to get available transitions, then `transitionJiraIssue` to move the sub-task to **"WAIT UAT"**. Do **not** transition to "Done".

---

## Notes

- **Context priority**: user message > new Jira comments > previous `## 實作總結` comment > story description.
- **Branch naming**: story branch is `story/<STORY-KEY>` with uppercase key (e.g. `story/PROJ-123`); fix branches use the uppercase sub-task key with a `-fix` or `-fix-N` suffix (e.g. `PROJ-124-fix`).
- **No force-push, no squash** — keep merge commits traceable.
- **If `cloudId` is unknown**, always call `getAccessibleAtlassianResources` first — never guess it.
- **If the story branch does not exist locally**, check remote branches and fetch if needed before creating the fix branch.
- **If the correction is blocked** (missing info, ambiguous spec), post a comment on the sub-task explaining the blocker and ask the user for clarification before making any code changes.
- **Backend blockers**: if a missing API or field is discovered during implementation, comment out the affected code with a `// TODO: blocked` marker, create a Bug card under the same story assigned to `hank_chen`, link it to the sub-task as "is blocked by", and document the unresolved items in the `## 修正實作總結` comment. Do **not** hold up the rest of the correction for a backend blocker.
- **Multiple rounds of correction are supported** — each run appends a new `## 修正實作總結` comment, so the full history of changes remains visible on the card.
