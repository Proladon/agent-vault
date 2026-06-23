# 個人 Coding 風格指南 (Personal Coding Style — Vue Composition API)

> **目的**：讓 AI Agent / 協作者在任何專案產出程式碼時，能仿照本作者一貫的撰寫風格與慣用 pattern。
> **可攜性**：本文件刻意**不綁定任何特定專案的組件、工具、API**。所有範例使用中性的佔位名稱（如 `<Form>`、`MessageToast`、`getXxx`），落地時請替換成該專案實際的對應物。
> **適用基底**：Vue 2.7+ / Vue 3 Composition API（`setup`）。多數「原則」段落（命名、錯誤處理、註解、排版、資料化 UI）與框架無關，可直接套用到其他技術棧。
> **基準**：以作者長期（跨多個版本）親手撰寫、風格穩定的程式碼歸納，而非近期 AI 輔助產出的片段。

---

## 0. 風格三句話

> 1. **資料化優先**：UI 的顯示/隱藏、文字、欄位、動作，盡量收斂成 computed 物件或 config 陣列（`showControl` / `displayText` / `displayData` / config），而不是散在 template 的條件式。
> 2. **小而純、意圖清楚**：邏輯抽成具名函式與 composable，命名直接表達意圖（`onXxx`、`canXxx`、`fetchXxx`），註解寫「為什麼」。
> 3. **防呆取值 + 一致錯誤處理**：巢狀資料一律安全取值給預設，非同步呼叫用 `[res, err]` tuple，錯誤即提示即 early return。

---

## 1. 慣用 Pattern（最具識別度）

這些是跨專案會反覆出現的個人簽名式寫法。**新功能優先考慮能否用這些 pattern 表達。**

### 1.1 `showControl`：集中式顯示控制

一個 `computed`，回傳「以語意命名的布林集合」物件，統一管理所有顯示/隱藏/啟用/禁用。template 只讀 `showControl.xxx`，不寫複雜條件。

```js
const showControl = computed(() => {
  const controls = {
    closeBtn: props.closeBtn,
    showType: !props.onlyText,
    text: get(model.value, "type") === "text",
    image: get(model.value, "type") === "image",
    showAction: !props.hideAction,
  }
  // 複雜情境可在這裡用多層條件動態覆寫 controls
  if (props.onlyText) {
    controls.image = false
    controls.text = true
  }
  return controls
})
```

```vue
<button v-if="showControl.closeBtn" @click="onClose">關閉</button>
<TextInput v-if="showControl.text" v-model="model.content" />
<ImageUpload v-if="showControl.image" />
```

慣例：先宣告 `controls` 物件 → 視需要動態覆寫 → `return controls`。命名一律 `showControl`（禁用旗標可另開 `disabledControl`）。

### 1.2 `displayText`：集中式顯示文字

一個 `computed`，集中管理該畫面所有 label / placeholder / 提示 / 標題，避免 template 內硬編碼字串；天然適合接 i18n。

```js
const displayText = computed(() => ({
  blockTitle: t("message.title"),
  input: {
    placeholder: t("message.input.placeholder"),
    uriPlaceholder: t("message.input.uri"),
  },
  action: {
    label: t("message.action.label"),
    none: t("message.action.none"),
  },
}))
```

```vue
<Dialog :title="displayText.blockTitle" />
<TextInput :placeholder="displayText.input.placeholder" />
```

分組命名（`input.*`、`action.*`），可隨狀態動態調整內容。

### 1.3 `displayData`：集中式顯示資料

一個 `computed`，把原始資料整理成 UI 直接可用的結構（表格資料、結帳金額、提示對應表…），格式化邏輯集中於此。

```js
const displayData = computed(() => {
  const data = {
    tableData: rows.value.map(formatRow),
    checkoutTitle: t("order.checkout"),
    checkoutPrice: toCurrency(total.value),
  }
  if (isDiscount.value) data.checkoutTitle = t("order.checkoutDiscounted")
  return data
})
```

> `showControl` / `displayText` / `displayData` 是同一哲學的三個面向：**把 template 該知道的「狀態、文字、資料」各自收斂成一個 computed 物件**。三者常一起出現。

### 1.4 `formData` + `formRules`：表單雙件組

- `formData`：`reactive` 物件，欄位初值多為 `null` / `undefined`。
- `formRules`：**`computed`**，依 `formData` 當前狀態**動態組裝**規則（先建基本規則，再依條件 `push` 額外規則）。

```js
const formData = reactive({
  type: null,
  amount: null,
  comment: null,
})

const formRules = computed(() => {
  const rules = {
    type: [required()],
    amount: [required()],
  }
  if (formData.type === "use") {
    rules.amount.push(range(1, props.balance))
  } else if (formData.type === "add") {
    rules.amount.push(min(1))
  }
  return rules
})
```

驗證規則用可組合的 rule factory（`required()`、`min(n)`、`range(a,b)`…），不要散寫物件字面值。

### 1.5 表單生命週期：`initFormData` → `syncData` → `compactData`

較複雜的表單採固定四段式：

```js
// 1) 初值
initFormData({ type: null, amount: null })

// 2) 由 props/API 帶入既有資料（編輯模式）
const syncData = () => {
  formData.type = props.data.rewardType
  formData.amount = props.data.rewardAmount
}

// 3) 送出前整理成 API payload
const compactData = computed(() => {
  const data = { ...formData }
  // 衍生/清洗欄位
  return data
})

// 4) 提交
const onSubmit = async () => {
  if (loading.value) return
  if (!(await checkForm(formRef.value))) return
  // 呼叫 API（見 §4）
}
```

### 1.6 `syncModel`：v-model 雙向綁定

撰寫受控組件時，用 vmodel 工具把 prop 包成可寫的 `syncModel`，並以框架的 reactive set 寫值（Vue 2 用 `set(...)`，Vue 3 直接賦值）。

```js
const syncModel = useVModel(props, "model", emit)
const changeType = (type) => {
  set(syncModel.value, "type", type)
  set(syncModel.value, "content", undefined)
}
```

---

## 2. 命名慣例 (Naming)

| 種類                             | 慣例                                    | 範例                                                     |
| -------------------------------- | --------------------------------------- | -------------------------------------------------------- |
| 變數 / 函式                      | camelCase                               | `recordData`, `fetchDetail`                              |
| 組件 / class / **後端 API 函式** | PascalCase                              | `MessageBlock`, `GetSignatureRecord`                     |
| 事件處理                         | `on` + 動作                             | `onClose`, `onOpenDetail`, `onConfirmExport`, `onSubmit` |
| 取資料（async）                  | `fetch` / `get` + 名詞                  | `fetchDetail`, `getTableData`                            |
| 布林 / 權限 computed             | `can` / `is` / `show`                   | `canCreate`, `isManualOrExternal`, `showAddDialog`       |
| 顯示控制集合                     | `showControl`（computed→物件）          | `showControl.copyLink`                                   |
| 顯示文字集合                     | `displayText`                           | `displayText.blockTitle`                                 |
| 顯示資料集合                     | `displayData`                           | `displayData.tableData`                                  |
| 列舉設定                         | `xxxConfig`（以 value 為 key）          | `statusConfig`                                           |
| 選項陣列                         | `xxxOptions = Object.values(xxxConfig)` | `statusOptions`                                          |
| 系統常數                         | UPPER_SNAKE_CASE                        | `SYSTEM_FIELD_KEYS`                                      |
| 後端關聯欄位                     | 沿用後端原樣（常為 PascalCase）         | `Member.UserInfo.name`                                   |

> 重點：存取後端回傳的關聯物件時**保留後端命名**，不自行轉 camelCase；本地新建的變數才用 camelCase。

---

## 3. 元件結構慣例 (Component Structure，Vue)

- 區塊順序：`<template>` → `<script>` → `<style scoped>`。
- 兩種寫法擇一、同檔不混用：
  - **`defineComponent` + 顯式 `setup` return**：頁面 / Dialog / Drawer / 會被具名引用、邏輯較多者。一定宣告 `name` 與 `emits`，`setup` 結尾**逐一列出** template 用到的東西（含 `t`）。
  - **`<script setup>`**：小型純表單 / 純展示 Block，邏輯短。
- `setup (props, { emit })` —— 函式名與括號間留空格。
- `setup` 內部順序：composable 解構 → `ref`/`reactive` 狀態 → `computed`（含 `showControl`/`displayText`/`displayData`）→ 方法（`fetchXxx`/`onXxx`）→ `watch` → 生命週期 → `return`。
- `props` 用完整物件宣告（`type`/`required`/`default`）；物件/陣列預設用工廠函式 `default: () => ({})`；每個重要 prop 上方一行註解說明用途與「可用值」。

---

## 4. 非同步與錯誤處理 (Async & Errors)

API 呼叫回傳 **`[res, err]` tuple**，固定處理形狀：

```js
const [res, err] = await GetDetail({ id })
if (err) {
  MessageToast.error(err) // ← 換成專案的訊息提示工具
  return // ← 出錯即 early return，不往下走
}
data.value = res || {}
```

慣例：

- 不需要 res 時用 `const [, err] = await Create(payload)`。
- 成功才提示 `MessageToast.success(...)`。
- `loading` 包 `try { ... } finally { loading.value = false }`。
- payload 可選欄位用 `field || undefined` 過濾空值。
- 多筆並行用 `Promise.allSettled([...])`。
- 提交函式開頭 `if (loading.value) return`；高頻動作用 `debounce(fn, 300, { leading: false, trailing: true })`。

---

## 5. 安全取值 (Safe Access)

巢狀取值一律走 `get(obj, 'path', fallback)`，顯示用預設 `'-'`、邏輯用 `undefined`：

```js
get(row, "Member.UserInfo.name", "-")
get(statusConfig, `${status}.label`) // 取設定也用 get，避免 key 不存在炸掉
```

連續備援用 `||` 串接：

```js
const getOrderCode = (record) =>
  get(record, "AppointmentOrder.code") ||
  get(record, "MemberStoreOrder.code") ||
  get(record, "ExternalTransaction.transactionId") ||
  "-"
```

---

## 6. 資料化 UI / Config-Driven

把「表格欄位、篩選、動作按鈕、表單欄位」宣告成**物件陣列**，交給通用渲染組件，而非堆疊重複模板。item 形狀固定為 `{ key, prop, label, component, render, props, on }`：

```js
const columns = computed(() => {
  const all = [
    {
      prop: "name",
      label: t("table.name"),
      render: (row) => get(row, "name", "-"),
    },
    {
      prop: "status",
      label: t("table.status"),
      component: () => import("@/components/Tag.vue"), // 字串=全域組件；() => import = 動態載入
      props: (row) => ({
        type: get(statusConfig, `${row.status}.tagType`, "info"),
      }),
      render: (row) => t(get(statusConfig, `${row.status}.label`)),
    },
  ]
  return all.filter((col) => !props.hideColumns.includes(col.prop)) // 用 props 做加減法
})
```

- `props`/`on` 需要 row 時寫成函式 `(row) => ({...})`，否則直接給物件。
- 條件性動作用 `items.push(...)` 動態加入。
- 此資料化思維同樣用於 `showControl`/`displayText`/`displayData`。

---

## 7. 列舉 / 設定 (Config & Options)

列舉集中放在獨立 config 檔，格式固定：

```js
// 以 value 為 key；label 存 i18n key（不是翻譯後文字）；附 metadata
export const statusConfig = {
  signed: { value: "signed", label: "status.signed", tagType: "action" },
  expired: { value: "expired", label: "status.expired", tagType: "danger" },
  unsigned: { value: "unsigned", label: "status.unsigned", tagType: "info" },
}

// 下拉用陣列一律由 config 派生
export const statusOptions = Object.values(statusConfig)
```

需要衍生邏輯時提供小型純函式 helper（如 `getOptions(config, currentValue)`）並寫 JSDoc。

---

## 8. 邏輯抽離與 Composable

- 跨組件共用的業務邏輯抽成 `useXxx` / `useXxxUtils`，回傳具名函式物件；view 不堆大量邏輯。
- 模組頂層放**純函式 helper**，composable 內回傳的才是綁定 context（store/i18n）的業務函式。
- composable 與每個對外函式寫 **JSDoc**（描述 + `@param`/`@returns`/`@throws`），檔頭給 `@example`。
- 後端存取集中在獨立 API 層，view / 共用組件不直接打 HTTP client。

```js
/**
 * 取得複製連結按鈕的顯示狀態
 * @param {Object} record
 * @returns {{ canShow: boolean, isDisabled: boolean }}
 */
const getCopyLinkStatus = (record) => {
  const sourceType = get(record, "sourceType")
  const isManualOrExternal = ["manual", "external"].includes(sourceType)
  return {
    canShow:
      isManualOrExternal &&
      ["unsigned", "expired"].includes(get(record, "status")),
    isDisabled: isManualOrExternal && get(record, "status") === "expired",
  }
}
```

---

## 9. i18n

- UI 字串走 i18n，不在 template 硬寫；config 的 `label` 存 key，使用點才 `t(label)`。
- key 命名 `feature.section.element`（如 `member.signatureRecord.table.name`）。
- 選項翻譯延後到使用點：`options.map(o => ({ ...o, label: t(o.label) }))`。
- 多語系檔同步新增（zh/en/jp/kr…）。

---

## 10. 狀態與彈窗 (Local State & Modals)

- 單值/旗標 → `ref`；一組相關狀態（尤其彈窗開關＋帶入參數）→ `reactive` 物件。
- Dialog / Drawer 用 `v-if="x.visible"` 掛載（搭配 `destroy-on-close`），關閉即銷毀並重置帶入資料。

```js
const detailDrawer = reactive({ visible: false, recordId: "" })
const onOpenDetail = (row) => {
  detailDrawer.recordId = get(row, "id")
  detailDrawer.visible = true
}
const onCloseDetail = () => {
  detailDrawer.visible = false
  detailDrawer.recordId = "" // 一併重置
}
```

---

## 11. 可重用 / 可內嵌組件

同一組件同時服務「獨立頁」與「內嵌 tab」，用 props 切換而非複製：

```js
props: {
  // 內嵌時帶入的關聯 ID（有值即為內嵌模式）
  memberId: { type: String, default: undefined },
  // 隱藏標題（內嵌場景）
  hideTitle: { type: Boolean, default: false },
  // 隱藏的篩選 key，可用值: 'name' | 'status'
  hideFilters: { type: Array, default: () => [] },
}
```

用 `hideXxx` 布林/陣列 props 做加減法，再 `.filter()` 套用；每個 prop 上方一行註解標明用途與可用值，並註記模式差異（`// 內嵌模式：顯示新增按鈕`）。

---

## 12. 樣式 (Styling)

- `<style scoped>`，用 utility-class（Tailwind）+ `@apply`，含 arbitrary value：`mt-[40px]`、`gap-[12px]`。
- 顏色/字級走設計系統 token / CSS 變數（`var(--gray-60)`），不寫死色碼。
- 版面優先用通用 layout 組件（flex 容器）取代裸 `<div class="flex ...">`。
- 避免 inline `style="..."`（舊碼殘留不模仿）。

---

## 13. 註解 (Comments)

- 用**繁體中文**，說明「**為什麼 / 業務意圖**」而非翻譯程式碼。
  - ✅ `// 僅手動發放與第三方消費來源支援複製連結`
  - ❌ `// 設定 visible 為 true`
- 函式 / composable / config helper 用 JSDoc。
- 送出前移除除錯 `console.log`。

---

## 14. 排版與 Lint (Formatting)

- **2 空白縮排**、**不加分號**、**單引號**字串。
- 多行物件/陣列/參數**保留結尾逗號**。
- `function (` / `setup (` 名稱與括號間留空格。
- import 順序：框架 API → 第三方（lodash…）→ 專案內部模組（組件 / composable / utils / api / config / i18n）→ 相對路徑（`./...`）。
- 完成後跑專案的 lint autofix。

---

## 15. 反模式 (Anti-patterns，避免)

- ❌ 在 view / 共用組件直接打 HTTP；走專案 API 層。
- ❌ template 硬寫字串；走 i18n / `displayText`。
- ❌ template 堆複雜條件；收斂成 `showControl`。
- ❌ 散在各處的格式化字串；收斂成 `displayData` / `displayText`。
- ❌ 彈窗用 `v-show` 常駐；用 `v-if` + 銷毀並重置。
- ❌ 直接 `obj.a.b.c`；用 `get(obj, 'a.b.c', '-')`。
- ❌ 把大量業務邏輯塞 view；抽成 composable。
- ❌ 殘留 `console.log`、inline `style`、未處理的 `err`。
  </content>
