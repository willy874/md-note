---
title: "CSS In JS"
created: "2025年3月29日 星期六 18:32:51"
modified: "2025年3月30日 星期日 09:31:51"
folder: "竹子日誌文章"
---

# CS

# S

# 

# In

# J

# S

# 

#

styled-components 終止更新，進入長期維護階段，這件事社群沸沸揚揚。

有人說，這件事代表的是一代技術的興衰，隨著 Atomic CSS 的興起，逐漸大家捨棄了原本 cssinjs 的方案。也有人說，與其使用 runtime 的 CSS 手段，應該採用 Zero runtime 的方案。更甚至有人說應該採用 CSS Module 的方式。

但是⋯⋯真的是這樣嗎？

其實所有的解決方法都有其存在價值，我認為沒有一個方案是「應該被淘汰」的，而是基於業務場景評估技術的價值和優劣。

以其他技術來說，相較 cssinjs，你會發現它依然有很多無可取代之處。

Atomic CSS 來說，它非常原子化的去拆分 CSS，也造成閱讀上 class 命名的冗長，最後依靠 apply 去重新 merge 多個功能，最後依然走回最傳統的 css 使用令人詬病的老路。

CSS Module 來說，一組 module css 綁定著一支 css 檔案，你放不開這組綁定關係。撰寫時使用方式也是頗費勁，需要宣告長長的 class name。css module 因為經過打包，也有蠻多頗麻煩的運行問題，當發生 bug 時不容易排查。

Zero Runtime 來說，目前主流的 Unocss 也是 runtime ，但體驗也並不差。有人說對於 zero runtime 是為了求更快的初次渲染速度。不過 cssinjs 是可以有辦法做到靜態分析，也可以在伺服器渲染時去分析靜態的 css 直接渲染到 html 上，更也能同時兼容進入瀏覽器上去水合(hydration) 整個CSS，所以彈性反而比追求 zero runtime 更高。也有人詬病 bundle size 的肥大，但除了 styled-components 外，好比 emotion，可以做到 css merge，它可以整併一模一樣的 css string，進一步去共用重複的 class。

我想說的是，你認為的 cssinjs 並不是該被淘汰，而是還有許多需要完善的地方。它目前還有很多改進空間，也很多 library 嘗試去改變。

好比 antd/cssinjs，它大幅改善渲染效能的缺陷，大幅度去共用底層 cache 的共用，讓整個 css system 達到更精確的 css 使用效率。

好比 jss ，透過 AST 的分析，提供豐富的 API 延展，潛藏社群圈無限的可能。

最後，styled-components 一事並不是 cssinjs 時代的終結，而是代表一個套件的興盛消亡。任何生態系和套件一定會隨著時空背景改變，最好的方式是做好合適的抽象和版本更迭計劃，為專案業務需求寫好文件和測試，為每一次的重構做好保障。

專案能永續經營，這才是軟體開發的真諦。