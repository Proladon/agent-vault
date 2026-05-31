# Vue 專案檔案結構規範

## 組件放置原則

### 頁面專屬子組件 → 與頁面放在一起

若某個組件**只有特定頁面才會用到**，應將其歸屬在該頁面的目錄下，而非放入全局組件資料夾。

```
src/
  views/
    Home/
      components/
        HomeHeroSection.vue
        HomeFeatureCard.vue
      Home.vue
    Dashboard/
      components/
        DashboardChart.vue
        DashboardStatCard.vue
      Dashboard.vue
```

**優點：**

- 組件與使用它的頁面緊密放在一起，方便查找與維護
- 刪除頁面時，專屬組件也一併刪除，不會留下孤兒組件
- 降低全局 `components/` 資料夾的雜亂程度

### 通用組件 → 全局 `src/components/`

若某個組件**跨多個頁面或多個地方都會使用**，則放入全局組件資料夾。

```
src/
  components/
    Base/
      BaseButton.vue
      BaseInput.vue
      BaseModal.vue
      BaseAvatar.vue
    layout/
      Navbar.vue
      Sidebar.vue
```

### 基礎單元組件命名：`Base` 前綴

全局的**基礎 UI 單元組件**（無業務邏輯、可高度複用的原子組件）統一以 `Base` 前綴命名，並集中放在 `src/components/Base/`。

```
src/
  components/
    Base/
      BaseButton.vue    # 通用按鈕
      BaseInput.vue     # 通用輸入框
      BaseModal.vue     # 通用 Modal
      BaseAvatar.vue    # 通用頭像
      BaseBadge.vue     # 通用標籤
      BaseSpinner.vue   # 通用載入動畫
```

**`Base` 組件特性：**

- 不包含業務邏輯，只負責樣式與結構
- 接受 props 控制外觀，透過 slots 擴展內容
- 可在專案任意位置使用

## 判斷基準

| 情境                          | 放置位置                      |
| ----------------------------- | ----------------------------- |
| 只有 `Home` 頁面使用          | `views/Home/components/`      |
| 只有 `Dashboard` 頁面使用     | `views/Dashboard/components/` |
| 2 個以上頁面共用              | `src/components/`             |
| 無業務邏輯的基礎 UI 單元      | `src/components/Base/`        |
| Layout 相關 (Navbar, Sidebar) | `src/components/layout/`      |

## 目錄結構範例

```
src/
  views/
    Home/
      components/
        HomeHeroSection.vue      # 只有首頁用
        HomeFeatureList.vue      # 只有首頁用
      Home.vue
    Profile/
      components/
        ProfileAvatarEditor.vue  # 只有個人資料頁用
        ProfileBioForm.vue       # 只有個人資料頁用
      Profile.vue
  components/
    Base/
      BaseButton.vue             # 基礎單元，無業務邏輯
      BaseInput.vue
      BaseModal.vue
      BaseAvatar.vue
    layout/
      Navbar.vue                 # Layout 相關
      Sidebar.vue
```
