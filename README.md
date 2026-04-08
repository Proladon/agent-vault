# Agent Vault

一個集中管理 Agent 設定的倉庫，包含 Skills、Instructions 與 Patterns，用於提升 AI 輔助開發的品質與一致性。

---

## Skills

Skills 是可被 Copilot Agent 自動觸發的工作流程，詳見 [skills-catalog.md](skills-catalog.md)。

| Skill                                                          | 說明                                               |
| -------------------------------------------------------------- | -------------------------------------------------- |
| [staged-task-execution](skills/staged-task-execution/SKILL.md) | 將複雜任務分解為多階段原子步驟，逐步確認執行       |
| [ui-spec-writer](skills/ui-spec-writer/SKILL.md)               | 將截圖或 PM spec 轉換為口語化敘述式 spec Markdown  |
| [ui-spec-list-writer](skills/ui-spec-list-writer/SKILL.md)     | 將截圖或功能描述轉換為條列式模組異動 spec Markdown |

---

## Instructions

放置 `.instructions.md` 檔案，供 Copilot 在對應檔案類型時自動套用。

| 路徑                                         | 說明                        |
| -------------------------------------------- | --------------------------- |
| `instructions/common/plan.instructions.md`   | specBook 計畫文件的撰寫規範 |
| `instructions/vue/vue.instructions.md`       | Vue 專案通用指令            |
| `instructions/vue/component.instructions.md` | Vue 元件撰寫規範            |
| `instructions/vue/api.instructions.md`       | API 呼叫規範                |
| `instructions/vue/views.intructions.md`      | Views 頁面規範              |

---

## Patterns

放置常見場景的寫法範例，供 AI 或開發者參考。

| 路徑                                  | 說明             |
| ------------------------------------- | ---------------- |
| `patterns/vue/displayData.pattern.md` | 資料顯示寫法     |
| `patterns/vue/displayText.pattern.md` | 文字顯示寫法     |
| `patterns/vue/showControl.pattern.md` | 條件顯示控制寫法 |
