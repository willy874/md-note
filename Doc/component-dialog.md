Dialog
====

## 使用方式
在 APP 下掛載 dialog-component.js，引入 install.js。
```html
<template>
  <div id="app">
    <div class="layout">...</div>
    <Dialog>
  </div>
<template>
```
```js
import '@/components/dialog/install.js'
```

## 編寫畫面
popup 內有範例的 Vue 檔案，主要分為 header、body、footer， **body** 為必引入要件。


## 呼叫
在專案任一處均可呼叫 dialog，也動態吃 vue 檔。
```js
import Dialog from '@/components/dialog'
import BodyDialog from './dialog-body.vue'

export default {
  methods: {
    open () {
      // 呼叫方式 1
      Dialog.open(BodyDialog, {
        // setting
        size: '600px'
      }).then(attrs => {
        // callback function
      })
      // 呼叫方式 2
        this.$dialog.open(BodyDialog, {
        // setting
        size: '600px'
      }).then(attrs => {
        // callback function
      })
    }
  }
}
```

## API
Name                | Type                | Default | Description
--------------------|---------------------|---------|------------
onBackgroundClick   | Boolen \| Function  | true    |  點擊背景是否要能夠關閉，或直接放入 callback
onClose             | Function            | 1000    |  觸發 resolve 時的 callback
size                | Sting               | auto    |  Panel 的最大寬度
attrs               | Any                 | { }     |  傳入 dialog 畫面的 props