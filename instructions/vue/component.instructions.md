---
applyTo: 'src/components/**/*.vue'
description: 'Coding standards for Vue components in the components directory'
---

# Project coding standards for Vue components in the components directory

元件資料夾結構規範

每個元件的資料夾必須遵循下列結構：

```
<component name>/
├─ components/                      # 子元件（可選）
│ ├─ <ChildComponentA>.vue
│ ├─ <ChildComponentB>.vue
│ └─ index.ts
├─ __tests__/                       # 單元測試（可選）
│ └─ <component name>.spec.ts
├─ examples/                       # 範例子元件（可選）
│ └─ <example name>Example.vue
├─ <component name>Example.vue     # 主要範例檔案（必要）
├─ <component name>.vue             # 主元件
├─ types.ts                         # 型別定義（可選）
├─ index.ts                         # 匯出
├─ README.md                        # 主要說明文件
└─ MIGRATION.md                     # 遷移指南（可選，僅在需要時）
```

# 目的

- 統一專案中元件的檔案與目錄組織，提升可讀性、可維護性與可重用性。
- 限制文件數量，避免元件資料夾過於雜亂。

# 欄位說明

## 根資料夾 (<component name>/)

- 以元件名稱命名的資料夾（例如 MyButton/）。資料夾名稱應遵循專案命名規範（PascalCase）。

## components/ (optional)

- 放置此元件所有的子元件或相關小元件（每個子元件為獨立檔案，如 ChildItem.vue）。
- 建議在此資料夾加入 index.ts（或 index.tsx）以統一 re-export，方便主元件或外部匯入：
  - components/index.ts 應只負責匯出子元件的 public API。
- 子元件檔案命名應一致（PascalCase），並保證單一責任。

## types.ts (可選)

- 放置僅屬於該元件的 TypeScript 型別、介面、props 與 emits 的型別定義。
- 若元件無特殊型別需求，此檔可省略。
- 共用型別請勿放在此檔，應放在專案共用型別目錄（例如 src/types 或 shared/types）。

## index.ts

- 匯出元件的 public API。
- 範例：`export { default as MyComponent } from './MyComponent.vue'`
- 必要時也可匯出相關型別：`export type { MyComponentProps } from './types'`

## README.md

- **必要檔案**：說明元件的用途、props、events、slots 與基本使用範例。
- 應包含：
  - 元件簡介
  - Props 說明
  - Events 說明
  - Slots 說明（如有）
  - 基本使用範例程式碼
- 保持簡潔，避免過度冗長的說明。

## MIGRATION.md (可選)

- **僅在需要時提供**：當元件經歷重大重構或 API 變更時，提供遷移指南。
- 應包含：
  - 變更摘要
  - 舊 API vs 新 API 對照
  - 遷移步驟
  - 範例對照

## **tests**/ (可選)

- 放置元件的單元測試檔案。
- 測試檔案命名：`<component name>.spec.ts` 或依功能命名（如 `<component name>.custom-checkbox.spec.ts`）。

## 文件限制

**重要：元件資料夾內的文件檔案最多只應該有 `README.md` 和 `MIGRATION.md`（如需要）。**

禁止的文件範例：

- ❌ `REFACTOR_README.md`
- ❌ `CUSTOM_FEATURE_README.md`
- ❌ `QUICK_REFERENCE.md`
- ❌ `UPDATE_SUMMARY.md`

所有額外的說明內容應整合到 `README.md` 中，或者如果是重構相關的內容，應放在 `MIGRATION.md` 中。

## <component name>.vue

- 元件的主要單檔元件（SFC），檔名應與資料夾名稱一致或依專案命名規範。
- 主元件內應從 components/index.ts 匯入子元件、從 types.ts 匯入型別（若存在）。
- 建議在檔案內明確區分 template / script / style，且 script 使用 TypeScript（若專案採用）。

# 額外建議

- 若需額外樣式或工具檔，可在元件資料夾內新增 `styles/` 或 `utils/`，但應納入專案規範並保持最小化。
- 測試檔案統一放在 `__tests__/` 資料夾內。

# 範例結構

```
BaseButton/
├── __tests__/
│   └── BaseButton.spec.ts
├── BaseButton.vue
├── types.ts
├── index.ts
├── README.md
└── MIGRATION.md              # 僅在需要時提供
```

```
BaseAdvanceSelector/
├── components/               # 如有子元件
│   ├── SelectorItem.vue
│   └── index.ts
├── __tests__/
│   ├── BaseAdvanceSelector.spec.ts
│   └── BaseAdvanceSelector.custom-checkbox.spec.ts
├── BaseAdvanceSelector.vue
├── types.ts
├── index.ts
├── README.md
└── MIGRATION.md
```
