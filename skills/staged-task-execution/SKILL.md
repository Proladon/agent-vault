---
name: staged-task-execution
description: "Use when requirements or change scope is large, complex, or spans multiple files/components. Creates a temp/ session folder with tasks.md (atomic task breakdown) and progress.md (context tracking), then executes one task at a time with user confirmation between each step. Use for: large feature implementation, multi-component refactoring, complex bug fixes with many steps, migration work, or any request that involves more than 2-3 independent changes. Trigger phrases: step by step, staged, one at a time, don't rush, large feature, big change, 分步執行, 逐步完成, 一步一步, 分階段, 大功能, 大改動, 不要一次做完, 慢慢來, 確認後再繼續, 按步驟. Resume phrases: continue where we left off, resume, pick up from last task, 繼續上次, 繼續執行, 繼續做, 從上次繼續, 接著做"
argument-hint: "Describe the feature or change scope"
---

# Staged Task Execution

## Purpose

Break large requirements into small, atomic tasks. Execute one task at a time. Track state and context in the project's `temp/` folder so work can be paused and resumed safely.

**Announce at start:** "I'm using the staged-task-execution skill to plan and track this work."

---

## When to Use This Skill

Trigger this workflow when **any** of the following is true:

- The request involves changes to more than 2-3 files
- The requirement has multiple distinct phases (e.g., API → store → component)
- The work could take more than one exchange to complete
- The task involves creating new views, new features, or significant refactoring
- The user uses any of the following trigger phrases:

**English:** "step by step", "staged", "one at a time", "don't rush", "large feature", "big change", "don't do everything at once", "large scope", "many changes", "confirm before continuing"

**中文：** 「分步執行」、「逐步完成」、「一步一步」、「分階段」、「大功能」、「大改動」、「不要一次做完」、「慢慢來」、「確認後再繼續」、「按步驟」、「逐一確認」、「分批執行」

**Resume triggers — English:** "continue where we left off", "resume", "pick up from last task", "keep going", "what's next"

**Resume triggers — 中文：** 「繼續上次」、「繼續執行」、「繼續做」、「從上次繼續」、「接著做」、「繼續進行」、「繼續下一步」、「繼續完成」

> ⚠️ **Important:** 「繼續完成 <feature name>」means **resume** the workflow from the last pending task — it does NOT mean auto-complete all remaining tasks. Step 7 (user confirmation between each task) still applies.

---

## Resume: Continue a Previous Session

If the user asks to **resume** or **continue** a previous task (using any resume trigger phrase above), do **not** start a new plan. Instead:

1. **Locate the session folder:** Search `temp/` for folders containing a `progress.md` file. If the user mentioned a specific feature name, look for that folder; otherwise list all candidates and ask the user which one to resume.
2. **Read `progress.md`:** Understand the current status, completed tasks, key decisions, and what the next step is.
3. **Read `tasks.md`:** Identify which tasks are done (`[x]`) and which remain (`[ ]`).
4. **Summarize state to user:** Briefly report:
   - Feature name
   - How many tasks are done vs. total
   - What the next pending task is
5. **Ask for confirmation** before executing the next task — use the same `vscode_askQuestions` prompt from Step 7.
6. **Continue from the next pending task** — proceed with Step 5 as normal.

> Do NOT re-run completed tasks. Do NOT recreate the session folder or overwrite existing `tasks.md` / `progress.md`.
> ⚠️ Even if the user used a phrase like 「繼續完成」, this does **not** grant permission to skip Step 7 confirmations. Step 7 is mandatory after every single task, including during resume.

---

## Step 1: Assess & Plan

Before writing any code, analyze the full scope of the requirement:

1. Read relevant existing files to understand the current state
2. Decompose the requirement into **small, atomic tasks** — each task should be completable in a single focused effort (one component, one API endpoint, one store module, etc.)
3. Order tasks by dependency (foundational work first)
4. Identify which tasks are blocking others

---

## Step 2: Create the Session Folder

Create a folder in `temp/` named after the feature using kebab-case:

```
temp/<feature-name>/
├── tasks.md
├── progress.md
└── references/
    ├── spec.md
    ├── backend.md
    └── ...others

temp/archive/                  ← completed features are moved here
└── <feature-name>/

skills/staged-task-execution/scripts/
├── setup.py                   ← creates the session folder structure
└── archive.py                 ← moves a completed feature to temp/archive/
```

**Naming convention:** Use a short English kebab-case description of the feature (e.g., `member-point-exchange`, `ai-campaign-push`, `device-info-panel`).

**Use the setup script** to create the folder and empty stub files in one step:

```shell
python skills/staged-task-execution/scripts/setup.py <feature-name>
```

**References folder:** Create a `references/` subfolder and **immediately copy all user-provided materials into it**:

- If the user attached or linked a spec file (e.g., from `specBook/`), copy its full content into `references/spec.md`
- If the user provided backend API docs, schemas, or endpoint lists, copy them into `references/backend.md`
- If the user provided any other reference material (Figma descriptions, migration notes, existing code excerpts), copy each into an appropriately named file under `references/`
- If no material was provided for a category, skip that file — do not create empty placeholders

Common reference files:

- `spec.md` — functional spec, product requirements, or specBook content
- `backend.md` — backend API endpoints, request/response schemas, authentication notes
- Any other reference material (e.g., `figma.md`, `existing-api.md`, `migration-notes.md`)

These files are **read-only reference material** — they describe what to build, not the implementation plan.

---

## Step 3: Write tasks.md

Format:

```markdown
# Tasks: [Feature Name]

## Overview

[1-2 sentence summary of what this work accomplishes]

## Task List

- [ ] 1. [Task Name] — [one-line description]
- [ ] 2. [Task Name] — [one-line description]
- [ ] 3. [Task Name] — [one-line description]
     ...

## Task Details

### 1. [Task Name]

**Files:** `src/path/to/file.vue`, `src/api/module.js`
**What to do:** [Detailed description of what this task involves]
**Dependencies:** None / Task N

### 2. [Task Name]

...
```

Rules for tasks:

- Each task touches a **single concern** (one API function, one component, one store module)
- Tasks must be **independently verifiable** — you can tell when one is done
- Avoid tasks like "implement feature X" — split into "create API", "add store module", "build component"

---

## Step 4: Write progress.md

Format:

```markdown
# Progress: [Feature Name]

## Status

**Current:** Task [N] of [Total] — [Task Name]
**Last Updated:** [date]

## Context & Background

[Key facts about the existing codebase relevant to this work. API patterns used, store structure, component conventions, etc.]

## Completed Tasks

[Empty initially — fill in as tasks are completed]

## Active Task

**Task [N]: [Name]**
[What is currently being worked on]

## Key Decisions

[Design decisions made, patterns chosen, deviations from standard approach — anything a future agent needs to know]

## Files Modified

[List of files changed so far]

## Next Step

[What should happen next]
```

---

## Step 5: Execute One Task

1. Announce which task is starting: "Starting Task N: [Name]"
2. Implement **only that task** — do not work ahead
3. Follow all project coding standards from instructions files
4. After completing the task implementation, verify no obvious errors
5. **Always proceed to Step 6 → Step 7. Never skip to the next task automatically.**

---

## Step 6: Update files after each task

After completing a task:

1. **Update tasks.md**: Mark the completed task with `[x]`
2. **Update progress.md**:
   - Move task to "Completed Tasks" with a brief note on what was done
   - Update "Current" status to next task
   - Add any files modified
   - Record any decisions made
   - Update "Next Step"

---

## Step 7: Ask User to Continue ⚠️ MANDATORY

> **This step is NON-NEGOTIABLE. You MUST stop and ask the user before proceeding to the next task. Do NOT auto-continue, do NOT skip this step, do NOT start the next task without explicit user confirmation.**

Use the `vscode_askQuestions` tool to ask:

```
header: "Continue?"
question: "Task N complete: [Task Name]. Ready to proceed to Task N+1: [Next Task Name]?"
options:
  - label: "Yes, continue"       (recommended: true)
  - label: "No, pause here"
  - label: "Skip to a different task"
  - label: "Adjust the plan first"
allowFreeformInput: true
```

**If user says yes:** Proceed to Step 5 with the next task.  
**If user says no/pause:** Save all state to `progress.md`, confirm to user where context is saved, and stop.  
**If user says skip:** Ask which task they want to jump to, update progress.md, then execute.  
**If user wants to adjust:** Update `tasks.md` with the revised plan, confirm the new plan with the user, then continue.

---

## Step 8: Completion

When all tasks are marked `[x]` in tasks.md:

1. Update progress.md status to "Completed"
2. **Archive the feature folder** by running the archive script:

   ```shell
   python skills/staged-task-execution/scripts/archive.py <feature-name>
   ```

   This moves `temp/<feature-name>/` to `temp/archive/<feature-name>/`.

3. Notify the user: "All [N] tasks complete. Session context archived to `temp/archive/<feature-name>/`."
4. Optionally summarize what was built/changed

---

## File Lifecycle

The `temp/` folder is a **working scratchpad** — files there are not committed by default.

- `temp/<feature-name>/` — active session folder, created by `setup.py`
- `temp/archive/<feature-name>/` — completed sessions, moved here automatically by Step 8 via `archive.py`

The user may choose to delete the `temp/` folder entirely or keep the archive for future reference.

---

## Example Folder Names

| Scenario                      | Folder Name                           |
| ----------------------------- | ------------------------------------- |
| AI campaign push feature      | `temp/ai-campaign-push/`              |
| Member point exchange records | `temp/member-point-exchange/`         |
| Refactor FeatureKeyDebugger   | `temp/feature-key-debugger-refactor/` |
| Device info panel             | `temp/device-info-panel/`             |
| Custom field sub-options      | `temp/custom-field-sub-options/`      |
