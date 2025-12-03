---
applyTo: 'specBook/**/*.plan.md'
description: 'Project planning document standards for specification book plan files'
---

## structure of specification book plan files

- title
- 📁 調整範圍
  - 總覽
- 🎯 實現方式

## notice
- 實現方式使用描述的方式進行撰寫，不要使用程式碼區塊，除非必要

## example below:
````
# <title>

---

## 📁 調整範圍

1. **銷售回饋活動設定頁面**
   - 路徑：`src/views/sales/SalesRebateActivity.vue
   - 異動模式：修改
   - 修改內容：
     - 排除商品 UI 從彈窗改為 Radio Button
     - 新增「選擇特定預約項目」按鈕
     - 新增「產品性質篩選器」


### 總覽

```
src/
├── api/
│   ├── sales.js (修改)
│   │   ├── GetSalesRebateActivity() - 修改：支援預約服務
│   │   ├── UpdateSalesRebateActivity() - 修改：支援預約服務
│   │   └── GetAppointmentList() - 新增：查詢預約項目列表
│   └── appointment.js (新增)
│       └── GetAppointmentList() - 新增
│
├── components/
│   └── sales/
│       ├── ProductSelectorDialog.vue (修改)
│       └── AppointmentSelectorDialog.vue (新增)
│
└── views/
    ├── sales/
    │   └── SalesRebateActivity.vue (修改)
    └── eventMarketing/
        └── SalesGiftEventSettings.vue (修改)
```

---

## 🎯 實現方式

### 1. 識別模組權限檢查點

使用 `usePermission` 中的 `checkAction()` 方法，判斷是否擁有「會員卡 QRcode」（`MEMBER_QRCODE_KEY`）與「會員中心 QRcode 設定」（`MEMBER_CENTER_QRCODE_KEY`）的權限。檢查邏輯為：只要啟用其中任一模組，就同時顯示兩個掃描工具。

### 2. 頁面邏輯調整

在會員查詢頁面中，建立一個 computed property（如 `isScannerEnabled`）來判斷掃描工具是否應該顯示。在模板中使用 `v-if` 指令根據該 computed property 的值條件式地渲染掃描工具區塊（包含「裝置鏡頭掃描」和「外接掃描槍」兩個按鈕）。

### 3. 權限檢查的實現方式

調用 `checkAction()` 方法分別檢查 `MEMBER_QRCODE_KEY` 和 `MEMBER_CENTER_QRCODE_KEY` 兩個模組權限。當兩者中任意一個返回 `true` 時，`isScannerEnabled` 應返回 `true`，從而顯示掃描工具；否則隱藏掃描工具。

---
````