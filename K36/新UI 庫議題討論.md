---
title: "新UI 庫議題討論"
created: "2026年2月2日 星期一 14:42:11"
modified: "2026年2月3日 星期二 13:39:59"
folder: "K36"
---

# 新UI 庫議題討論

## 主架構

框架： react@^18

UI庫： antd@^6

—————

## 議題

### 向下兼容

方案一：介面分向下兼容 nrc，少部分 API 落差過大才捨棄

方案二：全新走向，重新設計

### Design Token

方案一

基於 antd 的 Design Token 語彙去延伸開發

方案二

基於我們自家的元件重新定義語彙

### Table

方案一 使用 antd Table

基本上可以足夠滿足 90% 以上的情境

方案二 轉由使用 tanstack/table

用到機會應該不高，但如果要確保彈性。但專案中還是使用了舊版本的 tanstack/table，也是有升級的需要。

### Form

方案一 使用 antd Form

方案二 使用 React Hook Form

方案三 延續使用 Formik

延伸：驗證方案

方案一 使用 antd Form

方案二 使用 Zod

方案三 延續使用 Yup

延伸：有需要把 Form 邏輯包進去嗎？

方案一 實作在 UI 庫

方案二 實作在產品專案中

—————

## 要注意的設計

### 樣式

antd 6 提供了 styles, classNames 來修改，所以也要曝露 classNames 的參數由上而下傳遞來調整各種變體

### DateTime

因為 antd 底層是依賴 dayjs 作為處理，而專案多以 moment 為主，需要做轉譯層

### i18n

即使是 UI 庫也會需要自帶語系和語系切換等等能力，形程自成體系的多國語系系統

內部使用 i18n管理多語系，由 ConfigProvider 去中管當前使用語言

—————

## 要執行的元件

- Input
- Select