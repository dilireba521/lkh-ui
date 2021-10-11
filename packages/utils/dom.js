
//设置元素尺寸位置
const setElementSize = function (locationElem, elem) {
  //获取定位元素的位置信息
  let rect = locationElem.getBoundingClientRect(),
    diff = 4,
    leftSize = rect.left,
    topSize = rect.bottom + diff,//TODO 默认只返回元素下方位置信息，后期考虑添加direction方向参数
    elemHeight = elem.offsetHeight,
    elemWidth = elem.offsetWidth;
  //当前文档宽高
  function windowArea(type) {
    return document.documentElement[type]
  }
  //文档超右边界
  if (leftSize + elemWidth >= windowArea("clientWidth")) {
    leftSize = leftSize - (elemWidth - rect.width)
  }
  //文档超低边界
  if (topSize + elemHeight >= windowArea("clientHeight")) {
    topSize = rect.top - elemHeight;
  }
  return {
    left: leftSize + "px",
    top: topSize + "px",
  }
}
export { setElementSize }