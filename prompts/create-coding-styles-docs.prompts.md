---
mode: agent
description: 分析當前專案的程式碼風格，並產生一套結構化的 coding style 手冊文件。
---

# 產生 Coding Style 手冊

## 目標

分析當前 workspace 的程式碼庫，根據實際使用的技術棧與慣例，自動產生一套結構化的 coding style 手冊，輸出至 `coding-styles/` 目錄。

---

## 執行步驟

### 1. 探索程式碼庫

探索 workspace，理解以下面向：

- **技術棧**：框架、語言、主要依賴
- **目錄結構**：src 結構、模組分層方式
- **命名慣例**：檔案名、變數名、函式名、元件名的實際命名模式
- **元件／模組設計**：元件結構、props 設計、composable 使用方式
- **API 互動**：fetch/axios 使用方式、錯誤處理、資料格式
- **狀態管理**：store 結構與使用慣例（如有）
- **樣式規範**：CSS 方法論、class 命名、設計系統使用（如有）
- **資料展示模式**：列表、表單、條件渲染的實作模式

### 2. 規劃文件結構

根據探索結果，規劃適合該專案的 `coding-styles/` 文件結構。

**基本結構範例（依實際技術棧調整）：**

```
coding-styles/
  map.md                      ← 目錄導航首頁（必須產生）
  naming.md                   ← 命名規範
  components.md               ← 元件設計規範
  api/
    error-handle.md           ← API 錯誤處理
    data-fetching.md          ← 資料拉取模式
  patterns/
    displayData.md            ← 資料展示模式
    displayText.md            ← 文字展示模式
    showControl.md            ← 條件顯示控制
  state/
    store.md                  ← 狀態管理規範
  styles/
    class-naming.md           ← CSS class 命名
```

> 僅產生與當前專案相關的文件，不需要為不存在的技術棧產生文件。

### 3. 產生文件內容

每份文件應包含：

- **用途說明**：這份文件規範什麼
- **規則條列**：清晰的 Do / Don't 範例
- **程式碼範例**：取自或貼近實際程式碼庫的範例
- **例外情況**：若有特殊情況需說明

#### `map.md` 必須包含：

- 專案技術棧摘要
- 所有文件的導航連結（Markdown 相對路徑）
- 每份文件的一句話描述

---

## 文件撰寫原則

- **具體勝於抽象**：規則必須配合程式碼範例，不寫純文字說明
- **以實際程式碼為準**：從 workspace 中擷取真實範例，不憑空捏造
- **簡潔**：每條規則用最少文字表達清楚
- **繁體中文撰寫**，程式碼、專有名詞維持英文

---

## 輸出規格

- 輸出根目錄：`coding-styles/`（建立於 workspace 根目錄）
- 所有 Markdown 檔案使用 `.md` 副檔名
- 檔案使用小寫 kebab-case 命名（`error-handle.md`、`data-fetching.md`）
- 範圍子目錄同樣使用小寫 kebab-case（`api/`、`patterns/`）
- `map.md` 中的連結使用相對路徑

---

## 開始執行

開始探索 workspace，規劃並產生適合當前專案的完整 coding style 手冊。
