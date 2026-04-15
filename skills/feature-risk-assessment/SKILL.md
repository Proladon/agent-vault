---
name: feature-risk-assessment
description: "Performs a structured risk assessment for new features or code changes. Use when evaluating implementation feasibility, scoring risks, or deciding between approaches before starting development. Explores the codebase, identifies blocking problems, assesses existing product impact, produces a weighted risk score matrix, and generates a markdown report. Trigger phrases: risk assessment, 風險評估, 可行性分析, 實作難度, assess risk, evaluate feasibility, impact analysis, 影響分析, 評估風險, should we build this, 這樣做有什麼風險, 上線後有什麼影響, 怎麼實作比較安全"
argument-hint: "Describe the feature or change to evaluate (e.g., 'add shopId query param to all routes for shareable links')"
---

# Feature Risk Assessment

## Purpose

Systematically evaluate the risks, blockers, and downstream product impacts of a proposed feature or code change — **before** implementation begins. Produces a scored markdown report to guide the implementation decision.

**Announce at start:** "I'm using the feature-risk-assessment skill to evaluate this change."

---

## When to Use This Skill

Use this skill when:
- A user asks about implementation risks, feasibility, or difficulty
- A user wants to compare implementation approaches
- A change touches core infrastructure (routing, auth, state management, APIs)
- The team needs a decision document before committing to an approach

**English triggers:** "risk assessment", "assess risk", "evaluate feasibility", "impact analysis", "should we build this", "is this risky", "what could go wrong"

**中文 triggers:** 「風險評估」、「可行性分析」、「實作難度」、「影響分析」、「評估風險」、「這樣做有什麼風險」、「上線後有什麼影響」、「怎麼實作比較安全」、「有沒有更好的做法」、「這樣改安全嗎」

---

## Workflow

### Phase 1: Understand the Change

Read the user's request carefully. Identify:
1. **What is the desired end user behavior?** (e.g., "open a URL with `?shopId=X` and auto-switch to that shop")
2. **What system areas are likely involved?** (routing, auth, state, APIs, UI components)
3. **Are there any pre-existing patterns in the codebase for something similar?**

If the request is ambiguous, use `vscode_askQuestions` to clarify scope before exploring.

---

### Phase 2: Codebase Archaeology

Explore the codebase with targeted searches. Focus on:

1. **Primary entry points** — Where does the change happen first? (e.g., route guard, component `mounted`, API interceptor)
2. **State management** — How is the relevant state stored, read, and mutated? (Vuex, localStorage, sessionStorage, composables)
3. **Existing call sites** — How many places currently do the thing you're changing?
4. **Side effects** — What does the current behavior trigger as a consequence? (API calls, store mutations, navigation, analytics events)
5. **Existing workarounds or TODOs** — Look for comments like `// TODO`, `// HACK`, `// workaround` near the affected code — they indicate known fragility
6. **Test coverage** — Are there unit or E2E tests for the affected paths?

> Use `semantic_search`, `grep_search`, and `read_file` to gather this context. Deploy a `runSubagent` for deep multi-file exploration to avoid cluttering the main thread.

---

### Phase 3: Identify Implementation Approaches

List 2–3 realistic implementation strategies. For each approach, document:

| Dimension | Approach A | Approach B |
|-----------|-----------|-----------|
| Scope of change | … | … |
| Files/systems affected | … | … |
| Backwards compatible? | … | … |
| Estimated effort | … | … |
| Reversible? | … | … |

Recommend a primary approach based on the tradeoff, but note if the user's context affects this choice.

---

### Phase 4: Identify Blocking Problems

For each approach (or the selected one), identify problems that **must be solved** for the feature to work correctly. Classify by severity:

| Priority | Problem | Why It Blocks | Mandatory Fix |
|----------|---------|---------------|---------------|
| 🔴 Blocking | … | … | … |
| 🟡 Medium | … | … | … |
| 🟢 Low / Acceptable | … | … | … |

**Blocking (🔴):** Feature is broken or produces incorrect behavior without this fix.  
**Medium (🟡):** Feature works but causes regressions, UX degradation, or performance issues.  
**Low (🟢):** Known tradeoff that is acceptable or is a product decision.

---

### Phase 5: Existing Product Impact Analysis

After identifying the mandatory fixes, assess what existing features may be affected post-launch. For each impacted area:

| Impact | Affected Feature | Root Cause | Fix Required? |
|--------|-----------------|------------|---------------|
| 🔴 Must Fix | … | … | Yes |
| 🟡 Should Fix | … | … | Recommended |
| 🟢 Acceptable | … | … | Product decision |

Focus on:
- **Missing side effects**: Does the new code path do everything the old path did? (API calls, store resets, analytics, permission reloads)
- **State leakage**: Does persistent state (localStorage, tabs, cached queries) carry forward incorrectly?
- **Guards and interceptors**: Does any global handler (route guard, API interceptor, watcher) behave unexpectedly on the new path?

---

### Phase 6: Risk Scoring

Score the overall risk using a weighted matrix. Adjust dimensions and weights based on the type of change:

| Dimension | Weight | Score (0–100) | Weighted |
|-----------|--------|---------------|---------|
| Core path danger (how central is the modified code?) | 30% | … | … |
| Change stability (how reliable is the key mechanism?) | 25% | … | … |
| Residual risk after mandatory fixes | 20% | … | … |
| Unknown edge cases | 15% | … | … |
| Test coverage difficulty | 10% | … | … |
| **Total** | **100%** | — | **X/100** |

**Scoring guide (higher = riskier):**
- 0–20: Low risk, proceed confidently
- 21–40: Moderate risk, proceed with mitigations
- 41–60: Elevated risk, consider adding E2E tests before launch
- 61–80: High risk, strongly recommend phased rollout or feature flag
- 81–100: Very high risk, reconsider approach

Also produce a **comparison table**:

| Scenario | Risk Score | Notes |
|----------|-----------|-------|
| No change (baseline) | 0/100 | — |
| Approach B, no fixes | X/100 | — |
| Approach B + mandatory fixes | X/100 | **Recommended** |
| Approach B + fixes + E2E tests | X/100 | Target state |
| Approach A (alternative) | X/100 | — |

---

### Phase 7: Generate Report

Save all findings to a markdown file in the project root (or `specBook/` if the project uses that convention):

**Filename:** `風險評估報告_{功能名稱}.md` or `risk-assessment_{feature-name}.md`

The report must include:
1. Feature summary and evaluation date
2. Implementation approaches comparison table (Phase 3)
3. Blocking problems with priority table (Phase 4)
4. Existing product impact with fix table (Phase 5)
5. Risk scoring matrix and comparison table (Phase 6)
6. **Mandatory fixes summary** — a numbered checklist of all required changes if proceeding
7. **Recommendation** — one of: Proceed / Proceed with caution / Do not proceed

---

### Phase 8: Present & Confirm

After generating the report:

1. Summarize the key findings in 3–5 bullet points in the chat
2. State the overall risk score and recommendation
3. Ask the user what they want to do next using `vscode_askQuestions`:

```
{
  "questions": [
    {
      "header": "Next Step",
      "question": "評估完成，接下來您想怎麼做？",
      "options": [
        { "label": "開始實作（產出實作規格）", "recommended": true },
        { "label": "分步驟執行（搭配 staged-task-execution）" },
        { "label": "只是評估，目前不實作" },
        { "label": "重新評估另一種方案" }
      ]
    }
  ]
}
```

---

## Output Quality Checklist

Before finalizing the report, verify:
- [ ] All blocking problems have a corresponding mandatory fix
- [ ] Phase 5 checked for "missing side effects" (things old code did that new path doesn't)
- [ ] Risk score dimensions reflect the specific type of change (routing vs. component vs. API)
- [ ] Comparison table covers both "no-fix" and "with-fix" scenarios
- [ ] Report is saved to file, not just output to chat

---

## Notes on Common Patterns

**Routing/navigation changes** are highest risk — guard functions like `beforeEach` are global and any bug affects all pages. Always check:
- What the guard currently does for all auth states (logged in, logged out, mid-login)
- Whether `resetRouter()` or route regeneration is involved (creates re-entry loops)
- Whether any redirect workaround pages exist (e.g., `Redirect.vue`)

**State management changes** — check for stale state in:
- Persistent localStorage keys
- Vuex modules that are NOT reset on navigation
- Page tabs / browser history that may replay old state

**API-touching changes** — count how many API calls are triggered per flow and verify all are present in the new path.
