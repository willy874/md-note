---
title: "Domain Driven Design"
created: "2023年9月18日 星期一 07:59:36"
modified: "2023年9月21日 星期四 08:40:59"
folder: "竹子日誌文章"
---

# Do

# main

# 

# Driven

# Design

#

上週是 DDD 年會，從每一場演講中搞懂「什麼是DDD」，我才醒悟⋯⋯原來我們公司一直在推動 DDD。然而對我來說也充滿衝擊，因為DDD並不是廣泛在前端應用的方式，進而導致經驗上的缺乏和水土不服。

其實從前端接收資料對這些 services 的處理幾乎沒什麼問題，這些關於 infrastructure 其實觀念上本來就存在。但到了Domain layer ，要定義一個角色的 entity 就開始產生迥異。基本上前端很少人會用這樣的方式去定義操作，這會對 domain model 建立大量的操作與方法，如果不使用「class」這樣的語法糖會難以操作。然而回到 User Interface layer ，也就是UI 部分，是使用 React 進行操作，在各種 class 的環境下要手動去綁定「this」，這樣反平時前端開發的習慣性。當然我可以去轉換變成 DTO 跟 UI 溝通，但整個複雜性可謂大幅度提升。

或許有人會認為，可以把 store 視為Domain operator ，但我覺得平常在做的store 其實更接近於Application layer 處理 flow 的概念，如果要把 flow 拉到 UI 來處理，那邏輯架構會將各種髒東西往 custom hook 去塞。

再來是 DDD 最核心的 Domain 。

以往前端會以職責劃分模組的習慣，比如 store、hooks、router、components 等等，開始要改成用功能劃分，比如 Auth、Log、Member、Order 等等。接著產生出來的問題就是資料共享依賴變得更加複雜，如果總是以模組為拆分單位，很快就會碰上依賴循環，A Domain 的低階模組依賴 B Domain 的高階模組，但 B Domain 的高階模組又需要依賴 A Domain 的高階模組，直接發生模組依賴循環，你又得再次把 Domain 的分工再拆小。

再來還要要談談前端實現 CQRS，原本在後端處理的讀寫分離拉到了前端，但前端根本沒這個概念！原本對於前端只有 function 的事情上升到一個 handler class，定義一個行為的成本與複雜度快速上升，更讓整個程式碼量以高速比例往上拉抬。

不過這一切也不是全然都是壞事。

以Domain 來劃分，把模組拆的更加乾淨，當專案要重構和移動時，整個工作成本大幅降低。應用邏輯變得更容易分工、打包、整合。git 衝突發生率也大幅下降，團隊會把精神放在更高層次的問題上面。

以CQRS來說，我們因為採用了「微前端」架構，每一個微前端元件溝通可以說是超級困難，有了Bus 去相互傳遞事件，讓每一個 Micro Frontend Component和 Domain Model 溝通都有了很好的橋樑。

你曾經在前端專案玩 DDD嗎？可以跟我分享唷！