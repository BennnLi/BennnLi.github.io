# ES9（ES2018）

ECMAScript 第 9 版 · 2018 年 6 月发布

## 版本速览
1. 异步迭代 for await ... of、异步迭代器、Symbol.asyncIterator
2. 对象 Rest/Spread，{ ...obj } 和 const { a, ...rest } = obj
3. 正则表达式增强，正则命名捕获组 `(?<name>...)`，正则后行断言，正则 s 标志（dotAll）匹配换行符
4. Promise.prototype.finally()
5. Unicode 属性转义
6. 模板字面量修订，放宽对非法转义序列的限制


## 异步迭代 Asynchronous Iteration
先来回顾一下什么是迭代器对象，迭代器接口

1. 迭代器对象 Iterator
   一个具有 next 属性且该属性为一个方法，方法的返回值为 { value: 1, done: false } 形式的对象称为迭代器对象。其中 value 表示本次迭代的值，done 为 true 表示迭代结束，done 为 false 表示迭代未结束
    ````javascript
    const obj = {
        next() {
            return { value: 1, done: true }
        }
    }
    ````
2. 迭代器接口：对象上的 [Symbol.iterator] 属性
   一个对象如果具有 [Symbol.iterator]() 方法并且该方法返回要给迭代器对象，那么该对象就是可迭代的

3. for ... of 执行流程
    - 调用 this[Symbol.iterator]() 获取该对象的迭代器
    - 对迭代器调用 next 方法获取本次迭代的 value，并且如果 done === false 则继续执行 next 否则结束
    ````javascript
    const arr = [1, 2, 3]
    for (const item of arr) {
        console.log(arr)
    }

    // 执行流程
    function forof(iterable) {
        const iter = iterable[Symbol.iterator]() // 获取 iterable 迭代器
        while (true) {
            const { value, done } = iter.next()
            console.log(value)
            if (done) break
        }
    }
    ````

现在再来看一下什么是异步迭代器 AsyncIterator ，异步迭代接口

1. 异步迭代器对象 AsyncIterator
   同迭代器对象 Iterator，但返回值变成 `Promise<{ value: 1, done: false }>`

2. 异步迭代器对象接口
   一个对象如果具有 [Symbol.asyncIterator] 方法且该方法返回一个异步迭代器对象，则该对象就是可异步迭代的

3. for await ... of 执行流程
    - 调用 this[Symbol.asyncIterator]() 获取异步迭代器对象，
    - 对迭代器调用 next 方法获取本次迭代的 Promise 对象并等待 Promise fulfilled 拿到 value 和 done，并且如果 done === false 则继续执行 next 否则结束
    ````javascript
    const arr = [
        new Promise((resolve) => 1),
        new Promise((resolve) => 2)
    ]
    for await (const item of arr) {
        console.log(item)
    }// 1, 2

    // 执行流程
    async function forawaitof(asyncIterable) {
        const asyncIter = asyncIterable[Symbol.asyncIterator]()
        while (true) {
            const { value, done } = await asyncIter.next()
            console.log(value)
            if (done) break
        }
    }
    ````

4. 实现 [Symbol.asyncIterator]() 让原本不可异步迭代的对象变成可异步迭代
````javascript
async function main() {
  const asyncIterable = {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        async next() {
          if (i < 3) {
            await new Promise(r => setTimeout(r, 100)); // 模拟异步
            return { value: i++, done: false };
          }
          return { value: undefined, done: true };
        }
      };
    }
  };

  for await (const value of asyncIterable) {
    console.log(value); // 0, 1, 2（每次间隔 100ms）
  }
}
main()
````

## 对象 Rest/Spread，{ ...obj } 和 const { a, ...rest } = obj
ECMAScript 2015 (ES6) 中的扩展运算符 ... 只支持 Array 和函数参数，ECMAScript 2018 (ES9) 扩展到了对象

1. Spread ...
````javascript
const base = { a: 1, b: 2 }
const extendBase = { ...base, c: 3 }
const override = { ...base, b: 3 } // b 会被最后的覆盖 { a: 1, b: 3 }
````

2. Rest ...
````javascript
const { a, ...rest } = { a: 1, b: 2, c: 3 }
console.log(a) // 1
console.log(rest) // { b: 2, c: 3 }
````

3. 常见用途
````javascript
// 浅拷贝
const base = { a: 1, b: 2 }
const copy = { ...base }

// 对象合并
const obj1 = { a: 1 }
const obj2 = { b: 2 }
const merged = { ...obj1, ...obj2 }

// 属性排除
const obj = { a: 1, b: 2, c: 3 }
const { a, ...noA } = obj
````

## 正则表达式增强

ES2018 给正则带来三个实用改进：命名捕获组、后行断言、`s` 标志。

### 1. 命名捕获组 `(?<name>...)`

以前只能按下标取捕获组，正则一改，下标就全乱了：

````javascript
// 以前：靠下标，可读性差、易错
const m = '2026-09-14'.match(/(\d{4})-(\d{2})-(\d{2})/)
m[1] // '2026'
m[2] // '09'
````

现在可以直接给捕获组取名：

````javascript
const m = '2026-09-14'.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/)

m.groups.year  // '2026'
m.groups.month // '09'
m.groups.day   // '14'
````

几个要点：

- 匹配结果上多了一个 `groups` 属性（普通对象，原型是 `null`）
- 没参与匹配的组，`groups.xxx` 是 `undefined`
- 命名组**同时**也在数字下标里，`m[1]` 依然可用
- 替换字符串里可以用 `$<name>` 引用：

````javascript
'2026-09-14'.replace(
  /(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})/,
  '$<d>/$<m>/$<y>'
)
// '14/09/2026'
````

- 正则内部可以用 `\k<name>` 反向引用：

````javascript
/(?<quote>['"]).*?\k<quote>/.test('"hello"') // true
````

### 2. 后行断言 `(?<=...)` / `(?<!...)`

先行断言（lookahead）很早就有，ES2018 补上了**后行断言**（lookbehind，往前看）：

| 语法 | 名称 | 含义 |
|------|------|------|
| `(?=...)` | 肯定先行断言 | 后面**是**… |
| `(?!...)` | 否定先行断言 | 后面**不是**… |
| `(?<=...)` | 肯定后行断言 | 前面**是**… ← ES2018 新增 |
| `(?<!...)` | 否定后行断言 | 前面**不是**… ← ES2018 新增 |

后行断言的特点是：**它只负责"看"，不消费字符**，所以匹配结果里不包含它。

````javascript
// 提取 $ 后面的金额，但不把 $ 算进结果
'价格 $199'.match(/(?<=\$)\d+/)   // ['199']

// 只替换「前面不是减号」的数字，避免动到负数
'10 -20 30'.replace(/(?<!-)\b\d+/g, 'X')   // 'X -20 X'
````

实际用途：

````javascript
// 千分位分隔（先行断言的经典用法）
'1234567'.replace(/\B(?=(\d{3})+$)/g, ',')   // '1,234,567'

// 取小数点后两位之后的数字
'3.14159'.match(/(?<=\.\d{2})\d+/)           // ['159']
````

> **兼容性提醒**：后行断言在浏览器里落地最晚 —— Firefox 到 **78**、Safari 到 **16.4** 才支持。Safari 16.4 之前直接用会抛 `SyntaxError: Invalid regular expression`（连 `test()` 都执行不到），如果还要兼容老 Safari，使用前务必确认，或改用先行断言 / 字符串方法绕开。

### 3. `s` 标志（dotAll）

默认情况下，正则里的 `.` **不匹配换行符**（`\n`、`\r`、`\u2028`、`\u2029` 都不行）：

````javascript
/foo.bar/.test('foo\nbar')    // false
/foo.bar/s.test('foo\nbar')   // true ← 加上 s
````

以前想匹配"任意字符（含换行）"，只能写 `[\s\S]` 这种绕的写法，现在加个 `s` 就够了：

````javascript
// 以前
/foo[\s\S]bar/.test('foo\nbar')   // true

// 现在
/foo.bar/s.test('foo\nbar')       // true
````

注意：`s` **只影响 `.`**，不影响 `^` / `$` —— 那两个由 `m`（multiline）标志控制。

### 4. Unicode 属性转义 `\p{...}`

以前判断"是不是中文"，只能硬编码码点区间；现在可以直接用 **Unicode 属性**：

````javascript
/\p{Letter}/u.test('中')     // true
/\p{Letter}/u.test('A')      // true
/\p{Number}/u.test('٣')      // true（阿拉伯数字）
/\p{Emoji}/u.test('😀')      // true
````

> **关键：必须加 `u` 标志。** 不加 `u` 时 `\p` 会被当成普通的字符转义，语义完全不同：
>
> ```javascript
> /\p{Letter}/.test('p')   // true —— 因为这里的 \p 被解释成了字母 "p"
> ```

语法有两种形式：

| 写法 | 说明 | 例子 |
|------|------|------|
| `\p{属性}` | 二元属性 / 通用类别 | `\p{Letter}`、`\p{Emoji}` |
| `\p{属性=值}` | 属性 + 取值 | `\p{Script=Han}`、`\p{General_Category=Letter}` |

常用简写（长短名完全等价）：

| 全名 | 简写 |
|------|------|
| `\p{Letter}` | `\p{L}` |
| `\p{Number}` | `\p{N}` |
| `\p{Script=Latin}` | `\p{sc=Latn}` |
| `\p{Script=Han}` | `\p{sc=Han}` |

取反用大写 `\P`：

````javascript
/\P{Letter}/u.test('A')   // false
/\P{Letter}/u.test('1')   // true
````

实际用途：

````javascript
// 只保留汉字
'abc中文123'.replace(/\P{Script=Han}/gu, '')   // '中文'

// 检测是否含 emoji
/\p{Emoji}/u.test('hello 😀')                  // true

// 按单字切分中文
'中文测试'.match(/\p{Script=Han}/gu)           // ['中', '文', '测', '试']

// 去掉所有空白（含全角空格）
' a\u3000b '.replace(/\p{White_Space}/gu, '')   // 'ab'
````

> **坑点**：`\p{Emoji}` 会匹配 `0`-`9`、`#`、`*` 这些"带 emoji 属性"的字符。要严格匹配真正的图形 emoji，应改用 `\p{Extended_Pictographic}`。

## Promise.prototype.finally()

`try / catch / finally` 里的 `finally` 表示"无论成功失败都执行"，Promise 现在也有了对应的 `.finally()`：

````javascript
fetchData()
  .then(res => render(res))
  .catch(err => showError(err))
  .finally(() => hideLoading())   // 成功、失败都会执行
````

三个特点：

**① 回调不接收任何参数** —— 拿不到成功值，也拿不到失败原因。设计意图就是"只做清理，不该关心结果"：

````javascript
Promise.resolve(1).finally((...args) => {
  console.log(args)   // [] —— 一个参数都没有
})
````

**② 会原样传递结果** —— `.finally()` 返回新的 Promise，值 / 原因继续往下传：

````javascript
Promise.resolve(1)
  .finally(() => {})
  .then(v => console.log(v))          // 1

Promise.reject(new Error('x'))
  .finally(() => {})
  .catch(e => console.log(e.message)) // 'x'
````

**③ 但有三种情况会"顶替"或延迟原结果**：

- 回调里**抛错** → 新 Promise 以该错误 reject
- 回调里**返回 rejected Promise** → 同样 reject
- 回调里**返回 pending Promise** → 结果传递被**延迟**到它 settle：

````javascript
Promise.resolve(1)
  .finally(() => new Promise(r => setTimeout(r, 1000)))
  .then(v => console.log(v, '—— 1 秒后才打印'))
````

**等价写法**：

````javascript
p.finally(fn)
// 约等于
p.then(
  v => { fn(); return v },
  e => { fn(); throw e }
)
````

细微差别：`.finally()` 会把回调的返回值包进 `Promise.resolve()` 再处理，所以回调返回 Promise 时行为更可预期。日常直接用 `.finally()` 即可。

**和 async 函数里的 finally 是同一套思路**：

````javascript
async function withLoading(task) {
  showLoading()
  try {
    return await task()
  } finally {
    hideLoading()   // 无论成功、失败、提前 return 都会执行
  }
}
````

## 模板字面量修订（Template Literal Revision）

### 模板字符串的工作原理
模板字符串的替换流程基本上就是计算和拼接的流程
1. 计算模板值，
   - 如果模板值是字符串，则使用该字符串
   - 如果模板值为 `null` 则转换成 `'null'`，为 `undefined` 则转换成 `'undefined'`，
   - 如果模板值为 `number` 则转成 `'number'`，如 42 -> '42'
   - 如果模板值为 `boolean` 则 true -> 'true', false -> 'false'
   - 如果模板值为 `object` 则走 `Object.prototype.toString`, 如是一个数组则走 `Array.prototype.toString`...
2. 进行拼接，生成最终字符串
````javascript
const value = 'apple'

/**
 * 1. 计算模板值 value = 'apple'，如果 value 不是一个字符串则会调用 toString 函数转换成字符串
 * 2. 拼接字符串 'value is ' + 'apple'
 */
const templateStr = `value is: ${value}` // 'values is apple'

const obj = { value: 'apple' }
const templateStr2 = `value is ${obj}` // 'value is [object Object]', 因为 obj 不是字符串所以会自动调用 obj.toString 转换成 [object Object]
````

但我们可以自定义模板解析的规则，看下面的例子
````javascript
const tag = (fragments, ...values) => {
    console.log('fragments:', fragments)
    console.log('values:', values)
}
const tagName = 'Fruit'
const value = 'apple'
tag`[${tagName}] value is ${value}`

// 输出结果
// fragments: ["[", "] value is ", ""]
// values: ["Fruit", "apple"]
````
**tag\`xxx\`** 可以看成是一次对 `tag` 函数的调用，js 引擎会将模板字符串的片段和模板值整理成指定的参数形式传递给函数，于是我们可以在函数中自定义拼接规则

### String.raw
模板字符串中使用了**转义序列**，例如 \n(换行)、\t(制表符)、\u4E2D(Unicode字符)等。在正常情况下会被**解析成对应的字符**
````javascript
const s = `a\nb`;
console.log(s);        // 输出两行：a 和 b
console.log(s.length); // 3（a、换行、b）
````

当把 String.raw 作为标签放在模板字符串的前面时，它返回的字符串中**转义序列会保持原样，不会被解析**
````javascript
const s = String.raw`a\nb`;
console.log(s);        // 输出字面量：a\nb（反斜杠和 n 两个字符）
console.log(s.length); // 4（a、\、n、b）
````

`String.raw` 是一个 JS 引擎内置的标签函数, 这个函数通过自定义了模板字符串的拼接规则将**转义序列保持原样**，生成最终的拼接字符串
`String.raw` 的日常用途 —— 写 Windows 路径时不用再写双反斜杠：

````javascript
const p1 = 'C:\\develop\\css'           // 传统写法，容易漏
const p2 = String.raw`C:\develop\css`   // 所见即所得
p1 === p2   // true
````

**实际意义**：主要服务于**工具 / DSL 作者**。日常业务代码很少碰到

## 注意事项

1. `for await ... of` 用于**异步可迭代对象**（有 `[Symbol.asyncIterator]`）；普通数组和同步可迭代对象也可以，会被自动包装
2. 对象 Rest/Spread 是**浅拷贝**，嵌套对象仍然共享引用
3. 对象 Rest 只能放在**最后**：`const { ...rest, a } = obj` 是语法错误
4. 命名捕获组的 `groups` 对象原型是 `null`，不能直接调用 `hasOwnProperty`
5. 后行断言落地最晚（Safari 16.4、Firefox 78），兼容老浏览器时要特别留意
6. Unicode 属性转义**必须带 `u` 标志**，否则 `\p` 会被当成普通字符
7. `Promise.prototype.finally()` 的回调**不接收参数**，无法在里面区分成功与失败
8. 模板字面量修订只放宽**标签模板**，未带标签的模板仍然严格报错

## 相关资源

- [MDN: for await...of](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for-await...of)
- [MDN: 对象展开语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [MDN: 正则表达式 - 断言](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions/Assertions)
- [MDN: 正则表达式 - 组与反向引用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions/Groups_and_backreferences)
- [MDN: Unicode 字符类转义](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape)
- [MDN: Promise.prototype.finally()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)
- [ECMA-262 第 9 版（ES2018）](https://262.ecma-international.org/9.0/index.html)