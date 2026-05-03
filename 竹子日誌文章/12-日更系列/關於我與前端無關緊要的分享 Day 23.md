---
title: "關於我與前端無關緊要的分享Day 23"
created: "2025年9月20日 星期六 13:48:10"
modified: "2025年9月24日 星期三 08:11:38"
folder: "竹子日誌文章"
---

# 關於我與前端無關緊要的分享Day 23

#

# Build in Public

過去都覺得 Button 是超級簡單的元件，然而真的開始做才會知道，它超級困難⋯⋯

Variant

除了基本的 Variant，可以表示 filled & outlined，甚至是 text。但 Theme 超不適合和 Variant 混合使用，但似乎蠻多人卻習慣這樣做，但我的觀點是配色是配色，變體是變體，它們能夠交錯搭配。最讓人崩潰的還是它 Design Token 的配色，要如何舒服的進行顏色的轉化與變化，我用了很多組裝技巧。

Size

最頭疼的莫過於 icon，Space 超級難以分類，如果混雜在 size 也會難以處理。一般的情況，padding 的 x axis 與 y axis 都會是不同的間距，但遇到內容只有 icon 卻反而適合相等的間距。

Loading

是不是要預設提供 Loading icon 也是挺讓人煩惱的。甚至切換狀態時是否要保留原本的按鈕寬度，可能還要處理對應的狀態切換生命週期。