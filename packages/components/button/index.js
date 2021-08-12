import LKButton from './index.vue';

LKButton.install = function (Vue) {
  Vue.component(LKButton.name, LKButton)
}

//导出组件
export default LKButton;