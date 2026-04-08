---
name: ui-spec-writer
description: "將截圖或 spec 描述轉換為標準 spec 格式的 Markdown 文件。Use when: 使用者提供截圖、wireframe、PM spec 或功能描述，想產出口語化 spec 文件。支援新增頁面、表單、列表、Drawer、過濾器等各種 UI 元件的描述，搭配 ASCII 畫面示意圖。"
argument-hint: "貼上截圖或描述需要轉換的 UI spec"
---

# UI Spec Writer

將截圖或功能描述轉換為標準 spec Markdown 格式。格式核心是「口語化敘述 + ASCII 畫面示意」，讓開發者快速理解異動範圍、畫面結構與欄位規格。

請參考格式範例：[example-output.md](./assets/example-output.md)
詳細格式規則請參考：[format-conventions.md](./references/format-conventions.md)

## 觸發時機

- 使用者提供 UI 截圖或 wireframe
- 使用者貼上 PM 的文字需求或功能說明
- 使用者要求整理某功能的 spec 文件

## 輸出原則

1. **口語化**：用自然的中文描述「這個頁面是什麼、怎麼運作」，避免條列式標題堆疊
2. **ASCII 示意**：有視覺佈局的區域（卡片、列表列、過濾器排列）一律用 ASCII 畫出
3. **差異描述優先**：相似頁面只描述「與 X 頁相同，但...多一個...」，不重複全文
4. **欄位附帶 component 標注**：格式為 `欄位名稱 (component類型, 附加說明)`

## 輸出步驟

### Step 1：識別輸入類型

判斷輸入屬於哪種類型：

- **新增功能模組**：整個子系統（有多個子頁面）
- **單一頁面**：列表頁、設定頁、紀錄頁
- **表單 / 編輯頁**：欄位設定
- **局部 UI 元件**：Drawer、Modal、卡片、過濾器

### Step 2：確認文件結構

按照以下層級組織文件：

```
開頭段落     → 說明這次異動的整體範圍（不用標題）
### 頁面名稱  → 每個主頁面一個 H3
#### 子頁面  → 編輯頁、Drawer 等用 H4
```

### Step 3：撰寫各段落

為每個頁面按照 [format-conventions.md](./references/format-conventions.md) 撰寫：

1. 頁面整體描述（1-2 句口語說明佈局方式）
2. ASCII 示意圖（若有視覺結構）
3. 邊界條件與空值說明
4. 表單欄位列表（含 component 標注）
5. 相似頁面的差異描述

### Step 4：輸出 Markdown

直接輸出完整的 `.md` 文件內容，或依使用者指示建立檔案。
