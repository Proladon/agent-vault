---
applyTo: 'src/**/api/**/*.ts'
description: 'Coding standards for API-related TypeScript files'
---

# Project coding standards for API-related TypeScript files

## 基本規範

### 必要項目

- 使用 TypeScript 開發
- 使用具名導出 (named exports)，不使用預設導出 (default export)
- 函數名稱使用 PascalCase 命名
- HTTP methods 使用大寫 (`GET`, `POST`, `PUT`, `DELETE`)
- 所有參數必須定義 TypeScript 型別介面

### 檔案結構

每個 API 模組應包含以下檔案：

1. **`types.ts`** - 定義所有參數和回應的 TypeScript 型別
2. **`{module}.ts`** - 實作 API 函數
3. **`index.ts`** - 重新導出所有函數和型別

## 型別定義規範 (types.ts)

### 參數型別命名

- **查詢參數**: `Get{ResourceName}Params`
- **查詢單筆參數**: `Find{ResourceName}Params`
- **建立參數**: `Create{ResourceName}Params`
- **更新參數**: `Update{ResourceName}Params`
- **刪除參數**: `Delete{ResourceName}Params`

### 型別定義原則

- 使用 `interface` 定義參數型別
- `shopId` 應定義為 `string | number` 型別
- 選用參數使用 `?` 標記
- 複雜物件可額外定義獨立的 interface

### 型別定義範例

```typescript
// 基本參數型別
export interface GetShopsParams {
  start?: number
  limit?: number
  name?: string
}

// 單一資源參數型別
export interface GetShopSettingParams {
  shopId: string | number
}

// 建立資源參數型別
export interface CreateShopParams {
  imageId?: string | number
  name: string
  phone: string
  address: string
  email: string
  industry: string
  contractPlanId: string | number
  googleMapLink?: string
  currency: string
  timezone: string
  language: string
}

// 複雜型別定義
export interface UpdateCouponRecordAdvancedSettingParams {
  shopId: string | number
  eventType: string
  defaultCouponSetting: DefaultCouponSetting
  couponSettings: CouponSetting[]
}

export interface CouponSetting {
  couponId: string | number
  isEnabled: boolean
  [key: string]: any
}

export interface DefaultCouponSetting {
  isEnabled: boolean
  [key: string]: any
}
```

## API 函數命名規範

### CRUD 操作

- **查詢列表**: `Get{ResourceName}s` (例: `GetShops`)
- **查詢數量**: `Get{ResourceName}sCount` 或 `Get{ResourceName}Count`
- **查詢單筆**: `Find{ResourceName}` 或 `Get{ResourceName}By{Field}` (例: `FindLineConfig`, `GetShopById`)
- **新增**: `Create{ResourceName}` (例: `CreateShop`, `CreateLiff`)
- **更新**: `Update{ResourceName}` (例: `UpdateShop`, `UpdateLineConfig`)
- **刪除**: `Delete{ResourceName}` (例: `DeleteShopEmailNotify`)

### 特殊操作

- **取得設定**: `Get{ResourceName}Setting` 或 `Get{ResourceName}Config`
- **取得選項**: `Get{Category}Categories` (例: `GetIndustryCategories`)
- **模組相關**: `Get{ResourceName}Modules`
- **方案相關**: `Get{ResourceName}Plan`

## API 實作規範

### Import 語句

```typescript
import { admin2 } from '../instance'
import type {
  GetShopSettingParams,
  CreateShopParams,
  GetShopsParams,
  // ... 其他型別
} from './types'
```

### URL 路徑規則

1. **店家相關資源**: `/${shopId}/{resourceName}`
2. **全域資源**: `/{resourceName}`
3. **資源子項目**: `/${shopId}/{resourceName}/{id}`
4. **資源操作**: `/${shopId}/{resourceName}/{action}`

### HTTP Method 規則

- **GET** - 查詢資料（列表或單筆）
- **POST** - 建立新資源
- **PUT** - 更新現有資源
- **DELETE** - 刪除資源

### 參數傳遞規則

- GET 請求使用 `params` 傳遞查詢參數
- POST/PUT 請求使用 `data` 傳遞請求主體
- DELETE 請求通常將 ID 放在 URL 中

### 函數實作範例

```typescript
// 查詢列表 - 使用 params
export const GetShops = async ({ start, limit, name }: GetShopsParams) => {
  return await admin2({
    method: 'GET',
    url: '/shop',
    params: {
      start,
      limit,
      name,
    },
  })
}

// 查詢單筆 - 直接參數
export const GetShopById = async (shopId: string | number) => {
  return await admin2({
    method: 'GET',
    url: `/shop/${shopId}`,
  })
}

// 建立資源 - 使用 data
export const CreateShop = async ({
  imageId,
  name,
  phone,
  address,
  email,
  industry,
  contractPlanId,
  googleMapLink,
  currency,
  timezone,
  language,
}: CreateShopParams) => {
  return await admin2({
    method: 'POST',
    url: '/shop',
    data: {
      imageId,
      name,
      phone,
      address,
      email,
      industry,
      contractPlanId,
      googleMapLink,
      currency,
      timezone,
      language,
    },
  })
}

// 更新資源 - 使用 data
export const UpdateShop = async ({
  shopId,
  imageId,
  name,
  phone,
  address,
  email,
  industry,
  contractPlanId,
  googleMapLink,
  language,
}: UpdateShopParams) => {
  return await admin2({
    method: 'PUT',
    url: `/shop/${shopId}`,
    data: {
      imageId,
      name,
      phone,
      address,
      email,
      industry,
      contractPlanId,
      googleMapLink,
      language,
    },
  })
}

// 刪除資源
export const DeleteShopEmailNotify = async ({ shopId, id }: DeleteShopEmailNotifyParams) => {
  return await admin2({
    method: 'DELETE',
    url: `/${shopId}/shopEmailNotify/${id}`,
  })
}

// 複雜查詢 - params 和 data 並用
export const UpdateCouponRecordAdvancedSetting = async ({
  shopId,
  eventType,
  defaultCouponSetting,
  couponSettings,
}: UpdateCouponRecordAdvancedSettingParams) => {
  const res = await admin2({
    method: 'PUT',
    url: `/${shopId}/linePushConfig/couponRecordAdvancedSetting`,
    params: {
      eventType,
    },
    data: {
      defaultCouponSetting,
      couponSettings,
    },
  })

  return res
}
```

## 模組導出規範 (index.ts)

使用 TypeScript 的 re-export 語法：

```typescript
// Re-export all functions from shop.ts
export * from './shop'

// Re-export all types
export type * from './types'
```

## 註解規範

### 簡潔註解

API 函數上方可加入簡單的中文註解說明用途：

```typescript
//=> 創建店家
export const CreateShop = async ({ ... }: CreateShopParams) => { ... }

//=> 取得店家
export const GetShops = async ({ ... }: GetShopsParams) => { ... }

//=> 取得總店家數量
export const GetShopsCount = async ({ ... }: GetShopsCountParams) => { ... }

//! 店家設定
export const FindLineConfig = async ({ ... }: FindLineConfigParams) => { ... }
```

### 註解慣例

- `//=>` 表示一般 API 操作
- `//!` 表示重要或特殊的 API 區塊

## 檔案組織最佳實踐

### 型別檔案順序 (types.ts)

1. 主要資源的參數型別
2. 子資源或相關資源的參數型別
3. 複雜物件的獨立型別定義
4. 使用空行和註解區分不同群組

### API 檔案順序 ({module}.ts)

1. Import 語句
2. CRUD 操作（Get → Find → Create → Update → Delete）
3. 相關的設定或配置操作
4. 特殊操作或工具函數
5. 使用註解區分不同功能區塊

## 完整模組範例結構

```
api/
  shop/
    index.ts          # 導出所有函數和型別
    types.ts          # 定義所有參數型別
    shop.ts           # 實作所有 API 函數
    README.md         # (選用) 模組說明文件
```

## 注意事項

1. **型別安全**: 所有函數參數都必須有明確的 TypeScript 型別
2. **一致性**: 同一模組內的命名風格和結構應保持一致
3. **可維護性**: 複雜的型別定義應拆分為多個小型別
4. **可讀性**: 使用有意義的變數名稱和適當的註解
5. **HTTP Method**: 雖然建議使用小寫，但大寫也可接受，保持模組內一致即可
