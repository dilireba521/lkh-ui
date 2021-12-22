
import Vue from "vue";
import { hasOwn } from "./util";
const isServer = Vue.prototype.$isServer;
//设置浮层元素尺寸位置
const setElementSize = function (locationElem, elem, direction) {
  //获取定位元素的位置信息
  let rect = locationElem.getBoundingClientRect(),
    diff = 12,
    rectLeft = rect.left,
    rectTop = rect.top,//TODO 默认只返回元素下方位置信息，后期考虑添加direction方向参数
    rectWidth = rect.width,
    rectHeight = rect.height,
    elemHeight = elem.offsetHeight,
    elemWidth = elem.offsetWidth,
    basePlacement = direction.split("-")[0],
    shiftVariation = direction.split("-")[1],
    popperOffsets = {},
    arrowOffset = {};
  //当前文档宽高
  function windowArea(type) {
    return document.documentElement[type]
  }

  //浮层显示位置
  if (['right', "left"].indexOf(basePlacement) !== -1) {
    if ((rectLeft + rectWidth + diff + elemWidth) >= windowArea("clientWidth")) {
      //文档超右边界
      basePlacement = "left"
    } else if ((rectLeft - diff - elemWidth) <= 0) {
      //文档超左边界
      basePlacement = "right"
    }
    popperOffsets.top = rectTop + (rectHeight - elemHeight) / 2

    if (basePlacement === "right") {
      popperOffsets.left = rectLeft + rectWidth + diff;
    } else {
      popperOffsets.left = rectLeft - elemWidth - diff;
    }
  } else {
    if ((rectTop + elemHeight + rectHeight + diff) >= windowArea("clientHeight")) {
      //文档超下边界
      basePlacement = "top";
    }
    popperOffsets.left = rectLeft + (rectWidth - elemWidth) / 2;
    if (basePlacement === "top") {
      popperOffsets.top = rectTop - elemHeight - diff;
    } else {
      popperOffsets.top = rect.bottom + diff
    }
  }

  //通过位置信息，确定元素浮层起点或终点移动位置
  if (shiftVariation) {
    var leftShiftOffset = elemWidth < rectWidth ? elemWidth / 2 : rectWidth / 2
    var topShiftOffset = elemHeight < rectHeight ? elemHeight / 2 : rectHeight / 2
    var shiftOffsets = {
      x: { start: { left: rectLeft }, end: { left: rectLeft - elemWidth + rectWidth } },
      y: { start: { top: rectTop }, end: { top: rectTop - elemHeight + rectHeight } }
    }
    var shiftArrowOffsets = {
      x: {
        start: { left: leftShiftOffset },
        end: { left: elemWidth - leftShiftOffset }
      },
      y: {
        start: { top: topShiftOffset },
        end: { top: elemHeight - topShiftOffset }
      }
    }
    var axis = ['bottom', 'top'].indexOf(basePlacement) !== -1 ? 'x' : 'y';
    arrowOffset = shiftArrowOffsets[axis][shiftVariation]
    popperOffsets = Object.assign(popperOffsets, shiftOffsets[axis][shiftVariation])
  }

  return {
    arrowOffset: arrowOffset,
    popperOffsets: popperOffsets,
    placement: basePlacement + (shiftVariation ? ("-" + shiftVariation) : "")
  }
}

//获取带滚动条的父级
const getScrollParent = function (elem) {
  var root = window;
  var parent = elem.parentNode;
  if (!parent) {
    return elem;
  }
  if (parent === root.document) {
    // Firefox puts the scrollTOp value on `documentElement` instead of `body`, we then check which of them is
    // greater than 0 and return the proper element
    if (root.document.body.scrollTop || root.document.body.scrollLeft) {
      return root.document.body;
    } else {
      return root.document.documentElement;
    }
  }
  // Firefox want us to check `-x` and `-y` variations as well
  if (
    ["scroll", "auto"].indexOf(
      getStyleComputedProperty(parent, "overflow")
    ) !== -1 ||
    ["scroll", "auto"].indexOf(
      getStyleComputedProperty(parent, "overflow-x")
    ) !== -1 ||
    ["scroll", "auto"].indexOf(
      getStyleComputedProperty(parent, "overflow-y")
    ) !== -1
  ) {
    return parent;
  }
  return getScrollParent(parent);
};

//获取原属样式
const getStyleComputedProperty = function (elem, prop) {
  var css = window.getComputedStyle(elem, null);
  return css[prop];
};

//为element注册事件监听
const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler)
      }
    }
  }
})();

//移除element事件监听
const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.detachEvent("on" + event, handler)
      }
    }
  }
})()

//判断是否为Vue,element节点
const isVNode = function (node) {
  return node !== null && typeof node === 'object' && hasOwn(node, "componentOptions")
}

export { setElementSize, getScrollParent, on, off, isVNode }