---
title: "伺服器渲染 (SSR)"
created: "2024年8月20日 星期二 09:29:00"
modified: "2024年8月21日 星期三 08:20:45"
folder: "竹子日誌文章"
---

# 伺服器

# 渲染

# 

# (

# S

# S

# R

# )

前日我聊過前端已經不再是那個前端，我覺得可以稍微聊聊現在前端架構上發生什麼變化？為什麼跟過去不一樣了？

關於伺服器渲染，我要來講講在 SSR 如何實作登入機制。這邊先釐清，我這裡講的 SSR 不是傳統純 Server Side Render，而是指 Hydration Render，由伺服器提供 HTML 渲染後再由瀏覽器執行 CSR。

做過一般「前後分離」的系統都會習慣把 Token 放在 LocalStorage 來完成持續登入。但如果到伺服器渲染，先排除不打算做「混合式前端」，以純粹的伺服器渲染架構來說，首先就得面臨如何在 Rendering Service 進行Token 的存取。因為 Client 的 LocalStorage 在伺服器是拿不到的。

解決方案其實說穿了就是靠 cookies ，但不是說直接打 API 把 token 存進 cookies ，而是指以 http only 的方式去儲存 secret 或 token 的資訊到 client 端，再拿這組 secret 在 Server 換回 token。這樣就可以趕在渲染 HTML 之前就能拿到 token 去打 Backend API 取得渲染資訊。

當然不只一種做法，我也可以提出近十種不同的架構做法，但這是一種還算主流且容易實作，並在安全性策略來說還算穩定的做法。

我一直以來都不支持全 SSR，不管是對於工程師要求、專案要求、還有架構要求，相對提高很多實作上的複雜程度。我所見過 90% 的網站並沒有那麼「即時的」SEO需要，就算即時更新也未必爬蟲可以即時反映。因此我都是推崇採用 PreRender 這個解決方案。