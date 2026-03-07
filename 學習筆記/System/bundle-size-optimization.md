# Bundle Size Optimization

## 專案 Tree Shaking 優化筆記

因專案目前 Tree Shaking 是失效的，導致無效的 module 無法被優化。專案為測試基底，進行一系列測試與優化來排查問題。

---

### 發現問題

根據前輩建議，使用 `react-use` 時需明確指定模組：

```js
import useMount from "react-use/lib/useMount"
```

這樣可以精確抓取模組，因為專案無法正確執行 Tree Shaking。

但即便全專案約 90% 採用 ESModule 撰寫，仍未生效。以下為測試用的引入：

```js
import {} from "react-use"
```

透過 Webpack 設定進行打包測試，發現 `react-use` 所有模組仍被一併打包進 `vendor bundle`。

此問題大幅增加 bundle size，因此需擬定改善計畫。

---

### 第一階段：移除 Babel 中不必要的插件

透過排查發現，Webpack 在轉為最終模組格式前，語法會變為 CommonJS。原因是 Babel 使用了以下插件：

```json
@babel/plugin-transform-modules-commonjs
```

導致所有 ESM 轉為 CommonJS。要移除此插件，需將專案內部所有模組統一改為 ESModule：

```js
// Before
const modules = require("./module")
exports.moduleChunck = chunck
module.exports = chunck

// After
import modules from "./module"
export const moduleChunck = chunck
export default chunck

// Dynamic import
import("./module").then((modules) => {
  modules.default
})
```

完成轉換後即可移除該 Babel 插件。

#### 打包結果（以 `yarn build k36 sit` 測試）：

- 優化前：`10,680,351 byte`
- 優化後：`9,621,664 byte`

---

### 第二階段：套件改用 ESModule

多數現代套件已支援 ESModule，但目前專案 Webpack 設定未啟用：

```js
const webpackConfig = {
  ...
  resolve: {
    ...
    mainFields: ['browser', 'jsnext:main', 'main']
  }
}
```

需調整為：

```js
const webpackConfig = {
  ...
  resolve: {
    ...
    mainFields: ['browser', 'module', 'jsnext:main', 'main']
  }
}
```

此修改後會出現 ESModule 與 CommonJS 混合導致模組錯亂，需優先處理私有模組：

- `nrc-components`
- `nrc-formik`
- `react-draft-wysiwyg`

這三個套件原以 Babel 轉為 CommonJS，不支援 ESModule，需重新設計打包方式。

先使用 Workaround 方案，強制採用 CommonJS 打包。

#### 打包結果：

- 優化前：`9,621,664 byte`
- 優化後：`9,325,612 byte`

---

### 第三階段：導入 SWC 編譯器

Babel 雖然成熟，但因現代生態偏向 SWC/ESBuild，語法最佳化與編譯速度逐漸落後。

使用 `@swc/core` + `swc-loader` 可提升效能與現代語法支援，但需先排除依賴的 Babel plugin。

```js
const webpackConfig = {
  ...
  module: {
    ...
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        include: paths.appSrc,
        use: [
          'thread-loader',
          {
            loader: 'swc-loader'
          }
        ]
      }
    ]
  }
}
```

先以 Workaround 方式，替換 loader 進行測試打包。

#### 打包結果：

- 優化前：`9,325,612 byte`
- 優化後：`8,833,086 byte`

---

### 第四階段：持續改善撰寫習慣

除了基本設定外，Tree Shaking 的成功與否也與撰寫習慣密切相關，仍需持續優化專案內會破壞 Tree Shaking 的不良模式。

---

## 總結效益

| 階段            | Bundle Size       |
|-----------------|-------------------|
| 初始大小        | 10,680,351 byte    |
| 最終優化後      | 8,833,086 byte     |
| **減少比例**     | **約 18%**         |
| **潛力極限**     | **可望超過 20%**    |

此外：

- 打包速度（production mode）預估可提升 **30% 以上**
- 為未來打包架構建立現代化基礎，改善開發體驗

---

## 常見問題說明

### 為什麼過去 SWC 不能正常使用？

1. **Babel 插件轉 ESM → CommonJS**，但 SWC 預設為 ESM，導致轉換後解析失敗，執行時報錯。
2. **SWC 安裝依賴 OS 環境**，若環境不符，安裝的 SDK 版本會錯誤，導致無法編譯。
3. **Target 版本錯誤**，若設定錯誤會導致 polyfill 加入增加 bundle size。
4. **JSX 設定與 React 版本不一致**，若主應用與套件間 React 版本不同，會造成生命周期錯誤與 rerender 問題。

---

這些優化策略與問題記錄有助於系統性改善現代前端打包效率與架構穩定性。
