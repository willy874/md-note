---
title: "關於我與前端無關緊要的分享Day 24"
created: "2025年9月20日 星期六 13:55:50"
modified: "2025年9月24日 星期三 08:12:03"
folder: "竹子日誌文章"
---

# 關於我與前端無關緊要的分享Day 24

# Build in Public

曾經我製作過無數的 Dialog 元件，嘗試使用各種各樣的方法，踩過無數的坑。

這種基於視窗彈出的元件一定要實作「Portal 」，在 vue 的話叫 「Teleport」，並且搭配 position fixed 定位到指定的位置。

Position

初次刻這個元件的人肯定覺得，position fixed 不就可以固定到螢幕中間？如果是下拉選單 position absolute 在旁邊就可以正常作動？何必搞一個 Portal 丟到 body 去？這件事真的沒有那麼簡單，有一個天坑就是 overflow ，任何超出這個元素都會切掉。沒錯，即時你 fixed 也一樣會被切掉，但難保你在畫面中就是會需要 scrollbar，所以你避也避不開，逃也逃不掉。

Transform

另外就是定位不能用「相對位置」，一定要使用絕對位置。因為定位邏輯上面還有可能發生即時運算的調整，不可輕言去相對設置，不然越喬越奇怪。更是不能用 top,left,right,bottom 去定位，要使用 transform translate，不然每次修改都會引發大面積的重新渲染。

也因為採用了 transform 的模式，使用了 translate 去定位，但其他的功能會失去。為了保有其他如 scale, rotate, rotate 等等能力，必須再搭配變數去完成多種效果的組裝。

Scrollbar

Portal 真的只要丟過去 body 就好嗎？

事情真的沒有那麼簡單，因為一路向上還有可能會遇到scrollbar，當你在滑動會意外觸發不同層級的 scrollbar，你必須把上層的 scrollbar 給 Lock ，以防使用者誤觸滾動。

也因為你塞入額外的元素在某個層級，可能會影響到那一層的寬度，使用者會有極不舒適的抖動。所以必須要取得 Container 的正確寬度來做定位計算，暫時在 Lock 時固定寬度。而這個正確寬度要扣掉 scrollbar width ，必須判斷是否存在 scrollbar，並取得其寬度。