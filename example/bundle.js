(function (modules) {
  function require(id) {
    /*
     * fn 对应路径下函数
     * mapping 映射关系
     */
    const [fn, mapping] = modules[id]

    const module = {
      exports: {}
    }

    /*
     * 使require通过路径ID拿到文件路径
     * filePath：路径ID
     */
    function localRequire(filePath) {
      const id = mapping[filePath]
      // 通过require找到文件中引用的文件，形成递归
      return require(id)
    }

    // 当前文件下的fn，传入localRequire用于require引用
    fn(localRequire, module, module.exports)
    // 将被调用的文件的exports返回
    return module.exports
  }

  require(1)
})({

  1: [function (require, module, exports) {
    const { foo } = require("./foo.js")
    foo()
    console.log('main.js')
  }, {
    "./foo.js": 2,
  }],

  2: [function (require, module, exports) {
    function foo() {
      console.log('foo.js');
    }

    module.exports = {
      foo
    }
  }, {}],

})
