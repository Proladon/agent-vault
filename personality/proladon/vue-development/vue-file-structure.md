# Vue 專案檔案結構規範 (Vue File Structure)

> **目的**：讓 AI Agent / 協作者在任何 Vue 專案產出檔案時，能仿照本作者一貫的目錄組織與命名慣例。
> **可攜性**：本文件不綁定特定專案，範例使用中性的功能名稱（`Member`、`Order`、`Home`…），落地時替換成實際功能。
> **適用基底**：Vue 2.7+ / Vue 3 中大型 SPA（`src/` 結構 + 功能導向組織）。
> 風格寫法請搭配 [coding_style.md](../coding_style.md)。

---

## 0. 核心心法 (Mental Model)

1. **功能導向的就近原則 (feature-colocation)**：檔案歸屬看「誰在用它」，而非「它是什麼類型」。只有某功能用到的東西，就放在該功能資料夾內；跨功能共用的才上移到全局層。
2. **一個功能橫跨多層、共用同一基底名**：一個功能（如 `MemberReport`）會在 `views/`、`api/`、`config/`、`use/`、`locales/` 各層各有一個**同名**檔案/資料夾。看到功能名就能推斷各層檔案位置（見 §5）。
3. **資料夾即功能邊界**：功能資料夾自包含「入口 + 子組件 + 區域狀態」，可整包搬移或刪除而不留孤兒。

---

## 1. View 功能資料夾結構 (Feature Folder)

每個路由頁面/功能是一個 **PascalCase 資料夾**，內含：

```
src/views/
  MemberReport/                      # 功能資料夾（PascalCase）
    MemberReport.vue                 # ← 入口組件，檔名與資料夾同名
    formsContext.js                  # 區域共用狀態（選用，見 §1.3）
    components/                      # 此頁專屬子組件
      MemberReportFilterBar.vue
      MemberReportDetailDrawer.vue
      MemberReportTable.vue
```

### 1.1 入口組件 = 資料夾同名

頁面入口檔名**與資料夾相同**（`MemberReport/MemberReport.vue`），不要用 `index.vue` 當主要慣例。
（少數深層、單純的葉節點頁面可用 `index.vue`，但預設用同名。）

### 1.2 子組件就近放在 `components/`，可遞迴巢狀

只有此頁用到的子組件放 `components/`。子組件若自身夠複雜、又有自己的子組件，它本身也可升級成資料夾，重複同一結構：

```
src/views/Member/
  Member.vue
  components/
    MemberInfoBlock/                 # 子組件升級為資料夾
      MemberInfoBlock.vue
      components/                    # 它自己的子組件
        MemberTags.vue
    MemberProfileTabs/
      MemberProfileTabs.vue
```

### 1.3 區域共用狀態：colocated context 檔

跨「同功能多個子組件」共享的狀態/表單參照，放在功能資料夾根層的獨立 `.js`（如 `formsContext.js`），由子組件以相對路徑 `../formsContext` 匯入。**不要為了區域狀態污染全局 store。**

### 1.4 子功能與分組資料夾

- 大功能下的**子功能**就是再開一層 PascalCase 資料夾：`RewardActivity/SerialCodeManagement/SerialCodeManagement.vue`。
- 同類頁面用**分組資料夾**收納，例如會員各分頁集中在 `Member/Tab/`：

```
src/views/Member/
  Member.vue
  Tab/                               # 分組資料夾
    RebateTab/
      RebateTab.vue
      components/
        UseRebateBlock.vue
    PointTab/
      PointTab.vue
```

---

## 2. 組件檔名語意後綴 (Semantic Suffixes)

檔名 = `功能/領域` + `語意後綴`，後綴直接表達 UI 角色，看名字就知道用途：

| 後綴             | 角色                          | 範例                       |
| ---------------- | ----------------------------- | -------------------------- |
| `XxxBlock`       | 頁面內的區塊 / 表單段落       | `UseRebateBlock`           |
| `XxxFormBlock`   | 含表單的區塊                  | `SerialCodeFormBlock`      |
| `XxxForm`        | 純表單組件                    | `BobInvoiceForm`           |
| `XxxDrawer`      | 抽屜（el-drawer）             | `MemberReportDetailDrawer` |
| `XxxModal` / `XxxDialog` | 彈窗                  | `SerialRewardEditModal`    |
| `XxxTab`         | 分頁頁面                      | `RebateTab`                |
| `XxxTable` / `XxxListTable` | 表格               | `SerialCodeListTable`      |
| `XxxFilterBar` / `XxxBar` | 篩選列 / 工具列      | `MonetaryBonusRecordFilterBar` |
| `XxxSelect`      | 下拉選擇器                    | `ClassTicketAdvanceSelect` |
| 入口頁           | 與資料夾同名（無後綴）        | `MemberReport`             |

> 後綴與 `coding_style.md` 的彈窗/表單 pattern 對應：`Drawer`/`Modal` 用 `v-if + reactive 開關`、`FormBlock` 用 `formData + formRules`。

---

## 3. 全局 `src/components/` 分類 (Shared Components)

跨多頁/多處共用的組件才放全局，並依**類型或領域**分到 PascalCase 子資料夾：

```
src/components/
  Base/        # 基礎原子組件（見 §3.1）
  Button/      # 依「類型」分類
  Input/
  Select/
  Dialog/
  Tag/
  Pagination/
  Form/  FormItem/
  Container/
  Search/
  Message/
  SerialCode/          # 依「領域」分類（跨頁共用的領域組件）
  ExternalTransaction/
  Reservation/
  Payment/
  CourseOrderDetailDrawer/   # 複雜共用組件 → 自成資料夾（內含自己的 components/）
```

- 分類標準：通用 UI 元件按**類型**（`Button`/`Input`/`Dialog`…）；跨頁共用的業務組件按**領域**（`SerialCode`/`Payment`…）。
- 單檔即可 → 直接放對應類別資料夾；複雜（多子組件）→ 自成資料夾走 §1 同結構。

### 3.1 `Base` 前綴：基礎原子組件

無業務邏輯、純樣式/結構、高度複用的原子組件用 `Base` 前綴，集中 `src/components/Base/`（專案若有 UI 庫包裝層，包裝組件也常用 `Base*`，如 `BaseElButton` 包裝底層 Button）。

- 只接 props 控制外觀、用 slot 擴充內容，不含業務邏輯。
- 可在專案任意位置使用。

---

## 4. 頁面專屬 vs 全局：判斷基準

| 情境                              | 放置位置                          |
| --------------------------------- | --------------------------------- |
| 只有某頁用到                      | `views/<Feature>/components/`     |
| 該頁子組件又有自己的子組件        | 升級成資料夾，內再開 `components/` |
| 2 個以上頁面共用（通用 UI）       | `src/components/<Type>/`          |
| 2 個以上頁面共用（領域組件）      | `src/components/<Domain>/`        |
| 無業務邏輯的基礎原子 UI           | `src/components/Base/`            |
| Layout（Navbar / Sidebar）        | `src/layout/`                     |

> 預設先放就近的功能資料夾；**等到第二個地方要用時才上移**到全局，不預先過度抽象。

---

## 5. 一個功能橫跨多層 (Feature Across Layers)

同一功能在各層各有一個**同名**檔案/資料夾。實作新功能時，照這張對照表建立平行檔案：

```
功能：MemberReport
├─ src/views/MemberReport/MemberReport.vue   # 頁面入口 + components/
├─ src/api/memberReport.js                    # 後端存取（匯出 GetXxx/CreateXxx…）
├─ src/config/memberReport.js                 # 列舉設定（xxxConfig / xxxOptions）
├─ src/use/useMemberReport.js                 # 共用業務邏輯 composable
├─ src/locales/memberReport/                  # i18n（zh/en/jp/kr.json）
│    ├─ zh.json
│    ├─ en.json
│    ├─ jp.json
│    └─ kr.json
└─ src/router/modules/...                     # 路由（依專案模組化方式）
```

各層慣例：

- **`api/<feature>.js`**：唯一的後端存取入口。常用 `baseUrl(shopId)` 之類 helper 組路徑；匯出函式 **PascalCase**（`GetMemberReport`）；每個函式寫 JSDoc。view/共用組件不直接打 HTTP。
- **`config/<feature>.js`**：列舉以 `xxxConfig`（value 為 key）+ `xxxOptions = Object.values(...)` 形式匯出；`label` 存 i18n key。
- **`use/<useXxx>.js`**：composable，**camelCase 檔名**，慣例前綴 `use`。
- **`locales/<feature>/`**：一功能一資料夾，內含各語系 `.json`，多語系同步維護。

---

## 6. 支援目錄地圖 (Support Directories)

`src/` 下的固定支援層（依職責拆分，非依功能）：

| 目錄            | 職責                                   |
| --------------- | -------------------------------------- |
| `api/`          | 後端存取，一功能一檔                   |
| `views/`        | 路由頁面（功能資料夾）                 |
| `components/`   | 跨頁共用組件                           |
| `use/`          | composables（業務邏輯）                |
| `config/`       | 靜態設定 / 列舉                        |
| `constants/`    | 常數                                   |
| `locales/`      | i18n 訊息                              |
| `store/`        | 全局狀態（Vuex/Pinia）                 |
| `router/`       | 路由設定（常 `modules/` 分模組）       |
| `utils/`        | 純函式工具（`date`、`excel`、`form`…） |
| `validation/`   | 表單驗證 rule factory                  |
| `plugins/`      | i18n / 第三方整合初始化                |
| `directive/`    | 自訂指令                               |
| `mixin/`        | mixin（舊碼，新功能優先 composable）   |
| `layout/`       | 應用外殼（Sidebar/Navbar/外框）        |
| `styles/`       | 全局樣式 / 主題 token                  |
| `assets/`       | 靜態資源                               |

---

## 7. 檔名大小寫慣例 (Naming Case)

| 對象                              | 規則            | 範例                       |
| --------------------------------- | --------------- | -------------------------- |
| `.vue` 組件檔 / 功能資料夾        | PascalCase      | `MemberReportDrawer.vue`   |
| `.js` 模組（api/config/use/utils）| camelCase       | `useMemberReport.js`       |
| composable 檔                     | camelCase + `use` 前綴 | `useExportCenter.js` |
| i18n 語系檔                       | 小寫語言碼      | `zh.json` / `en.json`      |
| `src/` 支援目錄                   | 小寫            | `api/` `use/` `config/`    |
| `components/` 分類子資料夾        | PascalCase      | `Select/` `Dialog/`        |

---

## 8. 放置決策流程 (Where Does This File Go?)

```
新增一個檔案時自問：
1. 是後端呼叫？        → src/api/<feature>.js（PascalCase 匯出 + JSDoc）
2. 是列舉/設定？        → src/config/<feature>.js（xxxConfig + xxxOptions）
3. 是共用業務邏輯？     → src/use/useXxx.js（composable）
4. 是純函式工具？       → src/utils/
5. 是 UI 組件？
   ├─ 只有單一頁面用？        → views/<Feature>/components/
   ├─ 跨頁共用、通用 UI？     → src/components/<Type>/
   ├─ 跨頁共用、特定領域？   → src/components/<Domain>/
   └─ 無邏輯基礎原子？        → src/components/Base/
6. 是頁面本身？         → views/<Feature>/<Feature>.vue
7. 是 UI 文字？         → src/locales/<feature>/<lang>.json
```

---

## 9. 完整範例 (Full Example)

```
src/
  views/
    Home/
      Home.vue
      components/
        HomeHeroSection.vue
        HomeFeatureList.vue
    Member/
      Member.vue
      formsContext.js                  # 區域共用狀態
      components/
        MemberProfileTabs/
          MemberProfileTabs.vue
        MemberInfoBlock/
          MemberInfoBlock.vue
          components/
            MemberTags.vue
      Tab/                             # 分組資料夾
        RebateTab/
          RebateTab.vue
          components/
            UseRebateBlock.vue
  components/
    Base/
      BaseButton.vue
      BaseInput.vue
    Dialog/
      BaseDialog.vue
    Select/
      MemberSelect.vue
    SerialCode/                        # 跨頁共用的領域組件
      SerialCodeInputModal.vue
  api/
    member.js
  config/
    member.js
  use/
    useMember.js
  locales/
    member/
      zh.json
      en.json
```
</content>
