# ES8（ES2017）

> [Ecma International - ECMAScript 2017 Language Specification](https://262.ecma-international.org/8.0/index.html)

ECMAScript 第 8 版 · 2017 年 6 月发布

## 版本速览

1. `async / await`
2. `Object.values()` / `Object.entries()` / `Object.getOwnPropertyDescriptors()`
3. `String.prototype.padStart()` / `padEnd()`
4. `SharedArrayBuffer` 与 `Atomics`
5. 函数参数与调用中的尾逗号

---

## async / await

### 1. async function

async function 声明了一个 AsyncFunction 异步函数对象，每次调用异步函数时，都会返回一个新的 Promise 对象，并将 Promise 对象的 resolve 值作为异步函数的返回值，或者将 Promise 对象的 reject 值作为未捕获的异常抛出。

```javascript
// 当异步函数直接返回一个值时，那么它将会被隐式的包装到一个 promise 中
async function foo() {
    return 1
}

// foo 等同于
function fooPromiseFun() {
    return new Promise((resolve) => {
        resolve(1)
    })
}

const fooPromise = foo() // Promise<number>
fooPromise.then(result => console.log(result)) // 1
```

四种返回形态，对应四种 Promise 结果：

```javascript
async function a() { return 1 }                    // fulfilled：1
async function b() { return Promise.resolve(2) }   // fulfilled：2（自动展开）
async function c() { throw new Error('boom') }     // rejected：Error
async function d() { }                             // fulfilled：undefined
```

> `return somePromise` 时，外层 Promise 会**跟随**内层 —— 这叫 Promise 展开（resolve thenable / unwrapping）。所以这里**不需要**写 `return await somePromise`。

`async` 函数的本质是 AsyncFunction 对象：

```javascript
Object.getPrototypeOf(async function () {}).constructor === AsyncFunction // true
```

### 2. await 表达式

`await` 可以理解为：**「把右边的值变成一个 Promise，然后暂停当前 async 函数，等它 settle 之后再继续」**。

```javascript
const value = await expr
```

它的语义分三步：

1. 把 `expr` 交给 `Promise.resolve()` —— 所以 **`await` 右边不一定是 Promise**
2. 如果结果还没 settle，就**暂停当前 async 函数**，把控制权交回调用者（**不阻塞主线程**）
3. settle 之后：fulfilled → `await` 的值就是它；rejected → 在 `await` 处**抛出异常**

正因为第 1 步，`await` 一个普通值也是合法的：

```javascript
async function f() {
  const n = await 42       // 42
  const s = await 'hello'  // 'hello'
  const o = await { a: 1 } // { a: 1 }
}
```

注意：**即使右边是普通值，`await` 之后的代码依然是异步执行的**（进入微任务队列）

### 3. 执行顺序：await 之后一定是异步

```javascript
async function f() {
  console.log(1)
  await null          // 即使 await 的是 null，也会让出
  console.log(3)
}

f()
console.log(2)

// 输出：1 → 2 → 3
```

原因：`f()` 被调用时，函数体**同步执行到第一个 `await`**，然后把后续代码排进微任务队列并返回 Promise；所以 `console.log(2)` 先执行，`console.log(3)` 最后执行。

也就是说：**`async` 函数不是"立刻异步"，而是"同步执行到第一个 `await` 才开始异步"**。

### 4. 错误处理

`await` 一个 rejected 的 Promise，等价于在该处 `throw`，所以用普通的 `try / catch` 就够了：

```javascript
async function load() {
  try {
    const data = await fetch('/api').then(r => r.json())
    return data
  } catch (err) {
    console.error('加载失败', err)
    return null
  } finally {
    hideLoading()   // 无论成功失败都执行
  }
}
```

被 `catch` 捕获的异常有两种来源：

1. `await` 的 Promise 被 reject
2. 函数体内同步抛出的错误（包括 `await` 之后的代码）

**如果都没有被捕获**，async 函数返回的 Promise 会变成 rejected；再没有任何 `.catch()`，就会触发全局的 `unhandledrejection`：

```javascript
window.addEventListener('unhandledrejection', (e) => {
  console.error('未处理的 Promise 拒绝：', e.reason)
  e.preventDefault()   // 阻止默认的控制台报错
})
```

### 5. 并发 vs 串行

`await` 是"一个一个等"，**写在一条线上就是串行**：

```javascript
// 总耗时 = 1 + 1 + 1 = 3 秒，一个接着一个执行
const a = await fetchA()
const b = await fetchB()
const c = await fetchC()
```

三者互不依赖时，应该**先全部发起、再一起等**：

```javascript
// 总耗时 ≈ 1 秒
const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()])
```

关键区别：`Promise.all([...])` 里的三个函数调用是**先同时执行**（当场拿到三个 pending 的 Promise），然后才一起 `await`；而上面那种写法，`fetchB()` 要等 `fetchA()` 完成才会被调用。

循环里同理：

```javascript
// 逐一执行
for (const id of ids) {
  await load(id)
}

// 并发
await Promise.all(ids.map(id => load(id)))
```

### 注意事项

1. `async` 函数**总是**返回 Promise，即使函数体里一个 `await` 都没有
2. `async` 函数"同步执行到第一个 `await`"，之后才异步
3. `await` 右侧非 Promise 会被自动包装，但**之后的代码仍是异步的**
4. 一条线上连续 `await` = 串行；互不依赖的请求用 `Promise.all` 并发
5. `forEach` / `map` 回调里的 `await` 不会被外层等待 —— 用 `for...of` 或 `Promise.all`
6. `try` 块里要写 `return await` 才能捕获；不在 `try` 里时 `return` 更直接
7. `await` 只能在 `async` 函数内使用（顶层 await 属于 ES2022）
8. 未捕获的拒绝会触发 `unhandledrejection`，建议全局兜底监听

### 相关资源

- [MDN: async function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)
- [MDN: 使用 Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)
- [ECMA-262 第 8 版（ES2017）](https://262.ecma-international.org/8.0/index.html)

---
<!--
## 在线示例

<Demo src="/demos/javascript/es8/01-async-returns-promise.html" title="async 的四种返回形态 — 都返回 Promise" height="400px" />

<Demo src="/demos/javascript/es8/02-await-basics.html" title="await 基础 — 右边不必是 Promise" height="400px" />

<Demo src="/demos/javascript/es8/03-execution-order.html" title="执行顺序 — 为什么是 1 → 2 → 3" height="440px" />

<Demo src="/demos/javascript/es8/04-error-handling.html" title="错误处理 — try/catch 与 unhandledrejection" height="440px" />

<Demo src="/demos/javascript/es8/05-serial-vs-parallel.html" title="串行 vs 并发 — 计时对比（最关键）" height="480px" />

<Demo src="/demos/javascript/es8/06-pitfalls.html" title="四个高频陷阱 — 忘写 await / forEach / return await" height="500px" /> -->



## Object 新增对象方法

### Object.values() / Object.entries()
ECMAScript 2016(ES6) 支持了 Object.keys()，Object.values() 和 Object.entries() 对对象遍历的进一步补充

````javascript
const obj = {
    name: 'lee',
    age: 15
}
const values = Object.values(obj) // ['lee', 15]
const entries = Object.entries(obj) // [['name', 'lee'], ['age', 15]]
````

### Object.getOwnPropertyDescriptors()
用于获取对象所有自有属性的完整描述符

#### 对象属性描述符
在 JavaScript 中，属性描述符是一个用来描述对象的某个属性的行为特征的对象，它决定了该属性是否可以被修改，删除，枚举，已经它的值从何而来

对象的属性分为两类，它们的描述法字段不同

1. 数据属性：直接存储一个值，描述符包含

| 字段 | 默认值 | 说明 |
| ---- | ----- | ---- |
| value | undefined |  属性值 |
| writable | false | 能否被赋值运算符修改 |
| enumerable | false | 能否被 for...in、Object.keys() 等枚举 |
| configurable | false | 能否删除、修改 |

2. 访问器属性：不直接存储值，而是通过 getter/setter 读写

| 字段 | 默认值 | 说明 |
| ---- | ----- | ---- |
| get | undefined | 获取属性值调用 |
| set | undefined | 写入时调用 |
| enumerable | false | 能否被 for...in、Object.keys() 等枚举 |
| configurable | false | 能否删除、修改 |

> 一个属性不能既是`数据属性`又是`访问器属性`

1. 当我们创建一个对象时

````javascript
const obj = { age: 1 }
const descriptor = Object.getOwnPropertyDescriptor(obj, 'age') // { value: 1, writable: true, enumerable: true, configurable: true }
````

age 的属性描述法如下

| 字段 | 默认值 | 说明 |
| ---- | ----- | ---- |
| value | 1 |  属性值 |
| writable | true | 能否被赋值运算符修改 |
| enumerable | true | 能否被 for...in、Object.keys() 等枚举 |
| configurable | true | 能否删除、修改 |

### 获取指定属性的操作符 Object.getOwnPropertyDescriptors()

语法
````javascript
Object.getOwnPropertyDescriptors(object) // 获取对象的所有属性操作符
Object.getOwnPropertyDescriptors(object, key) // 获取指定属性key的属性操作符
````

````javascript
const obj = { age: 1 }
const descriptor = Object.getOwnPropertyDescriptor(obj, 'age') // { value: 1, writable: true, enumerable: true, configurable: true }
````

### 新建/修改属性时自定义属性操作符
使用 Object.defineProperty 在为对象新增一个属性时指定属性操作符

````javascript
const obj = {};

Object.defineProperty(obj, 'id', {
  value: 100,
  writable: false,      // 只读
  enumerable: false,    // 不可枚举
  configurable: false   // 不可配置
});

obj.id = 200;              // 静默失败（严格模式报错）
console.log(obj.id);       // 100
console.log(Object.keys(obj)); // [] —— 枚举不到
delete obj.id;             // 删除失败
````


## String.prototype.padStart() / padEnd()
用于往字符串的开头和末尾填充字符，直到达到指定的长度

基本语法
````javascript
str.padStart(length: number, padString?: string) // 向开头填补指定字符串直到 str 长度达到 length
str.padEnd(length: number, padString?: string) // 向末尾填补指定字符串直到 str 长度达到 length
````

> padString 不传时默认填充空格符

示例
````javascript
'abc'.padStart(6);        // '   abc'  （默认空格）
'abc'.padEnd(6);          // 'abc   '

'abc'.padStart(6, '*');   // '***abc'
'abc'.padEnd(6, '*');     // 'abc***'

'abc'.padStart(6, '123'); // '123abc'
'abc'.padEnd(6, '123');   // 'abc123'
````

几个关键行为
1. 目标长度 ≤ 原长度 → 原样返回
````javascript
'hello'.padStart(3, '*');  // 'hello'
'hello'.padEnd(3, '*');    // 'hello'
'hello'.padStart(5, '*');  // 'hello'
````

2. 填充字符串会被重复直到够长
````javascript
'5'.padStart(4, 'ab');   // 'aba5'（ab 重复，截断到刚好填满）
'5'.padEnd(4, 'abc');    // '5abc'
'x'.padStart(5, '123');  // '1231x'
````

3. 未传第二参数时，默认使用空格填充
````javascript
'hello'.padStart(10) // '     hello'
'hello'.padEnd(10) // 'hello     '
````



## SharedArrayBuffer 与 Atomics

普通 `ArrayBuffer` 归一个线程，`SharedArrayBuffer` 能被多个 Worker 同时访问 —— 真正的共享内存。

````javascript
const sab = new SharedArrayBuffer(4)
const view = new Int32Array(sab)

// Worker 里改 view[0]，主线程立刻能看到
````

共享就会抢，所以配了 `Atomics` 做原子操作：

````javascript
Atomics.add(view, 0, 1)      // 原子加
Atomics.load(view, 0)        // 原子读
Atomics.store(view, 0, 10)   // 原子写
Atomics.wait(view, 0, 0)     // 阻塞等，只能在工作线程用
Atomics.notify(view, 0, 1)   // 唤醒
````

⚠️ 日常业务基本碰不到，但两个坑得知道：

- 因为 Spectre 漏洞，浏览器一度把它禁掉。现在要开**跨源隔离**（`Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp` 两个响应头）才能用
- 同步原语写错就是死锁和竞态，没充分理由别碰

## 函数参数与调用中的尾逗号

就是最后一项后面也允许带逗号。

````javascript
function f(a, b,) { }      // 定义时
f(1, 2,)                   // 调用时
new C(1,)                  // new 也行

const arr = [1, 2, 3,]     // 数组一直都可以
const obj = { a: 1, }      // 对象也是
````

好处是加参数时 diff 只有新增那一行：

````diff
 function f(
   a,
   b,
+  c,
 ) {}
````

但**参数列表**里，剩余参数后面不能带：

````javascript
function f(...args,) { }     // SyntaxError: Rest parameter must be last formal parameter
(a, ...rest,) => { }         // 同上
````

调用时反而允许：

````javascript
f(...args,)        // OK
f(a, ...rest,)     // OK
````
