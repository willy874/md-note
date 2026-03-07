---
title: "關於 RestfulAPI"
created: "2024年9月12日 星期四 08:29:55"
modified: "2024年9月12日 星期四 08:47:29"
folder: "竹子日誌文章"
---

# 關於

# 

# Re

# st

# f

# ul

# A

# PI

#

很多人以為 restful API 只是把行為區分成 GET, POST, PUT, PATCH, DELETE 這些不同的 mothod。然而，如果真的這麼簡單，有什麼好了解的呢？其實不只是 restful API 的規範，更要知道 http 規範和瀏覽器規範。

前端的你是否曾經接過以下奇怪設計的 API？

- GET, DELETE 的參數帶在 Body
- URL Search Query 需要帶 Array 用「,」當作分割符號
- PUT 和 PATCH 的資料格式是multipart/form-data ，而且要帶 Blob file

或許你可能不覺得奇怪，但如果設計出這種API 肯定很快就會踩到地雷了。有些是套件的實作行為，有些是瀏覽器限制⋯⋯如果對這些不了解就會有很多溝通上的問題。

你遇過什麼奇怪的問題嗎？歡迎一起分享喔！