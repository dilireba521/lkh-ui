import "../packages/style/index.scss"
import componentList from "../packages/index"


const install = function (Vue,) {
  //便利注册全局组件
  Object.keys(componentList).forEach((key) => {
    // debugger
    let comps = componentList[key];
    // 判断是否有install方法，如果有就执行
    comps.install && comps.install(Vue);
    Vue.component(key, comps)
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default {
  install,
  ...componentList
}
