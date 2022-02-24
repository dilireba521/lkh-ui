import Vue from "vue";
import LkDialog from "./dialog.vue";
import { isObject } from "../../../utils/util"

let DialogConstructor = Vue.extend(LkDialog)
let instance;
let instances = [];
let seed = 1;

const Dialog = function (propsData) {
  propsData = propsData || {};

  //判断数据类型
  if (typeof propsData === "string") {
    propsData = {
      content: propsData
    }
  }

  //初始化数据和事件
  let userOnClose = propsData.onClose;//关闭事件
  let id = "dialog_" + seed++;//唯一标识；
  propsData.onClose = function () {
    Dialog.close(id, userOnClose)
  }

  //实例化组件
  instance = new DialogConstructor({ propsData });
  instance.id = id;

  //手动添加底部按钮事件
  if (instance.btns && instance.btns.length > 0) {
    for (let i = instance.btns.length - 1; i >= 0; i--) {
      let funcName = 'btn' + i;
      if (i == 0) {
        funcName = 'yes';
      }
      instance[funcName] = function () {
        typeof propsData[funcName] === "function" && propsData[funcName]()
      }
    }
  }

  //手动挂载
  instance.$mount();

  //添加到body底部
  document.body.appendChild(instance.$el);
  instance.visible = true;
  instance.$el.style.zIndex = seed;
  instances.push(instance)
  return instance;
};

['success', 'warning', 'info', 'danger'].forEach(type => {
  const titleIcons = {
    success: 'is-success lk-icon-success',
    warning: 'is-warning lk-icon-warning',
    info: 'is-info lk-icon-info',
    danger: 'is-danger lk-icon-error',
  }

  Dialog[type] = (options) => {
    if (isObject(options)) {
      return Dialog({
        ...options,
        titleIcon: titleIcons[type]
      })
    } else {
      return Dialog({
        content: options,
        titleIcon: titleIcons[type]
      })
    }
  }
});

//关闭事件
Dialog.close = function (id, callBack) {
  let _id = id;
  if (typeof id === "object") {
    _id = id.id
  }
  let len = instances.length;
  for (let i = 0; i < len; i++) {
    if (instances[i].id === _id) {
      instances[i].visible = false;
      (typeof callBack === "function") && callBack(instances[i])
      instances.splice(i, 1);
      break;
    }
  }
}

//关闭所有弹框
Dialog.closeAll = function () {
  for (let i = instances.length - 1; i > 0; i--) {
    instances[i].close()
  }
}

//注册全局组件
Dialog.install = function (Vue) {
  Vue.prototype.$dialog = Dialog;
}

export default Dialog;



