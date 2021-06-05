Icon
====

## 使用方式
在 APP 下掛載 icon-component.js，引入 install.js。
```html
<template>
  <div>
    <Icon />
  </div>
<template>
```
```js
import '@/components/icon/install.js'
```

## 編寫 Icon
於 pattern 資料加撰寫 SVG 向量資料，再由 index 輸出模組。



## API
Name                | Type                | Default     | Description
--------------------|---------------------|-------------|------------
pattern             | Sting               | -           |  輸出向量 JS 的名稱
size                | Sting               | "auto auto" |  設定 Icon 的寬度與高度，也可只設定一個數字代表寬度，高度省略