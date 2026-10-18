# ES7（ES2016）

ECMAScript 第 7 版 · 2016 年 6 月发布

> ES2016 是**史上最小的一个版本**，只增加了两个特性

---

## 版本速览

| 特性 | 类型 | 一句话说明 |
|------|------|-----------|
| `Array.prototype.includes` | 新增方法 | 判断数组是否包含某个值，能正确识别 `NaN` |
| 幂运算符 `**` / `**=` | 新增运算符 | 求幂，书写上替代 `Math.pow()` |

---

## 一、Array.prototype.includes

### 作用


如果在传入的值在当前数组中（`this`）则返回 `true`，否则返回 `false`。

### 语法

```js
arr.includes(searchElement)
arr.includes(searchElement, fromIndex)
```

| 参数 | 说明 |
|------|------|
| `searchElement` | 要查找的值 |
| `fromIndex` | 从哪个下标开始找（可选，默认 `0`；负数表示从末尾倒数） |

### 基础用法

```js
const array = [1, 2, '3', false]
array.includes(1)     // true
array.includes(false) // true
array.includes(100)   // false
```

### 与 indexOf 的三个关键区别

| 对比项 | `indexOf` | `includes` |
|--------|-----------|-----------|
| **能否找到 `NaN`** | ❌ 不能 | ✅ 能 |
| 返回值 | 下标 / `-1` | 布尔值 |

`indexOf` 内部用**严格相等**（`===`）比较，而 `NaN === NaN` 是 `false`，所以永远找不到 `NaN`。
`includes` 改用 **SameValueZero** 算法，把 `NaN` 视为等于自身：

```js
[NaN].indexOf(NaN)   // -1, 因为 indexOf 使用严格相等，NaN === NaN // false
[NaN].includes(NaN)  // true
```

### SameValueZero 算法
SameValueZero 算法是 ECMAScript 内置的算法，用来定义“两个值算不算同一个值”的问题。它本身不会被 JavaScript 直接暴露出来，所以我们没办法直接调用，但 Map, Set, Array.prototype.includes 都是基于该算法来判断值是否相等

算法规定
1. 如果 typeof x !== typeof y，则返回 false（不同类型永远不相等）
2. 如果 x，y 都是 Number/BigInt
    - 都是 NaN，返回 true
    - +0 和 -0 视为相等，返回 true
    - x === y，数值本身相等，返回 true
    - 否则 返回 false
3. String/Boolean/Symbol/null/undefined/Object，按"同一个值/同一个引用"比较 → 相同则 true，否则 false

### fromIndex 参数

```js
const arr = ['a', 'b', 'c', 'b']

arr.includes('b')     // true   从头开始找
arr.includes('b', 2)  // true   从下标 2 开始，命中下标 3 的 'b'
arr.includes('a', 1)  // false  跳过了下标 0 的 'a'
arr.includes('b', -1) // true   从倒数第 1 个（下标 3）开始
```

### 实际运用

#### 1. 简化多条件 if 判断

```js
const randomInt = Math.ceil(Math.random() * 100)

// 以前：一长串 ||
if (randomInt === 20 || randomInt === 40) {
  // do something
}

// 现在：一眼看懂「命中白名单之一」
if ([20, 40].includes(randomInt)) {
  // do something
}
```

#### 2. 权限 / 角色判断

```js
const ADMIN_ROLES = ['owner', 'admin']

if (ADMIN_ROLES.includes(user.role)) {
  showAdminPanel()
}
```

#### 3. 简易去重

```js
const seen = []
for (const id of ids) {
  if (!seen.includes(id)) seen.push(id)
}
```

### ⚠️ 注意：includes 只做「值比较」

它判断的是**数组里有没有这个值**，不是"有没有满足条件的元素"。所以它**不能替代 `some()`**：

```js
// ❌ 错的：这里把箭头函数本身当成一个"要查找的值"
[1, 20, 30].includes(x => x > 10)  // false

// ✅ 想按条件找，用 some()
[1, 20, 30].some(x => x > 10)      // true
```

同理，找**元素**用 `find()`，找**下标**用 `findIndex()`。

---

## 二、幂运算符 **

### 作用

求幂。`a ** b` 就是 `a` 的 `b` 次方，等价于 `Math.pow(a, b)`。

### 语法

```js
base ** exponent     // 求幂
base **= exponent    // 复合赋值
```

### 优先级
** > * > +

### 与 Math.pow 的对比

```js
// 以前
Math.pow(2, 10)  // 1024

// 现在
2 ** 10          // 1024
```

好处不只是"短"：

- 可以**自然地参与表达式**，不用嵌套函数调用
- 支持复合赋值 `**=`
- 结合 `Math.PI` 等写公式时更接近数学写法

```js
let n = 2
n **= 10                                  // n = 1024

const circleArea = (r) => Math.PI * r ** 2   // 比 Math.pow 更接近 πr²
```

### 特性一：右结合（从右往左算）

这是最容易踩的一个坑：

```js
2 ** 3 ** 2
// = 2 ** (3 ** 2)
// = 2 ** 9
// = 512      ← 不是 (2 ** 3) ** 2 = 64
```

要左结合必须显式加括号：

```js
(2 ** 3) ** 2  // 64
```

### 特性二：左侧不能直接跟一元运算符

```js
-2 ** 2     // ❌ SyntaxError
-(2 ** 2)   // ✅ -4
(-2) ** 2   // ✅ 4
```

原因：`**` 的优先级高于一元负号，`-2 ** 2` 到底是 `-(2**2)` 还是 `(-2)**2` 存在歧义。规范直接**禁止**这种写法，强制你加括号明确意图。这也是它和 `Math.pow` 的一个差异点：

```js
Math.pow(-2, 2)  // 4   （能直接写）
(-2) ** 2        // 4   （必须加括号）
```

### 实际运用

```js
// 几何：圆面积、球体积
const circleArea = (r) => Math.PI * r ** 2
const sphereVolume = (r) => (4 / 3) * Math.PI * r ** 3

// 金融：复利终值
const compound = (principal, rate, years) => principal * (1 + rate) ** years

// 算法：判断是否为 2 的幂
const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0

// 单位换算：KB → GB
const kbToGb = (kb) => kb / 1024 ** 2
```

---

## 浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Node.js |
|------|--------|---------|--------|---------|
| `Array.prototype.includes` | 47 | 43 | 9 | 6 |
| `**` / `**=` | 52 | 52 | 10.1 | 7 |

两者都已 **Baseline 广泛可用**，可以直接写，不需要 polyfill 或转译（除非要兼容很老的环境）。

---

## 注意事项

1. `includes` 用 SameValueZero 比较：能找 `NaN`，`+0` 与 `-0` 视为相等
2. `**` 是**右结合**：`2 ** 3 ** 2 === 512`
3. `**` 左边不能直接跟一元运算符，必须加括号
4. `**` 与 `Math.pow` 的数值行为一致，可以放心互换

---

## 相关资源

- [MDN: Array.prototype.includes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
- [MDN: 幂运算符（**）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Exponentiation)
- [ECMA-262 第 7 版（ES2016）](https://262.ecma-international.org/7.0/)
- [TC39 提案流程](https://zhouweicsu.github.io/blog/2015/12/04/tc39-process/)

---

## 在线示例

<Demo src="/demos/javascript/es7/01-includes-basic.html" title="includes 基础用法 — 包含判断 + fromIndex" height="380px" />

<Demo src="/demos/javascript/es7/02-includes-vs-indexof.html" title="includes vs indexOf — 重点看 NaN" height="400px" />

<Demo src="/demos/javascript/es7/03-includes-practical.html" title="includes 实际运用 — 多条件判断 / 白名单 / 去重" height="440px" />

<Demo src="/demos/javascript/es7/04-exponentiation-basic.html" title="幂运算符基础 — ** 与 Math.pow 对比" height="360px" />

<Demo src="/demos/javascript/es7/05-exponentiation-gotchas.html" title="幂运算符的坑 — 右结合性 / 一元运算符 / **=" height="440px" />

<Demo src="/demos/javascript/es7/06-exponentiation-practical.html" title="幂运算符实际运用 — 几何 / 复利 / 单位换算" height="400px" />
