
//实例通用方法
export default {
  methods: {
    //为父节点派发事件
    dispatch(componentName, eventName, params) {
      //定义父节点
      let parent = this.$parent || this.$root;
      //获取父节点自定义组件名称
      let name = parent.$options.componentName;
      //按照层级找到正确父节点
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.componentName;
        }
      }
      //找到父节点，将事件绑定到对应节点上
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    }
  }
}