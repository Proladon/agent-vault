# showControl 使用說明

## 基本介紹

`showControl` 是專案中常見的 computed 物件，用於集中管理元件或頁面各種顯示/隱藏、啟用/禁用的 UI 狀態。常見於表單、彈窗、區塊、按鈕等動態顯示控制。

## 常見用法

### 1. 定義方式

通常在 `setup` 或 `computed` 中，會先宣告一個 `controls` 物件，根據 props、資料狀態、邏輯條件進行多層判斷與修改，最後再 return controls：

```js
const showControl = computed(() => {
  const controls = {
    closeBtn: props.closeBtn,
    showType: !props.onlyText,
    text: get(syncModel.value, 'type') === 'text',
    image: get(syncModel.value, 'type') === 'image',
    showAction: !props.hideAction,
    // ...更多控制項
  }
  // 可根據複雜條件動態調整 controls
  if (props.onlyText) {
    controls.image = false
    controls.text = true
  }
  // ...更多判斷式
  return controls
})
```

> 這種寫法的好處是可以在 computed 內部根據多層條件動態調整 controls，讓 UI 控制更彈性、易維護。

### 2. 使用方式

在 template 內根據 showControl 狀態決定元件顯示：

```vue
<BaseElButton v-if="showControl.closeBtn" @click="onClose">關閉</BaseElButton>
<BaseElInput v-if="showControl.text" v-model="formData.text" />
<BaseElImage v-if="showControl.image" :src="imageUrl" />
```

### 3. 典型場景

- 控制彈窗、Dialog 顯示/隱藏
- 控制表單欄位、按鈕、區塊顯示
- 根據 props 或資料狀態切換 UI

## 進階技巧

- 可根據多層條件組合，集中管理複雜 UI 狀態
- 可搭配 disabledControl、displayData 等 computed 一起使用
- 適合大型表單、彈窗、動態頁面

## 建議

- 命名統一，便於維護
- 控制項盡量集中於 showControl，減少 template 內邏輯
- 複雜狀態可拆分多個 computed
