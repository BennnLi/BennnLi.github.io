# ES6（ES2015）

ECMAScript 第 6 版 · 2015 年 6 月发布

这版动静最大，后面几年基本都在它上面打补丁。想系统学，推荐 [阮一峰 ES6 入门教程](https://es6.ruanyifeng.com/)。

## 版本速览
1. `let` / `const`：块级作用域，附暂时性死区
2. 箭头函数
3. 模板字符串（含标签模板）
4. 解构、默认值、展开
5. 对象字面量增强
6. `class`
7. 模块
8. `Promise`
9. 生成器
10. `Symbol`
11. `Map` / `Set` / `WeakMap` / `WeakSet`
12. `TypedArray` / `ArrayBuffer` / `DataView`
13. `for...of`
14. 一批新内置方法
15. `Proxy` / `Reflect`
16. 二进制 / 八进制字面量、正则 `u` / `y` 标志
17. 尾调用优化（proper tail calls）

## let / const

`var` 只有函数作用域，`let` 和 `const` 是块级的 —— 大括号就是它的地盘。

````javascript
if (true) {
  let a = 1
  var b = 2
}
a   // ReferenceError
b   // 2，跑出来了
````

`let` 声明之前不能碰，碰了直接报错，不像 `var` 那样给你个 `undefined`：

````javascript
x   // ReferenceError: Cannot access 'x' before initialization
let x = 1
````

循环里的差别最实在：

````javascript
for (let i = 0; i < 3; i++) fns.push(() => i)   // [0, 1, 2]
for (var i = 0; i < 3; i++) fns.push(() => i)   // [3, 3, 3]
````

因为 `let` 每轮循环都是新的绑定，`var` 从头到尾就一个。当年抢答题最爱考这个。

`const` 只是不能重新赋值，对象里的东西照样改：

````javascript
const o = { a: 1 }
o.a = 2    // 可以
o = {}     // TypeError
````

## 箭头函数

少写个 `function`，顺手把 `this` 的问题一刀切了。

````javascript
const add = (a, b) => a + b
const pick = x => ({ id: x })    // 返回对象得套括号
````

它**没有自己的 `this`**，里头的 `this` 就是外面那层的：

````javascript
const obj = {
  name: 'obj',
  normal() { return this.name },   // 'obj'
  arrow: () => this.name           // undefined
}
````

副作用有两个，都得记着：不能 `new`（也没有 `prototype`），没有 `arguments`。

## 模板字符串

````javascript
const name = 'lee'
`你好 ${name}，${1 + 1}`    // '你好 lee，2'

// 多行不用拼 \n
`第一行
第二行`
````

前面挂个函数就是标签模板，`styled-components` 那套全靠它：

````javascript
const tag = (strs, ...vals) => strs.raw.join('|')
tag`a${1}b`    // 'a|b'
````

## 解构、默认值、展开

````javascript
const { a, b: renamed, c = 3 } = obj
const [first, , third] = arr

function f(a, b = 1, ...rest) {}
Math.max(...[1, 2, 3])
const merged = { ...a, ...b }
````

默认值**只认 `undefined`**，`null` 不算：

````javascript
const { a = 1 } = { a: null }    // a 是 null，不是 1
````

参数里解构是日常高频写法，尾巴记得留个 `= {}`，不然不传参就炸：

````javascript
function draw({ x = 0, y = 0, color = 'red' } = {}) {}
````

`...` 是**浅**的，嵌套对象还是共享引用。

## 对象字面量增强

````javascript
const x = 1, key = 'k'

const o = {
  x,                 // 属性简写
  method() {},       // 方法简写
  [key]: 2,          // 计算属性名
  ['a' + 'b']: 3
}
````

## class

语法糖，底下还是原型链。

````javascript
class Animal {
  constructor(name) { this.name = name }
  speak() { return `${this.name} 叫了一声` }
  static create(n) { return new Animal(n) }
}

class Dog extends Animal {
  constructor(name) { super(name) }
  speak() { return super.speak() + '：汪' }
}
````

两点跟函数不一样：**不提升**（声明前用会 `ReferenceError`），内部**默认严格模式**。

## 模块

一个文件一个模块，`export` 出去，`import` 进来。

````javascript
// math.js
export const add = (a, b) => a + b
export default function () {}

// main.js
import fn, { add } from './math.js'
import * as math from './math.js'
````

浏览器里得用 `<script type="module">`。模块顶层的 `this` 是 `undefined`，别指望它指向全局。

## Promise

把回调地狱拉平。

````javascript
fetch('/api')
  .then(r => r.json())
  .then(render)
  .catch(err => console.error(err))
  .finally(() => hideLoading())
````

状态就三种，变了就回不去：`pending` → `fulfilled` / `rejected`。

````javascript
Promise.all([p1, p2])     // 全成功才成功，一个失败就整体失败
Promise.race([p1, p2])    // 谁先结束算谁
````

## 生成器

`function*` 配 `yield`，函数能暂停、能续跑。

````javascript
function* gen() {
  const x = yield 1
  yield x + 1
}

const it = gen()
it.next()      // { value: 1, done: false }
it.next(10)    // { value: 11, done: false }
````

实际用处就两个：惰性序列，以及 `async/await` 的底层（现在引擎原生支持了，业务代码基本用不上）。

## Symbol

新的原始类型，每次调用都是独一份。

````javascript
Symbol('a') === Symbol('a')    // false
````

主要拿来当 key，不撞名，也不会出现在 `Object.keys` 和 `JSON.stringify` 里：

````javascript
const s = Symbol('hidden')
const o = { normal: 1, [s]: 2 }

Object.keys(o)       // ['normal']
JSON.stringify(o)    // '{"normal":1}'
o[s]                 // 2
````

## Map / Set / WeakMap / WeakSet

`Object` 的 key 只能是字符串或 Symbol，`Map` 什么都能当 key：

````javascript
const m = new Map()
m.set('a', 1).set(1, 'num').set({}, 'obj')

m.size     // 3
m.get(1)   // 'num'
````

`Set` 去重，`NaN` 也算重复：

````javascript
new Set([1, 1, 2, NaN, NaN]).size    // 3
````

`WeakMap` / `WeakSet` 的 key 必须是对象，弱引用，不能遍历。适合放"跟着对象走"的附属数据，对象没了数据也自动清掉。

## TypedArray / ArrayBuffer / DataView

二进制数据的三件套：`ArrayBuffer` 是一块字节，`TypedArray` 按类型读写，`DataView` 按任意偏移和格式读写。

````javascript
const buf = new ArrayBuffer(8)       // 8 个字节
const i32 = new Int32Array(buf)      // 按 32 位整数看，长度 2
i32[0] = 1

new Uint8Array(buf).length           // 8，按 8 位无符号看
new DataView(buf).getInt16(0)        // 按指定偏移读
````

视图有一整套：`Int8Array` / `Uint8Array` / `Int16Array` / `Uint16Array` / `Int32Array` / `Uint32Array` / `Float32Array` / `Float64Array`。

跟普通数组的差别：长度固定、只能放数字、除了 `slice` 没有 `push` / `pop` 这些方法。

业务代码很少直接写，但文件上传、`fetch` 的 `arrayBuffer()`、WebGL、音视频处理全靠它。

## for...of

`for...of` 遍历值，`for...in` 遍历 key，而且会把原型链和手工挂上去的东西一起带出来：

````javascript
const arr = ['a', 'b']
arr.extra = 'X'

for (const k in arr) console.log(k)    // 0 1 extra
for (const v of arr) console.log(v)    // a b
````

结论：数组用 `for...of` 或 `forEach`，`for...in` 留给对象。

能 `for...of` 的叫可迭代对象 —— 有 `Symbol.iterator` 方法。字符串、数组、`Map`、`Set`、`arguments`、`NodeList` 都算。

## 一批新内置方法

挑真会用到的：

````javascript
Object.assign({}, a, b)                  // 浅合并
Array.from({ length: 3 }, (_, i) => i)   // [0, 1, 2]，造数组神器
Array.from('abc')                        // ['a', 'b', 'c']
Array.of(3)                              // [3]，注意 new Array(3) 是三个空位
Array.from(new Set([1, 1, 2]))           // 去重

Number.isNaN(NaN)        // true
Number.isNaN('abc')      // false
isNaN('abc')             // true  ← 老的那个会先转数字
Number.isInteger(1.0)    // true
Number.MAX_SAFE_INTEGER  // 9007199254740991

'abc'.includes('b')      // true
'abc'.startsWith('a')    // true
'abc'.repeat(2)          // 'abcabc'

[1, 2, 3].find(x => x > 1)        // 2
[1, 2, 3].findIndex(x => x > 1)   // 1
````

`Number.isNaN` 和 `isNaN` 的区别值得单独记：老的 `isNaN` 先做类型转换，`isNaN('abc')` 是 `true` —— 它其实在问"转成数字之后是不是 NaN"。新的只判断"是不是真的是 NaN"。

## Proxy / Reflect

`Proxy` 给对象套一层壳，读、写、删、查都能被你截住。Vue 3 的响应式就是它。

````javascript
const p = new Proxy(target, handler)
````

`target` 是原对象，`handler` 里放拦截函数（叫 trap）。trap 不写就是透明转发，读写的还是原来那个对象。

常用的几个 trap：

| trap | 拦的是 |
|------|-------|
| `get` | 读属性 `p.x` |
| `set` | 写属性 `p.x = 1` |
| `has` | `'x' in p` |
| `deleteProperty` | `delete p.x` |
| `ownKeys` | `Object.keys(p)`、`for...in` |
| `apply` / `construct` | 调用 `p()` / `new p()`（target 是函数时）|

剩下还有 `defineProperty`、`getOwnPropertyDescriptor`、`getPrototypeOf`、`setPrototypeOf`、`isExtensible`、`preventExtensions`，都是对应的对象操作。

### 拿来做什么

**兜底默认值**

````javascript
const defaults = new Proxy({}, {
  get: (t, k) => k in t ? t[k] : '默认值'
})
defaults.anything    // '默认值'
````

**赋值时校验**

````javascript
const user = new Proxy({}, {
  set(t, k, v) {
    if (k === 'age' && (typeof v !== 'number' || v < 0)) {
      throw new TypeError('age 得是非负数')
    }
    t[k] = v
    return true
  }
})

user.age = 18    // ok
user.age = -1    // TypeError: age 得是非负数
````

**让数组支持负数下标**

````javascript
const arr = new Proxy([10, 20, 30], {
  get: (t, k) =>
    typeof k === 'string' && /^-\d+$/.test(k)
      ? t[t.length + Number(k)]
      : t[k]
})

arr[-1]    // 30
arr[-3]    // 10
````

**藏字段**

````javascript
const secret = new Proxy({ visible: 1, token: 'xxx' }, {
  has: (t, k) => k !== 'token' && k in t,
  ownKeys: t => Reflect.ownKeys(t).filter(k => k !== 'token'),
})

'token' in secret      // false
Object.keys(secret)    // ['visible']
````

**函数也能代理**

````javascript
const fn = new Proxy((a, b) => a + b, {
  apply: (t, thisArg, args) => t(...args) * 10,
  construct: (t, args) => ({ doubled: args[0] * 2 }),
})

fn(1, 2)      // 30
new fn(21)    // { doubled: 42 }
````

### 几个得知道的

**是浅代理。** 只代理你套的那一层，嵌套对象原样透出来：

````javascript
const p = new Proxy({ inner: { x: 1 } }, {
  get: (t, k) => (console.log('get', k), t[k])
})

p.inner.x    // 只打印一次 get inner，读 .x 不再触发
````

想深代理得自己递归包。

**`set` trap 得返回 `true`**，返回假值会抛错，而且报错的是**调用方**：

````text
TypeError: 'set' on proxy: trap returned falsish for property 'x'
````

做只读代理就是靠这个，但你得清楚代价是使用方炸。

**有些事拦不住。** 规范有不变量（invariant）兜底。比如对不可写、不可配置的属性，`get` 不能返回别的值：

````javascript
const frozen = Object.freeze({ a: 1 })
new Proxy(frozen, { get: () => 'hacked' }).a
// TypeError: 'get' on proxy: property 'a' is a read-only and non-configurable
// data property on the proxy target but the proxy did not return its actual value
````

**有性能开销。** 代理比直连慢，别在热点路径上给几千个对象套壳。

**可以撤销。** 交给不受信任的代码时挺好用 —— 用完直接废掉：

````javascript
const { proxy, revoke } = Proxy.revocable({ a: 1 }, {})

proxy.a     // 1
revoke()
proxy.a     // TypeError: Cannot perform 'get' on a proxy that has been revoked
````

### Reflect

`Reflect` 是这些对象操作的函数版，一共 13 个：

````javascript
Reflect.get(target, key)
Reflect.set(target, key, value)
Reflect.has(target, key)
Reflect.deleteProperty(target, key)
Reflect.ownKeys(target)
Reflect.apply(fn, thisArg, args)
Reflect.construct(Ctor, args)
// 还有 getPrototypeOf / setPrototypeOf / isExtensible / preventExtensions
//     defineProperty / getOwnPropertyDescriptor
````

`Reflect.get(t, k)` 基本等价于 `t[k]`；`Reflect.set` 会返回布尔值告诉你成没成。

**为什么要配着 `Proxy` 用** —— 因为它就是"默认行为"。写 `Reflect.xxx(...)` 等于"该干嘛干嘛，我只是顺便插一脚"：

````javascript
const logged = new Proxy({ a: 1 }, {
  get(t, k, r) { console.log('读到', k); return Reflect.get(t, k, r) },
  set(t, k, v, r) { console.log('写入', k); return Reflect.set(t, k, v, r) },
})
````

自己写 `t[k]` 也能跑，但 `Reflect` 有几个地方更顺手：`set` 有返回值可以直接 `return`，不用手动补 `return true`；`deleteProperty` 这类操作单写语句拿不到成功与否；另外还有下面这个 `receiver`。

**`receiver` 是干嘛的**

原对象上有个 getter，代理上覆盖了它读的内部字段：

````javascript
const target = {
  _v: 'target 上的值',
  get value() { return this._v },
}

// 不传 receiver：getter 里的 this 是 target
new Proxy(target, { get: (t, k) => t[k] }).value
// 'target 上的值'

// 传 receiver：this 变成代理，会再走一遍 get
new Proxy(target, {
  get(t, k, r) {
    if (k === '_v') return 'proxy 上的值'
    return Reflect.get(t, k, r)
  }
}).value
// 'proxy 上的值'
````

差别就在 **getter 里的 `this` 指向谁**。`Reflect.get(t, k, r)` 把 `r`（代理自己）作为 `this` 传进去，语义才是"从代理上取值"。写响应式库时这个细节很关键。

另外，老的对象 API 在 `Reflect` 里都有对应版本，而且**失败返回 `false` 而不是抛错** —— 这也是它在 trap 里更好用的原因。

## 二进制 / 八进制字面量与正则标志

````javascript
0b1010          // 10，二进制
0o17            // 15，八进制

/\u{1F600}/u    // u 标志：按码位处理，能正确匹配 emoji
/foo/y          // y 标志：粘性匹配，从 lastIndex 往后，不重新找
````

## 尾调用优化（proper tail calls）

函数最后一步是"直接返回另一个函数的调用"，引擎可以复用当前栈帧，于是递归写得再深也不爆栈。

````javascript
function factorial(n, acc = 1) {
  if (n <= 1) return acc
  return factorial(n - 1, n * acc)   // 最后一步就是调用 → 尾调用
}
````

对比一下，下面这个就不是：

````javascript
function factorial(n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)   // 调用完还得再乘一下 → 不是尾调用
}
````

⚠️ **这是 ES6 里最尴尬的特性**：规范写了，但 V8（Chrome / Node）和 SpiderMonkey（Firefox）都没实现，只有 Safari 的 JavaScriptCore 完整支持。所以现实中别指望它 —— 递归还是自己控制深度，或者改成循环。

## 相关资源

- [阮一峰 ES6 入门教程](https://es6.ruanyifeng.com/)
- [MDN: JavaScript 参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference)
- [ECMA-262 第 6 版（ES2015）](https://262.ecma-international.org/6.0/)
