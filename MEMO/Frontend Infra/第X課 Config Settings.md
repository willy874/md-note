---
title: "第X課 Config Settings"
created: "2023年10月7日 星期六 10:36:44"
modified: "2025年10月23日 星期四 13:24:12"
folder: "Frontend Infra"
---

# 第X課 Config Settings

剛開始建專案，大部分的 Project Builder 都會幫你寫好 各種設定檔案。但你可能會覺得就是看不懂，因為設定這種東西就是知道就知道，不知道就不知道。

以常見的來說，如果你用 vite 就會有 vite.config，撰寫的是以 nodejs 為運行核心的打包設定。

再舉例大家常用的 eslint，它的寫法是 .eslintrc，它預設是用 json 進行解析，你也可以用 JavaScript，依照寫的方式不同，可以採用 cjs 或 mjs。當然各種情況還是要依據各種不同的運行系統去處理，或是依據需求和必要性去調整。如果是 jest 或webpack 如果有安裝 TypeScript 和 ts-node 還可以使用 .ts 來運行。

每一種 config 檔依據當初運行時的設計不同都有不同的支援，如果不熟悉可以使用的方式及工具會影響各種設定的結果。

除了套件的 Config 檔外，也可以多利用 IDE 的擴充插件，把各種套件與 IDE 插件進行整合來幫助開發，達到更好的團隊協作。雖然有些人蠻排斥去依賴 IDE 的插件使用，但如果團隊可以統一開發的模式與工具，其實在團隊協作上是更大的效率加持。