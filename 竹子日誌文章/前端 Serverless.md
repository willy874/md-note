---
title: "前端 Serverless"
created: "2025年6月27日 星期五 08:21:40"
modified: "2025年6月27日 星期五 08:36:26"
folder: "竹子日誌文章"
---

# 前端 Serverless

許多從前端剛摸後端的人以為連線資料庫只是一個單純的 HTTP 請求，事實上，資料庫服務溝通其實很多時候是一個 Socket 連線，並不是你以為的 WebSocket，而是純粹的 TCP 請求。

前端近年 SSR 架構興起，也因為 Next.js 的推動，Rendering Service 流行起採用 Serverless 架構，以加速爭取更多的效能優化。然而，隨著架構的拓展，除了一般的請求外，開始需要 Redis, Message Queue 之類的服務，這時候問題就開始浮現。

Serverless 實現中，常常會使用 Edge runtime 這樣的啟動環境。打一個比喻，就是閹割版的 nodejs，它很多功能不存在，但也因為輕量換取跟多的速度和模擬環境的能力。然而這些細節並不是每個在寫 serverless 的前端都有注意到，某天你想串接外部服務，你會注意到⋯⋯

「欸？為什麼沒有 ”net” module？」

沒有錯，確實 Edge runtime 沒有Socket 的能力，也就是不能採用一般的方法去連線這些外部模組，只能採取純粹的 http fetch。

最近實作這些架構真是踩的傷痕累累，只能怪自己後端架構知識不足。