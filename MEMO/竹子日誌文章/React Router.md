---
title: "React Router"
created: "2024年9月28日 星期六 13:09:07"
modified: "2024年9月28日 星期六 14:20:46"
folder: "竹子日誌文章"
---

# React Router

看似自由的 react 技術圈，目前使用 router 功能的市場仍然被 remix 的 react-router 佔領，目前除了 Next 自有的 router system 外，還沒看到其他間居上的 router library 。

用過 vue router 後，我目前再無其他滿意的路由系統，其他的我只能說⋯⋯難用⋯⋯

近期在觀察 tanstack/router……

你問我 react-router-dom 哪裡不好？

（以下以 v6 config api 為主）

- Router 實體，官方直接「不建議」操作（很多功能和資訊直接跟你講不要用）
- 不提供路由完成的 Promise 提供非同步完成確認
- 不提供 before router change 的攔截
- 不提供針對 route id 來導向
- 不提供對 routes 修改的方法（可以做到，也不止一種做法，但文件並沒有交代做法)
- 沒有提供一個可以在 React Component 之外拿到 location 或 navigate 的方法。
- 原始碼的品質很差⋯⋯⋯⋯

當然你可以說 Route Component 很自由啊！

但沒有規範使用這樣的 API ，真的超容易迷路啦⋯⋯

但對於輕型專案來說，其實還是頗好用，設計邏輯還是蠻符合 functional programming 的概念，也或許某方面是想強制使用者用特定的方法使用，而不是「不好用」。