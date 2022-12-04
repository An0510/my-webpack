import fs from 'fs'
import ejs from 'ejs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import { transformFromAst } from 'babel-core'
import * as path from "path";

function createAsset(filePath) {
  // 1.获取文件内容
  const source = fs.readFileSync(filePath, {
    encoding: "utf-8"
  })
  // console.log(source)
  // 2.获取依赖关系 正则/AST(@babel/parser(解析AST)+@babel/traverse(遍历AST))
  // 获取AST树节点
  const ast = parser.parse(source, {
    sourceType: 'module'
  })
  // console.log(ast,traverse)
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
    deps
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
    return {
      filePath: asset.filePath,
      code: asset.code
    }
  })
  // ejs模板
  const code = ejs.render(template, { data });

  console.log('data', data)
  fs.writeFileSync('./dist/bundle.js', code)

  console.log('bundle',code)
}

build(graph)
