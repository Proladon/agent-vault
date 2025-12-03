# displayText 使用說明

## 基本介紹

`displayText` 是專案中常見的 computed 物件或資料結構，用於集中管理頁面、元件的顯示文字、標籤、提示、說明等。常見於表單、彈窗、區塊、按鈕、欄位等動態文字顯示。

## 常見用法

### 1. 定義方式

通常在 `setup` 或 `computed` 中依據 props、狀態、語系等動態生成：

```js
const displayText = computed(() => {
  return {
    dialogTitle: `${pointName}部分折抵`,
    pointUnit: get(defaultShopPoint.value, 'unitName', '點'),
    pointName,
    // ...更多文字
  }
})
```

### 2. 使用方式

在 template 內根據 displayText 狀態決定顯示文字：

```vue
<BaseElDialog :title="displayText.dialogTitle" />
<BaseElInput :placeholder="displayText.pointUnit" />
```

### 3. 典型場景

- 控制彈窗、Dialog 標題
- 控制表單欄位 placeholder、label
- 顯示提示、說明、狀態文字
- 支援多語系、動態文字

## 進階技巧

- 可與 i18n（國際化）結合，動態取得多語系文字：
  ```js
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const displayText = computed(() => ({
    dialogTitle: t('dialog.pointDiscountTitle'),
    pointUnit: t('point.unit'),
    // ...
  }))
  ```
- 這樣可讓所有顯示文字自動根據語系切換，並集中管理。

## 建議

- 命名統一，便於維護
- 顯示文字盡量集中於 displayText，減少 template 內硬編碼
- 複雜文字可拆分多個 computed
