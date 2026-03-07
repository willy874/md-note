---
title: "Tanstack Query"
created: "2025年3月29日 星期六 08:40:09"
modified: "2025年3月29日 星期六 14:08:35"
folder: "竹子日誌文章"
---

# Tanstack

# Q

# u

# ery

#

當今不管是 react 還是 vue，tanstack query 可以說是劃時代的解決方案。但我發現很多人對於它存在有著很大的誤解，我就想特別來分享一下。

許多人會把它定義為打 Backend API 的工具，但如果這樣定義它就太狹隘了。從 Library API 來看，我會從各個常用方法來說明它是什麼。

QueryClient

它是有個快取實體，具備 key value storage 的能力，它可以是很便利的 memory store。

useQuery

最容易有誤解的 API 之一，它並不是「打API 的方法」，我的理解是「Resource 的非同步狀態同步機」。resource 的定義很廣，包含 Backend API 、Browser Channel 、Index DB、Service Worker State⋯等等，我都覺得它是可以被拿來作為同步對象。也可以拿來同步「跟前端框架沒有綁定的 store」，因為它採取非同步的惰性更新，優點是不會卡線程，缺點是會延遲一個 Event loop queue。而它也可以應用做到更新響應，搭配 invalidateQueries 就可做到主動響應，可以很完整的做到事件流資料同步。

useMutation

一樣是很多人誤解的 API，並不是「專門打 Backend API」，更不是「data mutation methed」，它單純是「非同步方法的狀態管理機」。所有回應 Promise 的 function 都可以透過它來管理非同步的狀態生命週期，精準有效的控制非同步副作用的狀態。應用場景除了 Backend API，包含所有跟 I/O 互動的行為都可以透過它去管理渲染上不同階段的顯示。

結論

我覺得 tanstack query 並不是 api fetcher，而是一個 state management ，可以用來取代當近大部分 store 的職責，解決 90%以上的狀態管理需求。它應用多種設計模式和技巧來達成資料流管理，不管是 react 或 vue 都可以使用，是一個容易進行跨框架的狀態管理機。