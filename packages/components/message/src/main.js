import Vue from "vue";
import LkMessage from "./message.vue"
import { isObject } from "../../../utils/util"

let MessageConstructor = Vue.extend(LkMessage);
let instance;
let instances = [];
let seed = 1;


const Message = function (propsData) {
  propsData = propsData || {};
  //内容赋值
  if (typeof propsData == 'string') {
    propsData = {
      message: propsData
    }
  }

  //注册关闭事件
  let userOnClose = propsData.onClose;
  let id = "message_" + seed++;
  propsData.onClose = function () {
    Message.close(id, userOnClose)
  }
  //实例化
  instance = new MessageConstructor({ propsData });
  instance.id = id;

  //手动挂载
  instance.$mount()
  //添加入body内
  document.body.appendChild(instance.$el);
  let verticalOffset = 20;
  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16;
  })
  instance.verticalOffset = verticalOffset;
  instance.visible = true;
  instance.$el.style.zIndex = seed;
  instances.push(instance);
  return instance
};

['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = (options) => {
    if (isObject(options)) {
      return Message({
        ...options,
        type
      })
    } else {
      return Message({
        type,
        message: options
      })
    }
  }
});

Message.close = function (id, closeFunc) {
  let len = instances.length;
  let index = -1;
  let removeHeight;
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      removeHeight = instances[i].$el.offsetHeight;
      index = i;
      (typeof closeFunc === "function") && closeFunc(instances[i])
      instances.splice(i, 1)
      break;
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return
  for (let i = index; i < len - 1; i++) {
    let dom = instances[i].$el;
    dom.style['top'] = parseInt(dom.style['top']) - removeHeight - 16 + 'px'
  }
}

Message.closeAll = function () {
  for (let i = instances.length - 1; i > 0; i--) {
    instances[i].close()
  }
}

//注册全局组件
Message.install = function (Vue) {
  Vue.prototype.$message = Message;
}

export default Message;