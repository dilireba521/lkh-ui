# Demo 演示地址

http://vue.lkhan.top/

# NPM 安装

```js
npm instal lkui-vue  -S || yarn add lkui-vue
```

# CDN 安装

```js
<!-- 引入样式 -->
<link rel="stylesheet" href="https://unpkg.com/lkui-vue/lib/index.css">
<!-- 引入组件库 -->
<script src="https://unpkg.com/lkui-vue/lib/index.umd.js"></script>
```

# vue 项目引入

```js
import Vue from "vue";
import LkUI from "lkui-vue";
import "lkui-vue/lib/index.css";
import App from "./App.vue";

Vue.use(LkUI);

new Vue({
  el: "#app",
  render: (h) => h(App),
});
```

# Developer

```js
老客户，dilireba
```
