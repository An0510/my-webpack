import fs from 'fs'
import ejs from 'ejs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import { transformFromAst } from 'babel-core'

// 获取AST
function createAsset(filePath) {
  // 1.获取文件内容
  let source = fs.readFileSync(filePath, {
    encoding: "utf-8"
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
  // TODO 存储Map 收集AssignmentExpression进行变量比对，剩余的就是未声明的或者说全局声明的。
  const variableMap = new Map()
  // 获取ast树中ImportDeclaration中的value部分
  traverse.default(ast, {
    VariableDeclaration({ node }){
      if (node.kind === 'var') {
        node.declarations.forEach((v) => {
          variableMap.set(v,v)
        })
      }
    },
    AssignmentExpression({ node }) {
      if (node.left.name) {
        console.log('AssignmentExpression-----------', node)
        console.log('AssignmentExpression-----------', node.left.name)
      }
    },
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
  }
}


function searchAssetGlobalVal() {
  const mainAsset = createAsset("./example.js")

}

searchAssetGlobalVal()
