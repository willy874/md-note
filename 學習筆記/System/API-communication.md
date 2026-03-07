# API 通訊機製文檔

本文檔描述了應用程式的 API 通訊架構，幫助開發人員理解資料流和元件互動方式。

## 架構概覽

系統使用多層抽象來處理 API 請求，結合了以下幾個關鍵元件：

1. **HTTP架構層**：基於 Axios 建置的自訂 HTTP 用戶端操作實體
2. **契約資源層**：使用 `@ts-rest/core` 定義類型安全的 API 契約資源
3. **服務方法層**：使用 TanStack Query 進行資料擷取與快取，將契約實例化為可呼叫的客戶端
4. **應用層**：伺服器元件和客戶端元件使用都屬於應用層

## 詳細元件說明

### 1. HTTP 用戶端層 (`libs/http/client.ts`)

HTTP 用戶端提供了一個靈活的請求處理基礎設施，主要特點包括：

```typescript
export function http<RequestDTO extends z.ZodType, ResponseDTO extends z.ZodType>(
  options: CreateHttpOptions<RequestDTO, ResponseDTO>
): HttpClient<RequestDTO, ResponseDTO>
```

- **外掛系統**：透過外掛模式擴充功能
- **請求/回應驗證**：在開發環境中使用 Zod 進行資料驗證
- **靈活的配置**：支援合併多個配置對象
- **錯誤處理**：包含重定向和錯誤傳播機制

### 2. 契約層

使用 `@ts-rest/core` 定義 API 契約，確保類型安全：

```typescript
// 範例契約資源定義
export const getExample = {
  method: 'GET',
  path: '/api/example',
  responses: {
  200: GetExampleResponseDTOSchema,
  },
} as const satisfies AppRoute
```

契約定義了：

- HTTP 方法
- API 路徑
- 回應結構及其驗證架構

### 3. 資源層 (`resources/index.ts`)

將契約轉換為可調用的客戶端：

```typescript
export const userClient = initClient(
  contract.router({
    getUser,
    getUserById,
    updateUser,
    getCreatorById,
  }),
  defaultOptions,
)
```

這一層將契約定義轉換為實際可呼叫的函數，以保持型別安全。

### 4. 查詢層 (`queries/user/getExample.ts`)

使用 TanStack Query 管理資料擷取、快取和狀態：

```typescript
export const useGetExampleQuery = (options: QueryOptions = {}) => {
  return useSuspenseQuery(getQueryOptions(options))
}

export async function prefetchGetExample(options: QueryOptions = {}) {
  const queryClient = getQueryClient()
  const queryOptions = getQueryOptions(options)
  queryOptions.staleTime = 0
  await queryClient.prefetchQuery(queryOptions)
  const result = queryClient.getQueryData(queryOptions.queryKey)
  return result
}
```

提供了：

- React Hooks 用於元件內資料擷取
- 伺服器端預取函數
- 查詢配置和鍵管理

## 實用工具

### 伺服器端請求處理 (`libs/http/server.ts`)

專為伺服器端環境設計的工具：

```typescript
export async function proxyMiddleware(request: Request, options: HttpProxyOptions = {}) {
  // 處理和轉送請求
}
```

- 支援請求重寫和代理
- 處理伺服器端的頭部和授權
- 將 Axios 響應轉換為標準 Response 對象

### 輔助函式 (`libs/http/common.ts`)

多重實用工具函數：

```typescript
export const flattenAxiosConfigHeaders = (method: string, headers: AxiosRequestConfig['headers']) => {
  // 將多層次頭部結構扁平化
}

export async function requestToAxiosRequestConfig(request: Request): Promise<AxiosRequestConfig> {
  // 將 fetch API Request 轉換為 Axios 配置
}
```

## 使用模式

### 客戶端元件資料獲取

```tsx
function ClientPage() {
  const { data } = useGetExampleQuery();
  return <div>{data.name}</div>;
}
```

### 伺服器端資料預取

```tsx
async function Page() {
  const userData = await prefetchGetExample();
  return <ClientPage />;
}
```

## 攔截器與驗證

系統包含多個可插拔的攔截器：

- **請求驗證插件**：在開發環境下驗證請求數據

  ```typescript
  export function requestValidationPlugin(schema: z.ZodType) {
    // 驗證請求資料結構
  }
  ```

- **響應驗證外掛程式**：在開發環境下驗證響應數據

  ```typescript
  export function responseValidationPlugin(schema: z.ZodType) {
    // 驗證回應資料結構
  }
  ```

- **伺服器授權外掛程式**：新增認證資訊到伺服器端請求

  ```typescript
  export function serverAuthorizationPlugin() {
    // 新增授權頭部
  }
  ```

## 類型安全與集成

整個系統保持端到端的類型安全：

1. API 契約定義回應類型
2. 客戶端維護這些類型
3. 查詢層導出正確的類型接口
4. React 元件獲得完全類型支持

```typescript
// 範例類型流
type GetExampleResponseDTO = z.infer<ApiResource['responses'][200]>
```

## 最佳實踐

1. **為新 API 端點建立契約**：在對應的資源目錄中定義新契約
2. **在資源用戶端中註冊契約**：更新對應的客戶端路由
3. **建立 QueryHook**：為客戶端方法建立 TanStack Query Hook
4. **在元件中使用 QueryHook**：利用自動快取和載入狀態

透過遵循此流程，可以保持程式碼庫的一致性和類型安全，同時利用系統提供的所有功能。
