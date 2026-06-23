# Pull Request Template

## Related

| Item    | Value                                                          |
| :------ | :------------------------------------------------------------- |
| Jira    | [CNCY-XXXX](https://wishmobile.atlassian.net/browse/CNCY-XXXX) |
| Version | `release/X.XX`                                                 |
| Feature | `feature/[name]`                                               |

## Change Description

<!-- What does this PR do? Why is it needed? -->

## Scope of Changes

| Repo              | Files Changed | Type                        |
| :---------------- | :------------ | :-------------------------- |
| bob-backend       |               | 🆕 new / ✏️ edit / ♻️ reuse |
| bob-dashboard     |               | 🆕 new / ✏️ edit / ♻️ reuse |
| bob-frontend      |               | 🆕 new / ✏️ edit / ♻️ reuse |
| bob-customization |               | 🆕 new / ✏️ edit / ♻️ reuse |

<!-- Delete rows for repos not touched by this PR. -->

## Design Reference

<!-- Link to the SD / TA / PRD sections this PR implements. -->

- SD: `specs/[feature]/[feature]-SD.md` §[sections]
- TA: `specs/[feature]/[feature]-TA.md` §[sections]

## Test Plan

<!-- List acceptance criteria this PR satisfies (A# from SD §10). -->

- [ ] A1: ...
- [ ] A2: ...
- [ ] A3: ...

## Smoke Test Checklist

<!-- Post-deploy verification steps from SD §8.3. -->

- [ ] Login as affected shop account → verify expected behavior
- [ ] Login as unaffected shop account → verify no regression
- [ ] URL direct access to hidden routes → verify redirect

## Deployment Note

<!-- Deployment stage from SD §12 and any ordering dependencies. -->

| Stage | Description | Prerequisite |
| :---- | :---------- | :----------- |
|       |             |              |

## Rollback Plan

<!-- How to revert if something goes wrong. -->

- **Dashboard**: `git revert` to previous version
- **Backend data script**: DELETE/UPDATE to restore previous state

## Checklist

- [ ] Code follows existing patterns and conventions
- [ ] No changes to files in the "do not modify" list (SD §11)
- [ ] i18n: all user-visible strings use `$t()` (no hardcoded Chinese)
- [ ] Permission: deny rules are namespace-precise (e.g. `admin.member.*`)
- [ ] Tests pass locally
- [ ] PR description is complete and linked to Jira
