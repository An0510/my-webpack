/*
 * 插件改变打包之后的路径
*/

export class ChangeOutputPath {
  apply(hooks) {
    hooks.emitFile.tap("changeOutputPath",(context) => {
      context.changeOutputPath('./build/bundle.js')
    })
  }
}

