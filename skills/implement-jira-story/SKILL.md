---
name: implement-jira-story
description: 'Implement a Jira story by executing its sub-tasks one by one. Use when: user provides a Jira story URL or issue key and asks to implement it, develop it, or work through its sub-tasks. Optionally filters sub-tasks by assignee. Creates a story branch, then per sub-task: creates a feature branch, sets status to IN PROGRESS, implements the code, merges back to story branch, and posts a comment summary. Skips sub-tasks not in "Selected for development" status or not assigned to the specified assignee.'
argument-hint: '<Jira story URL or issue key> [--assignee <name>]'
---

# Implement Jira Story

This skill drives end-to-end implementation of a Jira story by iterating its sub-tasks, branching, coding, merging, and documenting each step.

## When to Use

- User provides a Jira story link (e.g. `https://xxx.atlassian.net/browse/PROJ-123`) or issue key and says "implement this", "develop this story", "work through the sub-tasks", etc.
- User wants to systematically implement all "Selected for development" sub-tasks in a story.
- User can optionally scope execution to a specific assignee (e.g. "只做 rex 的卡片", "--assignee rex", "assigned to rex").

## Pre-flight Checks

Before beginning, obtain:
1. **Jira issue key** — parse from the URL argument or ask the user.
2. **`cloudId`** — call `getAccessibleAtlassianResources` if not already cached.
3. **Current git branch** — run `git branch --show-current`; this is the *base branch* for the story branch.
4. **Assignee filter** (optional) — if the user specifies an assignee (by name, display name, or `--assignee` flag), record it. The filter is case-insensitive and matched against the sub-task's `assignee.displayName` field. If not specified, no assignee filter is applied.

---

## Workflow

### Step 1: Fetch the Story Card

Call `getJiraIssue` with the story key. Collect:

- `summary` — story title.
- `description` — may contain spec details.
- `comments` — look for backend API integration notes (endpoints, request/response shapes, auth headers, etc.).
- `subtasks` — list of sub-task keys and their statuses.

If the story has no sub-tasks, surface the story itself as a single work item and proceed to Step 3.

### Step 2: Fetch Each Sub-task

For every sub-task listed in the story, call `getJiraIssue` to get:

- `status.name` — only proceed with sub-tasks whose status is exactly **"Selected for development"**.
- `assignee.displayName` — if an assignee filter was provided, only proceed with sub-tasks whose `assignee.displayName` matches (case-insensitive). Sub-tasks with no assignee are always skipped when a filter is active.
- `summary` — sub-task title (used in branch names and commit messages).
- `description` — may contain additional spec or acceptance criteria.

Apply **both** filters together: a sub-task must satisfy **all** active conditions to be included in the work list.

If none qualify, inform the user and stop.

### Step 3: Create the Story Branch

```bash
git checkout -b story/<STORY-KEY>
```

Where `<STORY-KEY>` is the Jira issue key in uppercase (e.g. `PROJ-123`), branched off the current base branch. If the branch already exists, check it out instead (`git checkout story/<STORY-KEY>`).

---

### Step 4: Implement Each Sub-task (loop)

Repeat the following for each sub-task in the work list:

#### 4a. Transition Sub-task to "In Progress"

Call `getTransitionsForJiraIssue` to get available transitions, then `transitionJiraIssue` to move the sub-task to **"In Progress"**.

#### 4b. Create the Sub-task Branch

```bash
git checkout -b <SUB-TASK-KEY>
```

Branched off the story branch (e.g. `PROJ-124`, `PROJ-125`).

#### 4c. Gather Context

Before coding, consolidate all available context:

- Story description and API notes from comments.
- Sub-task description and acceptance criteria.
- Relevant existing code located via workspace search tools.
- Any spec the user provided directly.

Read the applicable instruction files for the file types that will be touched (vue, api, views, plan, etc.) per the project's `instructions/` folder.

#### 4d. Implement the Sub-task

Follow all project conventions (AGENTS.md, coding guidelines, design system).

- Backend access only through `src/api/`.
- Business logic in `src/use/` composables.
- UI in `src/views/` or `src/components/` as appropriate.
- Use existing components from `references/component_catalog.json` before creating new ones.
- Prefer i18n keys; add new keys to `src/locales/` if needed.

Make the minimal changes required to fulfil the sub-task's acceptance criteria.

#### 4e. Merge Sub-task Branch into Story Branch

```bash
git add -A
git commit -m "<SUB-TASK-KEY>: <sub-task summary>"
git checkout story/<STORY-KEY>
git merge --no-ff <SUB-TASK-KEY> -m "Merge <SUB-TASK-KEY>: <sub-task summary>"
```

#### 4f. Post Implementation Summary to Jira

Call `addCommentToJiraIssue` on the **sub-task** card with the following Markdown template:

```
## 實作總結

### 實作內容
[本次實作的功能說明]

### 變更檔案
[異動的檔案清單，每行一個，說明做了什麼]

### API 串接
[若有 API 串接，列出使用的 endpoint 及說明；若無則省略]

### 備註
[任何未來 agent 或開發者需要知道的上下文、假設、或待確認事項]
```

Keep the comment factual, concise, and written so the next agent or developer can use it as full context without reading the diff.

#### 4g. Transition Sub-task to "WAIT UAT"

Call `getTransitionsForJiraIssue` to get available transitions, then `transitionJiraIssue` to move the sub-task to **"WAIT UAT"**. Do **not** transition to "Done".

---

### Step 5: Summary Report

After all sub-tasks are processed, output a summary:

```
# Story 實作完成

Story: <STORY-KEY> — <story summary>
Story 分支: story/<STORY-KEY>
Assignee 過濾: <assignee name 或「無」>

## 完成的 Sub-tasks
| Sub-task | 標題 | Assignee | 分支 |
|----------|------|----------|------|
| PROJ-124 | ... | rex | PROJ-124 |
| PROJ-125 | ... | rex | PROJ-125 |

## 跳過的 Sub-tasks
| Sub-task | 狀態 | Assignee | 原因 |
|----------|------|----------|------|
| PROJ-126 | Done | rex | 狀態不符 |
| PROJ-127 | Selected for development | alice | Assignee 不符過濾條件 |
```

---

## Notes

- **Branch naming**: story branch uses `story/<STORY-KEY>` prefix with uppercase key (e.g. `story/PROJ-123`); sub-task branches use the uppercase key directly (e.g. `PROJ-124`). Git branch names are case-sensitive — always use uppercase for Jira keys.
- **No force-push, no squash by default** — keep merge commits so history is traceable per sub-task.
- **Spec source priority**: user-provided spec > sub-task description > story description > story comments.
- **If `cloudId` is unknown**, always call `getAccessibleAtlassianResources` first — never guess it.
- **Assignee matching** is case-insensitive and matches on `displayName`. If the user provides a partial name (e.g. "rex"), match any `displayName` that contains that string.
- **If a sub-task implementation is blocked** (missing API info, unclear spec), post a comment on the sub-task explaining the blocker, skip it for now, and continue with the next one. Report all skipped items in the Step 5 summary.
- **One sub-task at a time** — do not start the next sub-task until the current one is merged and commented.
