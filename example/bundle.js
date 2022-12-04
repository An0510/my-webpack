/*
 * bundle模板文件
 */
// 需要考虑作用域隔离：用函数包裹
// import不能在非顶级作用域被使用：需要用sea.js思想,实现require
(function (modules) {
  function require(filePath) {
    const fn = modules[filePath]

    const module = {
      exports: {}
    }
    fn(require, module, module.exports)

    return module.exports
  }
  require('./main.js')
})({ // 路径和函数映射
  "./foo.js": function (require, module, exports) {
    function foo() {
      console.log('foo')
    }
    module.exports = {
      foo,
    }
  },
  "./main.js": function (require, module, exports) {
  // import {foo} from "./foo.js";
  const {foo} = require('./foo.js')
  foo();
  console.log('main.js')
  }
})
