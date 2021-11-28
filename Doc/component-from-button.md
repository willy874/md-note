button
====

## 使用方式
在 APP 下引入 install.js。
```html
<template>
  <div>
    <ButtonBox />
  </div>
<template>
```
```js
import '@/components/from/install.js'
```

## 啟動動態偵測 Model
更改放入的 model 資料，已達動畫上的控制。
```js
export default {
  methods: {
    async submit () {
      // this.loaded = true // 此時 loaded 的狀態必須要為 true
      const errorMessage = this.model.validate()
      if (errorMessage.length) {
        return
      }
      await this.$nextTick()
      this.loaded = false
      api().then(() => {
        this.loaded = true
      }).catch(() => {
        this.loaded = true
      })
    }
  }
}
```


## API
Name                | Type                | Default     | Description
--------------------|---------------------|-------------|------------
model               | DataModel           | -           |  輸出向量 JS 的名稱
slots.icon          | VNode               | ""          |  設定 Icon 使用的節點
slots.success       | VNode               | ""          |  設定 success 時使用的文字節點
slots.error         | VNode               | ""          |  設定 error 時使用的文字節點
slots.loading       | VNode               | ""          |  設定 error 時使用的文字節點
slots.default       | VNode               | ""          |  平時的文字