function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName
    if (name == componentName) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]))
    }
  })
}

//实例通用方法
export default {
  methods: {
    //子节点为父节点派发事件
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
    },
    //将节点事件广播给子节点
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    }
  }
}