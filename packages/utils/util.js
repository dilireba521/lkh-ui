import Vue from "vue";
const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

export const isFirefox = function () {
  return !Vue.prototype.$isServer && !!window.navigator.userAgent.match(/firefox/i);
}
//动画事件节流
export function rafThrottle(fn) {
  let locked = false;
  return function (...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame(() => {
      fn.apply(this, args);
      locked = false
    })
  }
}

//事件防抖
export const debounce = function (func, delay = 300) {
  let timer = null;
  return () => {
    const ctx = this;
    if (timer) {
      clearTimeout(timer)
      timer = null;
    }
    timer = setTimeout(() => {
      func.apply(ctx, arguments)
    }, delay);
  }
}

export function isKorean(text) {
  const reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi;
  return reg.test(text);
}