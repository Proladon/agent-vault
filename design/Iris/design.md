# Iris — Design System

> **主題名稱：Iris（鳶尾）** — 取自靛紫色的鳶尾花，呼應本主題唯一的強調色（`#5b5bd6` / `#8a8af0`）。
>
> 本文件是一套可跨專案複用的視覺設計系統，以「設計 token + 元件配方」的形式撰寫，AI agent 可直接依此重建一致的 UI，不需翻閱原始碼。
>
> **風格定位**：乾淨、現代的 SaaS / 文件工具風格。靛紫色（indigo-violet）作為單一強調色，大量中性灰階、細邊框、極輕陰影、圓角，配上克制的 0.12s 過場動畫。支援淺色 / 深色雙主題。

---

## 1. 核心理念 (Design Principles)

依此優先序做設計決策：

1. **Token 驅動，零硬寫顏色**：所有顏色、圓角、陰影都走 CSS 自訂屬性 (`var(--x)`)。元件本身永遠不寫死 hex，換主題只改 `:root` 變數。
2. **單一強調色**：整個介面只有一個 accent（靛紫 `#5b5bd6`）。互動回饋（hover、focus、active、選取）一律用 accent 或其半透明版 `--accent-soft`。
3. **中性為主、強調為輔**：90% 的畫面是中性灰白（bg / panel / border / text / muted），accent 只在需要引導注意力處出現。
4. **層級靠「面 + 細邊框 + 輕陰影」堆疊**，不靠重陰影。`--panel` 浮在 `--bg` 之上，用 1px `--border` 分界，陰影只有 `0 1px 2px`。
5. **柔和的衍生色用 `color-mix()`**：需要某色的淡底或淡邊時，用 `color-mix(in srgb, <color> 14%, transparent)` 即時混色，而非另開變數。
6. **動效克制**：互動過場 `.12s`，展開/收合 `.15s`，浮層進出 `.2s`。沒有花俏動畫。
7. **圓角語言一致**：面/卡 10px、按鈕/輸入 8px、膠囊徽章全圓 `99px`。

---

## 2. 設計 Token（CSS 變數）

直接複製這段到新專案的全域樣式即可獲得整套主題。淺色為預設，深色掛在 `html[data-theme="dark"]`。

```css
:root {
  /* 表面 (Surfaces) */
  --bg:          #f5f6f8;   /* 應用底色（最底層） */
  --panel:       #ffffff;   /* 卡片 / 側欄 / 標頭 / 浮層底色 */
  --border:      #e4e7ec;   /* 所有分界線、外框 */
  --code-bg:     #f1f2f6;   /* 程式碼、表頭、次級填色 */

  /* 文字 (Text) */
  --text:        #1c2433;   /* 主要文字 */
  --muted:       #67718a;   /* 次要文字、icon、說明、placeholder */

  /* 強調 (Accent) */
  --accent:      #5b5bd6;             /* 靛紫，唯一強調色 */
  --accent-soft: rgba(91, 91, 214, .09); /* accent 的淡底（hover / 選取 / 引用塊） */

  /* 形狀與陰影 (Shape & Elevation) */
  --radius:      10px;                       /* 面 / 卡 / 浮層的標準圓角 */
  --shadow:      0 1px 2px rgba(16, 24, 40, .05); /* 標準輕陰影 */
}

html[data-theme="dark"] {
  --bg:          #0e1117;
  --panel:       #161b24;
  --border:      #252c3a;
  --code-bg:     #1d2330;

  --text:        #e6e9f0;
  --muted:       #8b94a9;

  --accent:      #8a8af0;                       /* 深色下提亮的靛紫 */
  --accent-soft: rgba(138, 138, 240, .12);
  --shadow:      0 1px 2px rgba(0, 0, 0, .4);
}
```

### Token 速查表

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--bg` | `#f5f6f8` | `#0e1117` | 應用最底層背景 |
| `--panel` | `#ffffff` | `#161b24` | 卡片、側欄、標頭、modal、drawer 表面 |
| `--border` | `#e4e7ec` | `#252c3a` | 分界線、外框、預設 scrollbar |
| `--code-bg` | `#f1f2f6` | `#1d2330` | code / pre、表頭、次級填色（如停用 pill） |
| `--text` | `#1c2433` | `#e6e9f0` | 主要文字、標題 |
| `--muted` | `#67718a` | `#8b94a9` | 次要文字、icon 預設色、placeholder |
| `--accent` | `#5b5bd6` | `#8a8af0` | 強調、互動、選取、連結、focus 邊框 |
| `--accent-soft` | `rgba(91,91,214,.09)` | `rgba(138,138,240,.12)` | hover 底、選取底、引用塊底 |
| `--radius` | `10px` | `10px` | 標準圓角 |
| `--shadow` | `0 1px 2px rgba(16,24,40,.05)` | `0 1px 2px rgba(0,0,0,.4)` | 標準輕陰影 |

---

## 3. 語意色 (Semantic Colors)

這些是固定值（不隨主題切換），用 `color-mix()` 產生淡底/淡邊。

| 語意 | 主色 | 淡底 | 用途 |
|---|---|---|---|
| **Success / 已確認** | `#059669` | `rgba(5,150,105,.13)` | 成功狀態、open 狀態 pill、確認勾勾、diff 新增行 |
| **Danger / 錯誤** | `#d92d20` | `color-mix(in srgb, #d92d20 8%, transparent)` | 錯誤 toast、有未結留言徽章、diff 刪除行 |
| **Warning** | `#d97706` | — | 警示（與下方 BRD 文件色同源） |

**使用範例：**

```css
/* 成功 pill */
.status-pill.open   { color: #059669; background: rgba(5, 150, 105, .13); }
/* 危險徽章 */
.badge.danger       { color: #d92d20;
                      border-color: color-mix(in srgb, #d92d20 35%, transparent);
                      background:   color-mix(in srgb, #d92d20 8%, transparent); }
.badge.danger:hover { background:   color-mix(in srgb, #d92d20 16%, transparent); }
```

### 分類標籤色板 (Category Palette)

若新專案需要為「文件類型 / 分類 / 狀態」上色，沿用這套互不衝突的色板。每個分類用 `color` 當文字色 + `color-mix(in srgb, <color> 14%, transparent)` 當底色，產生柔和的彩色膠囊。

| 類別 | 色碼 | 色感 |
|---|---|---|
| 中性 / README | `#64748b` | slate 石板灰 |
| Amber | `#d97706` | 琥珀（也是 warning） |
| Blue | `#2563eb` | 藍 |
| Violet | `#7c3aed` | 紫 |
| Emerald | `#059669` | 翠綠（也是 success） |
| Gray | `#6b7280` | 灰 |

```js
// 柔和彩色膠囊的產生方式
`<span class="badge"
   style="color:${color}; background:color-mix(in srgb, ${color} 14%, transparent)">${label}</span>`
```

---

## 4. 字體 (Typography)

```css
body {
  font-family: ui-sans-serif, -apple-system, "Segoe UI",
               "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
}

/* 等寬：用於程式碼、SHA、版本號、數字標記 */
--font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
```

- **基準字級 15px / 行高 1.6**。系統字體優先，內建繁中字體 fallback（Noto Sans TC → PingFang TC → 微軟正黑），確保中英混排一致。
- **字級階梯**（沿用即可）：

| 用途 | size | weight |
|---|---|---|
| 內文 | 15px | 400 |
| 按鈕 / 控制項 | 13.5px | 500（active/primary 600） |
| 次要說明、meta | 12–13px | 400–500 |
| 徽章 / pill | 10.5–11px | 700 |
| 區段小標（uppercase） | 12px | 700，`letter-spacing:.3px`，`text-transform:uppercase`，色 `--muted` |
| H1（內容） | 1.7em | — |
| H2 | 1.35em | — |
| H3 | 1.12em | — |

- 字距：徽章/大寫小標加 `letter-spacing: .3px–.4px`，提升小字辨識度。

---

## 5. 形狀、間距、尺寸

### 圓角階梯 (Radius Scale)

| 值 | 用途 |
|---|---|
| `5px` | inline code |
| `7px` | 小按鈕 (mini-btn)、segmented 內按鈕、小型輸入 |
| `8px` | 標準按鈕、輸入框、icon 按鈕、選單項、徽章容器 |
| `var(--radius)` = `10px` | 卡片、面板、pre、浮層、確認框 |
| `13px` / `14px` | modal（大圓角浮層） |
| `99px` | 膠囊：pill、徽章、toast、avatar(50%)、scrollbar thumb |

### 關鍵尺寸 (Layout Dimensions)

| 元素 | 尺寸 |
|---|---|
| Header 高 | `54px` |
| Sidebar 寬 | `296px` |
| Drawer（側抽屜）寬 | `384px`（手機 `100vw`） |
| Icon（`svg.icon`） | `16px`，`stroke-width:2`，圓頭圓角 |
| Icon 按鈕 | `34 × 34px` |
| Modal small / large | `max-width: 380px` / `760px` |
| 內容最大寬 | 文件 `880px`、儀表板 `1080px`，`margin:0 auto` 置中 |
| RWD 斷點 | `768px`（主版面）、`720px`（卡片堆疊） |

### 間距慣例 (Spacing)

採 4 的倍數為主，常見值：`4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 24 / 32px`。
- 按鈕內距 `7px 13px`；icon 按鈕用 grid 置中。
- 卡片內距 `14px 16px`；浮層/modal 內距 `12–22px`。
- 元件間 gap `6–12px`；區塊間 `12–18px`。

---

## 6. 陰影與層級 (Elevation)

陰影一律極輕、低飽和。層級越高，陰影越大但仍克制。

| 層級 | 值 | 用途 |
|---|---|---|
| 標準 | `var(--shadow)` = `0 1px 2px rgba(16,24,40,.05)` | 按鈕、卡片、segmented active |
| 浮動鈕 | `0 2px 8px rgba(16,24,40,.12)` | FAB、置中浮鈕 |
| 下拉/inline 浮層 | `0 8px 24px rgba(0,0,0,.12)` | inline 表單、dropdown |
| Drawer | `-8px 0 24px rgba(0,0,0,.08)` | 右側抽屜 |
| Toast | `0 4px 16px rgba(0,0,0,.2)` | 浮動提示 |
| Modal | `0 16px 48px rgba(0,0,0,.24)` | 對話框（最高層） |

**遮罩 (Backdrop)**：`rgba(0,0,0,.42)`（modal）、`rgba(0,0,0,.35)`（手機側欄）。

**z-index 階梯**：header `30` → 手機側欄 backdrop `35` → 側欄 `40` → drawer `50` → 確認 inline `55` → modal backdrop `60` → toast `100`。

---

## 7. 動效 (Motion)

過場短、只動該動的屬性，不用 `transition: all`。

| 時長 | 緩動 | 用途 |
|---|---|---|
| `.12s` | (預設) | hover/focus 的 background、border-color、color、transform |
| `.15s` | (預設) | 展開收合的 chevron 旋轉 |
| `.2s` | `ease` | toast、drawer、側欄滑入滑出 |

**標準動畫：**

```css
@keyframes spin  { to { transform: rotate(360deg); } }            /* loading / 同步中 */
@keyframes flash { 0%,50% { background: var(--accent-soft); }     /* 定位高亮 */
                   100% { background: transparent; } }

.spinner { width:28px; height:28px; border-radius:50%;
           border:3px solid var(--border); border-top-color:var(--accent);
           animation: spin .8s linear infinite; }
```

- chevron 收合：`.chev { transition: transform .15s; }`，收合時 `.collapsed .chev { transform: rotate(-90deg); }`。
- 微互動：hover 放大用 `transform: scale(1.08~1.14)`。

---

## 8. 元件配方 (Component Recipes)

以下為可直接複用的元件樣式，全部走 token，自動支援深淺色。

### 按鈕 Button

```css
.btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 13px; border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--panel);
  font-size: 13.5px; font-weight: 500;
  box-shadow: var(--shadow);
  transition: background .12s, border-color .12s;
  white-space: nowrap;
}
.btn:hover:not(:disabled) { background: var(--accent-soft); border-color: var(--accent); }
.btn:disabled { opacity: .55; cursor: default; }

/* 主要按鈕：實心 accent */
.btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.btn.primary:hover:not(:disabled) { filter: brightness(1.08); background: var(--accent); }
```

> 慣例：次要動作 = 描邊按鈕（panel 底，hover 變 accent-soft）；主要動作 = 實心 accent + 白字。**每個情境只有一顆 primary**。

### Icon 按鈕

```css
.icon-btn {
  width: 34px; height: 34px; border-radius: 8px;
  display: grid; place-items: center;
  color: var(--muted);
  transition: background .12s, color .12s;
}
.icon-btn:hover { background: var(--accent-soft); color: var(--text); }
```

Icon 一律用 stroke 線性 SVG（`stroke:currentColor; stroke-width:2; fill:none; stroke-linecap:round; stroke-linejoin:round`），16px。

### 輸入框 Input / Textarea

```css
.text-input, .search-wrap input, textarea {
  width: 100%; padding: 8px 12px;
  border-radius: 8px; border: 1px solid var(--border);
  background: var(--bg);            /* 輸入框比所在面更「凹」一階 */
  color: var(--text); font: inherit; outline: none;
  transition: border-color .12s;
}
:focus { border-color: var(--accent); }   /* focus 只變邊框色，無外發光 */
```

> 慣例：輸入框底色用比容器低一階的表面（在 `--panel` 上的輸入用 `--bg`），製造內凹感。Focus 僅將邊框換成 accent。

### 卡片 Card

```css
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 14px 16px;
}
```

### 徽章 / 膠囊 Badge & Pill

```css
/* 文字膠囊：全圓角、粗體小字、字距 */
.badge {
  font-size: 10.5px; font-weight: 700; letter-spacing: .4px;
  padding: 2px 7px; border-radius: 99px;
  font-family: var(--font-mono);
}
/* 狀態 pill */
.status-pill { font-size: 10px; padding: 2px 8px; border-radius: 99px; font-weight: 700; letter-spacing: .4px; }
.status-pill.open   { color: #059669; background: rgba(5,150,105,.13); }
.status-pill.closed { color: var(--muted); background: var(--code-bg); }
```

彩色膠囊統一用 `color: <c>; background: color-mix(in srgb, <c> 14%, transparent)`。

### 分段控制 Segmented Control

```css
.seg {
  display: inline-flex; padding: 3px; gap: 2px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 9px;
}
.seg button {
  padding: 5px 12px; border-radius: 7px;
  font-size: 13px; font-weight: 500; color: var(--muted);
  transition: background .12s, color .12s;
}
.seg button.active {                 /* 選中項「浮起」 */
  background: var(--panel); color: var(--text);
  box-shadow: var(--shadow); font-weight: 600;
}
```

### Modal

```css
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.42);
  z-index: 60; display: grid; place-items: center; padding: 20px; }
.modal { background: var(--panel); border: 1px solid var(--border);
  border-radius: 14px; box-shadow: 0 16px 48px rgba(0,0,0,.24);
  display: flex; flex-direction: column; width: 100%; }
.modal.small { max-width: 380px; padding: 22px; }
.modal.large { max-width: 760px; height: min(640px, 90vh); }
.modal h3 { margin: 0 0 4px; font-size: 16px; }
.modal .hint { margin: 0 0 14px; font-size: 13px; color: var(--muted); }
```

### Drawer（側滑抽屜）

```css
.drawer {
  position: fixed; top: 54px; right: 0; bottom: 0;
  width: 384px; max-width: 100vw;
  background: var(--panel); border-left: 1px solid var(--border);
  display: flex; flex-direction: column; z-index: 50;
  box-shadow: -8px 0 24px rgba(0,0,0,.08);
}
/* 三段式：head (border-bottom) / body (flex:1, scroll) / foot (border-top) */
```

### Toast

```css
#toast {
  position: fixed; left: 50%; bottom: 28px;
  transform: translateX(-50%) translateY(16px);
  background: var(--text); color: var(--bg);     /* 反色：暗底亮字 */
  padding: 10px 18px; border-radius: 99px;
  font-size: 13.5px; font-weight: 500;
  opacity: 0; pointer-events: none;
  transition: opacity .2s, transform .2s;
  z-index: 100; box-shadow: 0 4px 16px rgba(0,0,0,.2);
}
#toast.show  { opacity: 1; transform: translateX(-50%) translateY(0); }
#toast.error { background: #d92d20; color: #fff; }
```

### Avatar

```css
.avatar { width: 24px; height: 24px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: grid; place-items: center; font-size: 11px; font-weight: 700; }
```

### Logo 標記（漸層方塊）

```css
.logo {
  width: 28px; height: 28px; border-radius: 8px;
  background: linear-gradient(135deg, var(--accent), #9b6bd6);  /* 唯一允許的漸層 */
  display: grid; place-items: center; color: #fff;
}
```

### Scrollbar（自訂）

```css
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb {
  background: var(--border); border-radius: 99px;
  border: 2px solid transparent; background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover { background: var(--muted); background-clip: padding-box; }
```

### 引用塊 Blockquote（內容區）

```css
blockquote {
  margin: 1em 0; padding: .4em 1.1em;
  border-left: 3px solid var(--accent);
  background: var(--accent-soft); border-radius: 0 8px 8px 0;
  color: var(--muted);
}
```

---

## 9. 主題切換 (Theme Switching)

掛在 `<html>` 的 `data-theme` 屬性上，預設跟隨系統，並存進 `localStorage`。

```js
function applyTheme(theme) {            // theme = "light" | "dark"
  document.documentElement.dataset.theme = theme;
}
function initTheme() {
  const saved = localStorage.getItem("theme");
  applyTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
}
// 切換：
const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
localStorage.setItem("theme", next);
applyTheme(next);
```

> 因為所有顏色都走 token，切換 `data-theme` 即可全站換膚，元件零改動。

---

## 10. 快速起步（Drop-in Starter）

新專案最小起手式 —— 貼上 §2 的 token 區塊，再加上這段 reset：

```css
* { box-sizing: border-box; }
[hidden] { display: none !important; }
html, body { height: 100%; }
body {
  margin: 0;
  font-family: ui-sans-serif, -apple-system, "Segoe UI",
               "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
  background: var(--bg); color: var(--text);
  font-size: 15px; line-height: 1.6;
}
button { font: inherit; color: inherit; cursor: pointer; border: 0; background: none; }
svg.icon { width: 16px; height: 16px; stroke: currentColor; stroke-width: 2;
  fill: none; stroke-linecap: round; stroke-linejoin: round; flex: none; }
```

接著按需要從 §8 取用元件配方即可。

---

## 11. 該做 / 不該做 (Do & Don't)

**✅ 該做**
- 顏色、圓角、陰影一律用 `var(--token)`。
- 需要某色淡底/淡邊時用 `color-mix(in srgb, <c> N%, transparent)`。
- 互動回饋統一：hover → `--accent-soft` 底 + `--accent` 邊；focus → `--accent` 邊框。
- 過場只指定要動的屬性，時長 `.12s`。
- 每個畫面只放一顆 `.btn.primary`。
- icon 用 16px 線性 stroke SVG，色用 `currentColor`。

**❌ 不該做**
- 不要在元件裡寫死 hex（語意色/分類色除外，且它們也要用 `color-mix` 產生變化）。
- 不要用 `transition: all`。
- 不要堆重陰影或大範圍漸層（漸層僅限 logo）。
- 不要引入第二個強調色搶 accent 的注意力。
- 不要用外發光式 focus；focus 只換邊框色。
- 深色模式不要只把淺色反相 —— 用 §2 校調過的深色 token。

---

*Source of truth：`public/index.html` 的 `<style>` 區塊（`:root` / `html[data-theme="dark"]` 與其下元件規則）。新專案若調整風格，請同步更新本文件。*
