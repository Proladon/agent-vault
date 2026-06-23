---
name: cbg-git-flow
user-invocable: true
description: "Use when: creating branches, opening PRs, merging features, fixing bugs, handling releases, deploying versions, or any git flow operation. Covers branch naming, commit messages, PR workflow, code review, and version tagging."
---

# Git Flow Skill

Follow this team-standard Git Flow for all git operations.

## Branch Structure

| Branch              | Purpose                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `master`            | Always production-ready stable code.                                                        |
| `release/[version]` | Development branch for a version (e.g. `release/2.97`). Created from `master`.              |
| `feature/[name]`    | New feature. Created from `release/[version]`. Merge back to `release/[version]` when done. |
| `fix/[name]`        | Bug fix. Created from `release/[version]` or `master` (hotfix).                             |

## Version Numbering

Format: `[product].[feature].[patch]`

- **Product number**: Incremented on major updates.
- **Feature number**: Incremented per software release (schedule set by PM and RD together).
- **Patch number**: Incremented for hotfixes or UAT-environment fixes.

## Workflow

1. **Start task**: Switch to the target `release` branch, then create a `feature/` or `fix/` branch.
2. **Commit**:
   - Format: `type: description [IssueID]`
   - Example: `feat: add user login feature #JIRA-1234`
   - One commit per logical change; keep changes small.
3. **Pull Request**:
   - Use `resources/PR_TEMPLATE.md` as the PR description template.
   - PR must include: change description, test plan, linked Jira issue.
   - Notify team via Slack for Code Review.
4. **Merge & Deploy**:
   - After review approval and tests pass, merge into `release`.
   - Delete the feature branch after merge.
5. **Deploy**: UAT and PROD deployments are triggered by version Tags.

## Feature Branch Policy: Single Branch Per Feature

**Default**: One feature = one `feature/` branch, even when the feature spans multiple repos or multiple logical sub-tasks.

- **Naming**: `feature/[short-feature-name]`, e.g. `feature/earthanature-cross-border-vietnam`.
- **Commits**: Use multiple logical commits within the single branch to keep changes reviewable (one commit per sub-task is fine).
- **Multi-repo**: For features that span repos (e.g. `bob-backend` + `bob-dashboard`), create one feature branch **per repo** but with the **same feature name**. Each repo gets its own PR.
  ```
  bob-backend:     feature/earthanature-cross-border-vietnam
  bob-dashboard:   feature/earthanature-cross-border-vietnam
  ```
- **When to split**: Only split into multiple feature branches when sub-tasks are **independently deployable** and have **different reviewers or different merge timing**. If in doubt, keep it in one branch.

## Special Cases

- **Cross-version sync**: If `release/1.2` needs unreleased features from `release/1.1`, merge `release/1.1` into `release/1.2` — never merge an in-progress `feature/` branch directly.
- **Hotfix**: For production emergency fixes, branch from `master`, fix, then merge back to `master` and the current `release` branch.

## PR Template

Use the template at `resources/PR_TEMPLATE.md` in this skill folder for all pull requests. It covers:

- Related issues / Jira / version
- Scope of changes per repo
- Design reference (SD / TA / PRD sections)
- Test plan with acceptance criteria (A#)
- Smoke test checklist
- Deployment stage and ordering
- Rollback plan
- Checklist (conventions, i18n, permissions)

Fill in each section before requesting code review.

## Allowed Git Operations

- `git checkout -b feature/[name] release/[version]`
- `git checkout -b fix/[name] release/[version]`
- `git commit -m "feat: description [IssueID]"`
- `git push origin feature/[name]`
- `git checkout release/[version] && git merge feature/[name]`
- `git tag [version]` (for releases)
