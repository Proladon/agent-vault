---
name: bug-fix-jira
description: Fixes bugs described in Jira cards. Analyzes the issue, implements the fix, and produces a root cause and solution summary. Optionally posts the summary as a comment on the Jira card.
---

# Bug Fix from Jira

This skill guides you through analyzing a Jira bug card, implementing the fix in the codebase, and documenting the result.

## When to Use This Skill

Use this skill when the user:

- Provides a Jira issue key (e.g., `PROJ-123`) and asks to fix the bug
- Says "fix this Jira bug" or "resolve this ticket"
- Wants to investigate and fix a reported issue tracked in Jira

## Workflow

### Step 1: Fetch the Jira Card

Use the `getJiraIssue` tool to retrieve the issue details:

- Get the `cloudId` first via `getAccessibleAtlassianResources` if not already known
- Fetch the issue by key, reading: `summary`, `description`, `status`, `priority`, `comments`, **`fixVersions`**

### Step 1.5: Transition to IN PROGRESS

Before analyzing or implementing, transition the Jira issue status to **IN PROGRESS**:

- Use `getTransitionsForJiraIssue` to retrieve available transitions for the issue
- Find the transition whose name matches `IN PROGRESS` (case-insensitive)
- Call `transitionJiraIssue` with the matching transition ID

### Step 1.7: Set Up Git Branch

Before touching any code, set up the correct git branch based on the issue's `fixVersions` field:

1. **Determine the target release branch:**
   - Read the `fixVersions` field from the Jira issue (e.g., `"BOB_2.99"`)
   - Strip everything up to and including the first underscore, then prepend `release/`
   - Example: `"BOB_2.99"` → target branch `"release/2.99"`
   - If `fixVersions` is empty or missing, ask the user which branch to base the fix on before proceeding.

2. **Checkout the release branch:**
   ```bash
   git fetch origin
   git checkout release/2.99   # (use the resolved branch name)
   git pull origin release/2.99
   ```

3. **Create the fix branch** using the format `fix/{issue-key}` (all lowercase):
   ```bash
   git checkout -b fix/cncy-2345   # (use the actual issue key, lowercased)
   ```

Confirm to the user which release branch was targeted and the name of the new fix branch before proceeding.

### Step 2: Analyze the Problem

**IMPORTANT: Always read ALL comments on the Jira card before drawing any conclusions.** Comments often contain the latest decisions, scope changes, or clarifications that override the original description. Treat the most recent comments as the authoritative source of truth.

Carefully read the issue description and every comment in chronological order. Identify:

1. **What is the expected behavior?**
2. **What is the actual (buggy) behavior?**
3. **What is the reproduction path or scenario?**
4. **Which area of the codebase is likely involved?**
5. **Are there any decisions or constraints in the comments that change or narrow the scope?**

If any comment contradicts or refines the original description, follow the comment's guidance. Summarize the key decisions found in comments before proceeding to implementation.

**CRITICAL — Enumerate ALL sub-problems before touching any code:**

A single Jira card often reports multiple distinct symptoms (e.g., "錯誤顯示 X" AND "缺少常駐提示文字"). Before writing the first line of code, explicitly list every symptom and its expected fix as a numbered checklist. Do not begin implementation until every item on the checklist is identified. Failure to enumerate upfront is the most common cause of incomplete fixes.

Example checklist format:
```
Sub-problems to fix:
[ ] 1. List shows org-wide records that should be filtered out
[ ] 2. Persistent hint text is missing above the list
```

Use semantic search, grep, and file reading tools to locate the relevant code.

### Step 3: Implement the Fix

**Before implementing:** Re-read your sub-problem checklist from Step 2. Treat each item as a separate acceptance criterion and tick it off only when the code change fully satisfies it.

- Make the minimal, targeted code changes needed to resolve **every sub-problem** listed in the checklist
- Do not transition to WAIT UAT until every checkbox is ticked
- Follow all project coding standards and conventions
- Do not introduce unrelated changes
- When committing, use the format: `{ISSUE_KEY}: {修正內容}` (e.g., `CNCY-2345: 修正列表未正確過濾組織範圍資料`)

### Step 4: Produce the Root Cause & Solution Summary

After fixing the bug, always output a summary in the following format:

```
# 根本原因與解決方案摘要

## 根本原因
[根本原因摘要]

## 解決方案
[解決方案摘要]

具體調整：
[具體調整內容]
```

- **根本原因 (Root Cause):** A concise explanation of *why* the bug existed.
- **解決方案 (Solution):** A concise explanation of the approach taken to fix it.
- **具體調整 (Specific Changes):** A bullet list of each code change made (file, what changed, and why).

### Step 5: Transition to WAIT UAT

After the fix is implemented and the summary is ready, transition the Jira issue status to **WAIT UAT**:

- Use `getTransitionsForJiraIssue` to retrieve available transitions for the issue
- Find the transition whose name matches `WAIT UAT` (case-insensitive)
- Call `transitionJiraIssue` with the matching transition ID
- Confirm to the user that the status has been updated.

### Step 6: Create Pull Request

After the WAIT UAT transition, create a PR targeting the release branch determined in Step 1.7:

```bash
gh pr create \
  --title "fix({ISSUE_KEY}): {ISSUE_SUMMARY}" \
  --base release/2.99 \
  --body "$(cat <<'EOF'
## Jira
{ISSUE_URL}

## 根本原因
{ROOT_CAUSE}

## 解決方案
{SOLUTION}

## 具體調整
{SPECIFIC_CHANGES}
EOF
)"
```

- Replace `{ISSUE_KEY}`, `{ISSUE_SUMMARY}`, `{ISSUE_URL}`, and the summary sections with the actual values from Step 4.
- Confirm the PR URL to the user after creation.

### Step 7: Ask About Posting to Jira

After presenting the summary, use the `vscode/askQuestions` tool to ask the user:

```json
{
  "questions": [
    {
      "header": "Post to Jira",
      "question": "是否要將「根本原因與解決方案摘要」留言到 Jira 卡片上？（{ISSUE_KEY}）",
      "options": [
        { "label": "是，留言到 Jira", "recommended": true },
        { "label": "否，不需要" }
      ]
    }
  ]
}
```

If the user selects **是，留言到 Jira**:
- Use the `addCommentToJiraIssue` tool to post the summary as a Markdown comment on the issue.
- Confirm to the user that the comment was posted successfully.

If the user selects **否，不需要**:
- Acknowledge and end the workflow.

If the user selects **等等，還有地方需要修改**:
- Return to Step 3 to allow for additional code changes before finalizing the summary, then repeat Step 5 (WAIT UAT transition), Step 6 (PR creation), and Step 7.

## Notes

- Always fetch the Jira issue first before searching the codebase — the issue description is the primary source of truth.
- If the issue key is not provided, ask the user for it before proceeding.
- If the `cloudId` is unknown, call `getAccessibleAtlassianResources` to obtain it.
- Keep the summary factual and concise — it will be readable by the whole team on Jira.

## Lessons Learned

### Incomplete Fix — Missing Sub-problems (CNCY-9918, 2026-05-27)

**What happened:** The Jira card reported two distinct problems:
1. Branch list incorrectly showed org-wide class ticket records (filtering bug).
2. The persistent hint text was missing above the list (UI omission).

The agent fixed problem 1 first but initially skipped problem 2. The user had to explicitly remind the agent, causing an extra round-trip.

**Root cause of the agent mistake:** The agent did not enumerate all sub-problems upfront before coding, so the second symptom ("缺少常駐提示文字") was silently dropped after the first fix was implemented.

**Rule added:** Step 2 now requires building an explicit numbered sub-problem checklist before any code changes. Step 3 requires ticking off every item before transitioning to WAIT UAT.