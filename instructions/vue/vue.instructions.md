---
applyTo: 'src/**/*.vue'
description: 'Coding standards for Vue single-file components'
---

# Project coding standards for Vue single-file components

## 基本規範

### 必要項目

- 使用 TypeScript 開發
- 使用 <script setup> 語法
- 使用 Composition API
- 使用 <style lang="postcss"> 並使用 @apply 語法
- 如果需要使用 jsx/tsx，將 script 的 lang 設為 `<script lang="tsx" setup>`
- 需要有 defineOptions({ name: 'ComponentName' }) 來定義組件名稱
- 優先使用 src/components/ 中已存在的通用或共享組件，避免重複實現相同的 UI 或行為。
- 在創建新組件前先檢查 components/ 目錄是否已有可重用或可擴展的組件（確認 props、slots、事件是否能滿足需求）。
- 對於多處使用的組件，添加簡短的使用說明與示例，並將樣式透過 UnoCSS 原子類與 @apply 解耦以便重用。

### 建議項目

- unplugin-vue-components 自動導入 src/components 目錄範圍下的組件 ，避免手動 import。
- unplugin-import 自動導入 Vue、Vue Router、Pinia、src/stores/、src/composables/，避免手動 import。

### Icon 使用方式

- 使用 BaseIcon 組件來顯示圖標，避免直接使用 img 或其他圖標庫組件。
