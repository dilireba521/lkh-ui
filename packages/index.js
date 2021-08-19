

///找到components下所有组件引入文件
const componentsJs = require.context('./components', true, /index.js$/)

///所有组件列表
let components = {};

///根据文件名找到组件,并放入组件列表
componentsJs.keys().forEach((fileName) => {
  const list = componentsJs(fileName)
  for (let key in list) {
    components[key] = list[key]
  }
})

///导出组件列表
export default components;

