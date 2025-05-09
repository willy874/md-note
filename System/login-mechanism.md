# 登入註冊機制分析

根據提供的代碼，我將為您分析並說明這個應用的登入註冊機制。這個系統主要使用 Google OAuth 進行身份驗證，並有完整的登入、註冊和登出流程。

## 登入流程

### 1. 登入入口

用戶通過 `LoginDialog` 組件開始登入流程，點擊 "使用 Google 登入" 按鈕。

```mermaid
flowchart TD
    A[用戶] --> B[打開 LoginDialog]
    B --> C[點擊 Google 登入按鈕]
    C --> D[重定向到 Google OAuth 頁面]
    D --> E[用戶授權]
    E --> F[Google 回調到應用]
```

### 2. OAuth 回調處理

當 Google 認證完成後，系統會獲取 access token 和 refresh token。

```mermaid
flowchart TD
    A[Google OAuth 回調] --> B{是新用戶?}
    B -- 是 --> C[重定向到註冊頁]
    B -- 否 --> D[重定向到登入回調頁]
    
    C --> E[創建帳戶流程]
    D --> F[登入流程]
```

### 3. 登入流程處理

`AuthProvider` 組件檢測 URL 參數中的 token，並調用相應的 API：

```mermaid
flowchart TD
    A[檢測 URL 參數] --> B{存在 token?}
    B -- 是 --> C{當前路徑是註冊頁?}
    C -- 是 --> D[調用 onPreSignup]
    C -- 否 --> E[調用 onLogin]
    E --> F[保存 Token 到 Cookie]
    F --> G[重定向到原頁面]
    
    B -- 否 --> H[維持未登入狀態]
```

## 註冊流程

### 1. 預註冊處理

新用戶被重定向到註冊頁面，系統會調用 `fetchPreSignup` API 來保存初始信息：

```mermaid
flowchart TD
    A[新用戶 OAuth 回調] --> B[調用 fetchPreSignup API]
    B --> C[設置註冊 token 及用戶信息 cookie]
    C --> D[重定向到註冊設置頁面]
```

### 2. 完成註冊過程

在 `LoginSetting` 組件中，用戶需完成分兩步的註冊表單：

```mermaid
flowchart TD
    A[註冊設置頁面] --> B[步驟 1: 基本資料設定]
    B --> C[驗證表單]
    C -- 驗證通過 --> D[步驟 2: 聯繫方式]
    D --> E[驗證表單]
    E -- 驗證通過 --> F[調用 fetchSignup API]
    F --> G[註冊完成]
    G --> H[設置 token 並重定向]
```

## 登出流程

用戶登出時，系統調用 `fetchLogout` API：

```mermaid
flowchart TD
    A[用戶點擊登出] --> B[調用 fetchLogout API]
    B --> C[刪除 Cookie 中的 tokens]
    C --> D[重新載入頁面]
```

## API 端點

系統使用以下 API 端點處理身份驗證：

1. `/api/auth/login` - 設置 access_token 和 refresh_token cookie
2. `/api/auth/logout` - 刪除身份驗證 cookies
3. `/api/auth/presinup` - 設置註冊相關的臨時 cookies
4. `/api/auth/sinup` - 完成註冊流程

## Token 處理

系統使用 HTTP-only cookies 來安全地存儲 tokens：

```mermaid
flowchart TD
    A[Access Token] --> B[HTTP-only Cookie]
    B --> C[有效期: 1小時]
    
    D[Refresh Token] --> E[HTTP-only Cookie]
    E --> F[有效期: 24小時]
    
    G[Signup Token] --> H[臨時 HTTP-only Cookie]
    H --> I[用於完成註冊流程]
```

## 用戶認證狀態

`AuthProvider` 和 `TokenProvider` 組件共同負責管理用戶的認證狀態：

1. `TokenProvider` 從 cookies 中讀取 token 並提供給應用
2. `AuthProvider` 提供 `isLogin` 狀態和 `fetchLogout` 方法給整個應用使用

## 安全考慮

1. 使用 HTTP-only cookies 防止 JavaScript 訪問 tokens
2. 在非開發環境中使用 secure cookies 確保只通過 HTTPS 傳輸
3. Token 設有合理的過期時間
4. 使用 OAuth 避免直接處理用戶密碼

這種登入註冊機制通過 Google OAuth 提供了一種安全且用戶友好的身份驗證方式，同時提供了完整的用戶註冊體驗。
