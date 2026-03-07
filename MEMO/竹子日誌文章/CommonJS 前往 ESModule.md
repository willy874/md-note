---
title: "CommonJS 前往 ESModule"
created: "2025年3月30日 星期日 10:58:04"
modified: "2025年4月4日 星期五 12:58:27"
folder: "竹子日誌文章"
---

# Co

# mm

# o

# n

# JS

# 

# 前往

# 

# ES

# Mo

# dule

#

ES6 ESModule 的模組化協議橫空出世，當時被 Node.js 的標準霸佔的 CommonJS 近年被社群逐漸蠶食，慢慢大家都只寫 ESModule。但事實上，大家寫的 ESModule 並不是真的上了瀏覽器還是用 ESModule 的標準在運行，而是透過打包工具如 Webpack, Rollup 之類的工具在進行處理，再透過如 Babel, ESBuild, SWC 之類的工具進行語法轉譯，端看最後跑出來的結果。

然而，隨著大家轉往 ESModule ，舊專案也開始要遷移，雖然大部分情況可以採用語法轉譯處理，但就是有一些麻煩的東西。

一個是 ESModule 多了 “export default” ，這是 CommonJS 沒有的概念，和 “module.export” 的物件是不同的結構概念，需要針對不同的應用方式去修正轉譯方式。

而最麻煩的莫過於「require」這個語法，轉換到 ESModule 肯定不少人吃過虧吧？如果裡面還去組裝 dynamic path，那可以說是非常難以遷移。也從 sync 變成 async，邏輯上就得採用截然不同的策略。這個部分修改起來可以說是頗爲費工，甚至會牽動很多邏輯。

常常聽到有人認為這單純可以靠轉換解決，但他們不知道的是，這兩種模組化並不是等價的，依照轉譯和撰寫的邏輯不同，就有不同的結果。但現代 ESModule 的 Tree shaking 是很誘人的價值，可以帶來的成效可見一般。