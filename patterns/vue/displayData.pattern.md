# displayData 用法說明

`displayData` 是專案中常見的 computed property，主要用於整理、轉換、顯示資料於各種 UI 元件。以下整理其典型用法與範例：

---

## 1. 基本用途

- 將原始資料格式化為 UI 需要的結構，集中管理顯示邏輯。
- 依據 props、狀態、設定等，動態產生顯示內容。

---

## 2. 典型用法

### (A) 表單/欄位提示

在 `CourseJoinStartSettingForm.vue`：

- `displayData.hint`、`displayData.defaultSetting`、`displayData.defaultHint` 皆為 computed 結果，根據表單狀態動態顯示。
- 例：
  ```vue
  <p
    v-show="formData.type === 'firstDayOfMonth'"
    class="text-sub text-gray-60"
  >{{ displayData.hint.firstDayOfMonth }}</p>
  <p
    class="text-primary-100 font-medium text-sub"
  >{{ displayData.defaultSetting }}</p>
  <p
    class="text-gray-60"
  >{{ displayData.defaultHint[displayData.defaultType] }}</p>
  ```

### (B) 表格資料

在 `BatchOrderPaymentDrawer.vue`：

- `displayData.tableData` 作為表格資料來源，欄位標題也由 `displayData` 產生。
- 例：
  ```vue
  <BaseTable :data="displayData.tableData">
    <BaseElTableColumn prop="code" :label="$t('batchOrderPaymentDrawer.code.title')" />
    <BaseElTableColumn prop="status" :label="$t('batchOrderPaymentDrawer.status.title')" />
    <BaseElTableColumn prop="totalPrice" :label="displayData.totalPriceTitle" />
  </BaseTable>
  <div class="flex justify-between items-center py-[12px]">
    <p>{{ displayData.checkoutTitle }}</p>
    <p>$ {{ displayData.checkoutPrice }}</p>
  </div>
  ```

---

## 3. 宣告方式

```js
const displayData = computed(() => {
  // 整理、格式化邏輯
  const data = {
    hint: {...},
    tableData: [...],
    checkoutTitle: '...',
    // ...其他欄位
  }

  // 根據條件調整顯示內容
  if (someCondition) {
    data.hint.firstDayOfMonth = '新的提示內容';
  }

  return data
})
```

---

## 4. 實作建議

- 盡量將顯示相關的資料整理在 `displayData`，方便維護與測試。
- 命名建議：以 `displayData` 命名，方便團隊辨識其用途。
- 若有多組欄位（如 hint, tableData, title），可分組管理。
- 顯示時可搭配格式化函式（如 `formatDate`、`toLocaleString`）提升可讀性。

---
