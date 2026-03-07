---
title: "關於我與前端無關緊要的分享 Day 32"
created: "2025年10月2日 星期四 08:24:45"
modified: "2025年10月2日 星期四 08:35:40"
folder: "竹子日誌文章"
---

# 關於我與前端無關緊要的分享 Day 32

React 更新了，React 19.2 ！

其中我最在意的功能莫屬 **useEffectEvent**。

一直以來 react 在下傳 function 時要去掛勾 useEffect 常常造成不必要的更新，這不是用 useCallback 能解決的，也解決以往我在開發時的痛點。

其他還有 Activity, **cacheSignal** 等等API，也為 SSR 相關機制與渲染進行優化與新功能提供。

https://react.dev/blog/2025/10/01/react-19-2?ck\_subscriber\_id=3110441451&amputm\_source=convertkit&amputm\_medium=email&amputm\_campaign=%E2%9A%9B%EF%B8%8F%20This%20Week%20In%20React%20