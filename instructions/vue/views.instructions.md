---
applyTo: 'src/views/**/*.vue'
description: 'Coding standards for view-related files'
---

# Project coding standards for view-related files

## 基本規範

### 檔案結構

每個 view 模組應包含以下檔案：

- 每個 view 模組應包含以下檔案（範例結構）：

```text
<ViewName>/
    components/           # 放該 view 專用的子元件 (*.vue)
        └── ...             # 小型可重用元件
    <ViewName>.vue        # 該頁面的主要單檔元件（SFC）
    types.ts             # 該頁面專用的 TypeScript 型別定義
    REDME.md             # 該頁面的說明文件
    MIGRATION.md             # 該頁面的遷移指南（如有需要）
```

- 建議事項：
  - components/ 只放與該 view 密切相關的子元件，跨頁共用元件應放在全域 components 或 shared 資料夾。
  - <ViewName>.vue 應負責組合子元件、處理資料抓取與頁面生命週期。
  - 如有需要，可另加同層級的 styles/、types/ 或測試檔案（例如 <ViewName>.spec.ts）。

### 佈局元件使用

- PageLayoutProvider.vue 應用於 view 元件中，以確保頁面佈局的一致性。
