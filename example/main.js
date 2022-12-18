import {foo} from "./foo.js";
import user from './user.json'

// 由于json不是一个js文件，babel不认识json，因此会报错
// 解决方法：用loader让json变为js，让babel认识
console.log(user)
foo()
console.log('main.js')
