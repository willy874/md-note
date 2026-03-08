---
title: "Lesson 4"
created: "2025年10月25日 星期六 10:16:46"
modified: "2025年10月27日 星期一 21:03:56"
folder: "Frontend Infra"
---

**# Lesson 4**

**Bundle Tool** ***vs*** **Builder Tool**

現代的前端工具慢慢的不再需要自己從基礎建設一個個補上，多半會使用像是 Vue-CLI, CRA, Vite 等等工具。已經不用像傳統一樣，手動 Bundle, 手動設計 pipeline, 手動設定 Bundle Tool

。現今大部分打包系統都被封裝到 Builder Tool 當中，已經是使用起來相對容易多了。

那什麼是 Bundle Tool 呢？什麼是 Builder Tool 呢？

早期，在 Bundle Tool 出現前，要處理各種整合任務純靠手動。有太多封裝，一步步手動把各種工具使用的 API 介接起來。最經典可描述的就是 gulp 時代，要自行去組裝各種腳本的 pipeline，包含 template transformer, code minify, assets management, module bundle… 等等職責，不但各工具 API 不統一，操作起來複雜，還有很多 Edge Case 的問題。

接著，就是 Bundle Tool 的時代，由 Webpack 為首，異軍突起。透過共通的 Context API 相互溝通每個工作的職責，光靠 Config 就可以完成設定，統一整個 pipeline 相互溝通的 API，簡化流程上整合的複雜度，讓前端開發環境更容易被建構。最重要的是因為有標準化的 Context API，插件的蓬勃發展，各種整合工具的誕生，讓前端開發更加順利。

然而隨著前端快速的發展，前端應用的產出與規模不是當初的「頁面畫面」這麼簡單。大量的邏輯操作、繁雜的互動與流程、龐大的程式碼管理等等，這些需要更完整的「架構」去管理，也拜這些早期的生態插件逐漸被標準化，Builder Tool 孕育而生。Builder 整合了 Bundle Tool 各種設定，產生了標準化的 Template ，提供了基礎能運行的版本。諸如 Vue-CLI 和 Create React App就是最經典整合 Webpack 的 Builder。

至於大家所熟知的 Vite 其實已經是另一個世代的 Builder ，技術發展仍是這麼快速，前端仍然在不斷演進。