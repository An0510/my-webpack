import fs from 'fs'
import ejs from 'ejs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import { transformFromAst } from 'babel-core'
import * as path from "path";
import { jsonLoader } from './jsonLoader.js'

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        // 当链式调用多个loader时，是反方向执行的
        use: [jsonLoader]
      }
    ]
  },
}

let id = 0

function createAsset(filePath) {
  // 1.获取文件内容
  let source = fs.readFileSync(filePath, {
    encoding: "utf-8"
  })

  // initLoader
  const loaders = webpackConfig.module.rules
  // webpack可以在loader中调用this，实际上是通过声明一个上下文绑定到函数的方式
  const loaderContext = {
    addDeps(dep){
      console.log("addDeps",dep)
    }
  }
  loaders.forEach(({ test, use }) => {
    if (test.test(filePath)) {
      if(Array.isArray(use)){
        use.reverse().forEach((fn) => {
            // 将loaderContext作为fn的this
            source = fn.call(loaderContext,source)
        })
      } else {
        // 通过loader之后更新source为js
        source = use.call(loaderContext,source)
      }
    }
  })

  // console.log(source)
  // 2.获取依赖关系 正则/AST(@babel/parser(解析AST)+@babel/traverse(遍历AST))
  // 获取AST树节点
  const ast = parser.parse(source, {
    sourceType: 'module'
  })
  // console.log(ast,traverse)
  // 存储当前文件中所有引用文件路径
  const deps = []
  // 获取ast树中ImportDeclaration中的value部分
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      console.log('import---', node.source.value)
      // TODO import {foo} from "./foo"时不能直接获取到后缀.js
      deps.push(node.source.value)
    }
  })
  // 将ESM转换为Sea.js代码
  const { code } = transformFromAst(ast, null, {
    presets: ["env"]
  })
  // console.log('code', code)
  return {
    filePath,
    code,
    deps,
    mapping: {},
    id: id++,
  }
}

// const assets = createAsset("./example/main.js")
// // 拿到文件和import信息
// console.log(assets)
// 建立图结构
function createGraph() {
  const mainAsset = createAsset("./example/main.js")

  const queue = [mainAsset]
  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      // 文件内容及依赖关系
      const child = createAsset(path.resolve("./example", relativePath))
      // example: { "./foo.js" : 2 }
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }
  return queue
}

const graph = createGraph()
// console.log(graph)

// 通过模板ejs生成bundle
function build(graph) {
  const template = fs.readFileSync('./bundle.ejs', {
    encoding: "utf-8"
  })
  const data = graph.map((asset) => {
    const { id, code, mapping } = asset
    return {
      id,
      code,
      mapping
    }
  })
  // ejs模板
  const code = ejs.render(template, { data });

  console.log('data', data)
  fs.writeFileSync('./dist/bundle.js', code)

  console.log('bundle', code)
}

build(graph)
