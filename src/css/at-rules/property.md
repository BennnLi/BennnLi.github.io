# @property

> CSS Properties and Values API（Houdini 的一部分）
>
> MDN: https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/At-rules/@property
>
> 浏览器支持：Chrome 85+, Edge 85+, Safari 15.4+, Firefox 128+

---

## 概述

`@property` 是 CSS 的 at-rule，用于**显式注册自定义属性**（CSS 变量），为其指定类型、初始值和继承行为。

```css
@property --my-color {
  syntax: '<color>';
  inherits: false;
  initial-value: #3498db;
}
```

### 为什么需要 @property？

普通的 CSS 自定义属性（`--name: value`）对浏览器来说只是**字符串**，这带来两个问题：

| 问题 | 无 @property | 有 @property |
|------|-------------|-------------|
| **动画/过渡** | ❌ 无法插值，瞬间跳变 | ✅ 浏览器知道类型，平滑动画 |
| **类型安全** | ❌ 任何值都接受，错误静默 | ✅ 无效值被拒绝，回退到初始值 |

```css
/* ❌ 无 @property：动画不生效 */
--color: red;
animation: fade 2s infinite;
@keyframes fade { to { --color: blue; } }

/* ✅ 有 @property：平滑过渡 */
@property --color {
  syntax: '<color>';
  inherits: false;
  initial-value: red;
}
```

---

## 语法

### 完整语法

```
@property <custom-property-name> {
  syntax: '<type>' | '<type> | <type> | ...';
  inherits: true | false;
  initial-value: <value>;
}
```

### 描述符详解

#### `syntax`
> MDN: https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Values/Data_types

指定属性值的**类型约束**。支持的类型字符串：

| 类型 | 说明 | 示例值 |
|------|------|--------|
| `<length>` | 长度 | `10px`, `2em`, `5rem` |
| `<number>` | 数字（含小数） | `1.5`, `-3`, `0` |
| `<percentage>` | 百分比 | `50%`, `100%` |
| `<length-percentage>` | 长度或百分比 | `10px`, `50%` |
| `<color>` | 颜色 | `#ff0000`, `rgb(0,0,255)`, `hsl(0,100%,50%)` |
| `<image>` | 图片 | `url(...)`, `linear-gradient(...)` |
| `<url>` | URL | `url(image.png)` |
| `<integer>` | 整数 | `42`, `-10` |
| `<angle>` | 角度 | `45deg`, `1.5rad`, `1turn` |
| `<time>` | 时间 | `1s`, `500ms` |
| `<resolution>` | 分辨率 | `2dppx` |
| `<transform-function>` | 变换函数 | `rotate(45deg)`, `scale(1.5)` |
| `<transform-list>` | 变换列表 | `rotate(45deg) scale(1.5)` |
| `<custom-ident>` | 自定义标识符 | `foo`, `my-value` |
| `*` | 任意值（无类型检查） | 任何有效 CSS 值 |

**多类型组合**：使用 `|` 分隔：

```css
@property --my-prop {
  syntax: '<length> | <percentage> | auto';
  inherits: false;
  initial-value: 100px;
}
```

**语法行为规则**：

- `+` 表示允许空格分隔的多个值：`'<color>+'` 接受 `red blue green`
- `#` 表示允许逗号分隔的多个值：`'<length>#'` 接受 `10px, 20px, 30px`

#### `inherits`

控制属性是否从父元素继承：

- `true` — 子元素自动获取父元素的计算值
- `false` — 子元素未被显式设置的属性使用 `initial-value`

```css
@property --theme-color {
  syntax: '<color>';
  inherits: true;   /* 子元素自动继承父级设置的值 */
  initial-value: black;
}
```

#### `initial-value`

属性的默认值。必须与 `syntax` 声明的类型匹配，否则整个规则无效。

```css
@property --count {
  syntax: '<integer>';
  inherits: false;
  initial-value: 0;  /* 必须是整数，0.5 会报错 */
}
```

---

## 核心能力

### 1. 让自定义属性支持动画和过渡

这是 `@property` 最重要的能力。没有它，CSS 自定义属性被视为字符串，浏览器无法插值。

```css
@property --bg-color {
  syntax: '<color>';
  inherits: false;
  initial-value: #3498db;
}

.box {
  --bg-color: #3498db;
  background: var(--bg-color);
  transition: --bg-color 0.3s ease;  /* ✅ 丝滑过渡 */
}

.box:hover {
  --bg-color: #e74c3c;
}
```

### 2. 实现纯 CSS 计数器动画

使用 `syntax: '<integer>'` 配合 `counter-reset`，实现数字滚动效果：

```css
@property --count {
  syntax: '<integer>';
  inherits: false;
  initial-value: 0;
}

.counter::after {
  counter-reset: num var(--count);
  content: counter(num);
}

.counter {
  animation: count-up 2s ease-out forwards;
}

@keyframes count-up {
  from { --count: 0; }
  to   { --count: 9999; }
}
```

### 3. 渐变参数动画

传统 CSS 无法动画化渐变的角度或颜色停靠点，`@property` 解决了这个限制：

```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.gradient-box {
  background: linear-gradient(
    var(--gradient-angle),
    #ff6b6b, #4ecdc4
  );
  animation: spin 3s linear infinite;
}

@keyframes spin {
  to { --gradient-angle: 360deg; }
}
```

### 4. 类型安全与回退

当赋给自定义属性的值与 `syntax` 不匹配时，该赋值被忽略，属性回退到 `initial-value`：

```css
@property --my-color {
  syntax: '<color>';
  inherits: false;
  initial-value: #3498db;  /* 回退值 */
}

.box {
  --my-color: 42px;  /* ❌ 无效，不是 <color> */
  background: var(--my-color);  /* 回退到 #3498db */
}
```

### 5. 继承控制

```css
@property --accent {
  syntax: '<color>';
  inherits: true;
  initial-value: #ccc;
}

.container {
  --accent: #e74c3c;  /* 设置父级 */
}

.container .child {
  /* 未设置 --accent，自动继承 #e74c3c */
  background: var(--accent);
}
```

---

## JS 等效写法：CSS.registerProperty

`@property` 的等效 JavaScript API：

```js
CSS.registerProperty({
  name: '--my-color',
  syntax: '<color>',
  inherits: false,
  initialValue: '#3498db',
});
```

| @property | CSS.registerProperty |
|-----------|---------------------|
| 纯 CSS，无需 JS | 需要 JS 执行 |
| 在 CSS 解析时注册 | 在 JS 运行时注册 |
| 无法动态生成 | 可动态创建属性 |
| 浏览器支持相对较新 | 支持范围更广 |

---

## 兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 85 (2020-08) |
| Edge | 85 (2020-08) |
| Safari | 15.4 (2022-03) |
| Firefox | 128 (2024-07) |
| Opera | 71 |
| Samsung Internet | 14.0 |

### 渐进增强策略

```css
/* 1. 先用普通自定义属性做基础样式 */
.box {
  --color: #3498db;
  background: var(--color);
}

/* 2. @property 为支持的浏览器提供动画能力 */
@property --color {
  syntax: '<color>';
  inherits: false;
  initial-value: #3498db;
}

.box {
  transition: --color 0.3s;
}

/* 不支持 @property 的浏览器：瞬间切换（可接受）
   支持 @property 的浏览器：平滑过渡（增强体验） */
```

---

## 限制与注意事项

1. **属性名必须以 `--` 开头** — 与普通自定义属性规则一致
2. **`initial-value` 必须匹配 `syntax`** — 不匹配时整个 @property 规则无效
3. **不能用于标准 CSS 属性** — 只能注册自定义属性（`--*`）
4. **动画时 JS 读取值可能为字符串** — 建议始终通过 `var()` 使用
5. **`syntax: '*'` 不提供类型检查** — 等价于普通的自定义属性，无动画能力
6. **`<integer>` 类型的动画是离散跳变** — 浏览器在整数边界切换，而非平滑插值

---

## 示例

每个 HTML 文件可直接在浏览器中打开。

| 文件 | 内容 |
|------|------|
| [`01-basic-register.html`](/demos/css/at-rules/property/01-basic-register.html) | **基本注册** — 用 syntax / inherits / initial-value 注册自定义属性 |
| [`02-color-transition.html`](/demos/css/at-rules/property/02-color-transition.html) | **颜色过渡** — transition 直接作用于自定义属性，悬停平滑变色 |
| [`03-gradient-animation.html`](/demos/css/at-rules/property/03-gradient-animation.html) | **渐变角度动画** — @property 驱动 conic-gradient 旋转 |
| [`04-integer-counter.html`](/demos/css/at-rules/property/04-integer-counter.html) | **整数计数器** — `<integer>` + counter-reset 实现纯 CSS 数字滚动 |
| [`05-type-safety.html`](/demos/css/at-rules/property/05-type-safety.html) | **类型安全** — 无效值被拒绝，回退到 initial-value |
| [`06-without-property.html`](/demos/css/at-rules/property/06-without-property.html) | **有/无对比** — 并排对比，直观展示 @property 使动画生效的关键作用 |

---

## 相关资源

- [MDN: @property](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@property)
- [W3C 规范: CSS Properties and Values API Level 1](https://www.w3.org/TR/css-properties-values-api-1/)
- [web.dev: @property — 赋予 CSS 自定义属性超能力](https://web.dev/at-property/)
- [Chrome Developers: CSS @property and the New Style of Progressive Enhancement](https://developer.chrome.com/docs/css-ui/at-property)

---

## 在线示例

<Demo src="/demos/css/at-rules/property/01-basic-register.html" title="基本注册 — 用 syntax / inherits / initial-value 注册自定义属性" height="360px" />

<Demo src="/demos/css/at-rules/property/02-color-transition.html" title="颜色过渡 — transition 直接作用于自定义属性，悬停平滑变色" height="360px" />

<Demo src="/demos/css/at-rules/property/03-gradient-animation.html" title="渐变角度动画 — @property 驱动 conic-gradient 旋转" height="360px" />

<Demo src="/demos/css/at-rules/property/04-integer-counter.html" title="整数计数器 — \<integer\> + counter-reset 实现纯 CSS 数字滚动" height="360px" />

<Demo src="/demos/css/at-rules/property/05-type-safety.html" title="类型安全 — 无效值被拒绝，回退到 initial-value" height="360px" />

<Demo src="/demos/css/at-rules/property/06-without-property.html" title="有/无对比 — 并排对比，直观展示 @property 使动画生效的关键作用" height="360px" />
