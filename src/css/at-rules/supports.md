# @supports

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/@supports
> MDN（CSS.supports）: https://developer.mozilla.org/en-US/docs/Web/API/CSS/supports_static

CSS `@supports` 用于**特性检测（feature query）**：判断当前浏览器是否支持某个 CSS 声明或选择器，从而决定是否应用一段样式。

---

## 为什么需要 @supports？

CSS 的容错机制是"**不认识就忽略**"：

```css
.box {
  display: flex;      /* 老浏览器不认识 → 整条忽略，继续往下 */
  display: grid;      /* 新浏览器认识 → 覆盖上一行 */
}
```

这个"层叠回退"只能处理**单个声明**。当需要"**一整块样式**"作为回退时，就力不从心了：

```css
/* 想实现：支持 grid 就用 grid 布局，不支持就用 float */
/* 用层叠回退写不出来 —— 因为要切换的是多条属性 */
```

`@supports` 解决了这个问题：

```css
/* 默认：回退方案 */
.layout { float: left; width: 50%; }

/* 支持 grid 时才应用 */
@supports (display: grid) {
  .layout {
    float: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

---

## 语法

### 1. 基本形式

```css
@supports (<property>: <value>) {
  /* 浏览器支持这个声明时生效 */
}

@supports (display: grid) {
  .box { display: grid; }
}
```

> **注意**：检测的是「**浏览器能否解析这个声明**」，而不是「这个声明是否有视觉效果」。只要解析通过，条件就成立。

### 2. 逻辑运算

```css
/* not —— 取反，常用于提供回退 */
@supports not (display: grid) {
  .box { float: left; }
}

/* and —— 同时满足 */
@supports (display: grid) and (gap: 1rem) {
  .box { display: grid; gap: 1rem; }
}

/* or —— 满足任一 */
@supports (display: grid) or (display: flex) {
  .box { display: grid; }
}

/* 组合 + 括号分组 */
@supports ((display: grid) or (display: flex)) and (gap: 1rem) {
  .box { gap: 1rem; }
}
```

### 3. `selector()` —— 检测选择器是否支持

```css
/* 检测 :has() 是否支持 */
@supports selector(:has(a)) {
  .card:has(img) { border-radius: 12px; }
}

/* 检测 :is() */
@supports selector(:is(a, b)) {
  :is(h1, h2, h3) { margin-top: 0; }
}
```

### 4. 嵌套使用

`@supports` 可以和 `@media`、`@layer`、`@container` 相互嵌套：

```css
@media (min-width: 768px) {
  @supports (display: grid) {
    .box { display: grid; }
  }
}

/* 也可以写在 @layer 里，参与级联层排序 */
@layer components {
  @supports (display: grid) {
    .box { display: grid; }
  }
}
```

---

## 实际运用

### 1. 布局方案回退

```css
/* 默认：float 布局 */
.grid { overflow: hidden; }
.grid .item { float: left; width: 33.333%; }

/* 支持 grid 时升级 */
@supports (display: grid) {
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .grid .item {
    float: none;
    width: auto;
  }
}
```

### 2. 现代颜色回退

```css
/* 默认：十六进制 */
.brand { color: #1a73e8; }

/* 支持 oklch 时使用更精确的颜色 */
@supports (color: oklch(0.5 0.2 250)) {
  .brand { color: oklch(0.5 0.2 250); }
}
```

### 3. 容器查询回退

```css
/* 默认：按视口响应 */
.card { flex-direction: column; }
@media (min-width: 600px) {
  .card { flex-direction: row; }
}

/* 支持容器查询时改成按容器响应 */
@supports (container-type: inline-size) {
  .card-list { container-type: inline-size; }

  @container (min-width: 400px) {
    .card { flex-direction: row; }
  }
}
```

### 4. 选择器能力升级

```css
/* 不支持 :has() 时的兜底（靠 JS 加类名） */
.card.has-image { border-radius: 12px; }

/* 支持 :has() 后，纯 CSS 搞定 */
@supports selector(:has(*)) {
  .card:has(img) { border-radius: 12px; }
}
```

### 5. 渐进增强的通用模式

```css
/* 第 1 层：所有浏览器都能用的基础样式 */
.box {
  background: #3498db;
  transition: background 0.3s;
}

/* 第 2 层：能力更强的浏览器获得更好体验 */
@supports (color: color-mix(in srgb, red, blue)) {
  .box {
    background: color-mix(in srgb, #3498db 80%, black);
  }
}
```

### 6. `@supports` 的反模式：不要用来判断"老旧浏览器"

```css
/* ❌ 不推荐：这是"浏览器嗅探"思路，脆弱且不可维护 */
@supports not (display: grid) {
  .ie-only { /* ... */ }
}

/* ✅ 推荐：永远写"能力"而不是"浏览器" */
@supports (display: grid) {
  .grid { display: grid; }
}
```

---

## JavaScript 等价 API

```javascript
// 检测单个声明
CSS.supports('display', 'grid');          // true / false
CSS.supports('display: grid');            // 字符串形式也可以

// 检测选择器
CSS.supports('selector(:has(a))');        // true / false

// 检测带条件的表达式
CSS.supports('(display: grid) and (gap: 1rem)');
```

| | `@supports` | `CSS.supports()` |
|---|---|---|
| 位置 | CSS 中 | JS 中 |
| 用途 | 条件应用样式块 | 运行时分支判断 |
| 时机 | 解析时 | 运行时 |

---

## 浏览器兼容性

`@supports` 本身支持极早，属于 **Baseline 广泛可用**：

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 28 |
| Firefox | 22 |
| Safari | 9 |
| Edge | 12 |

`selector()` 函数稍晚：

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 83 |
| Firefox | 69 |
| Safari | 14.1 |
| Edge | 83 |

---

## 注意事项

1. **检测的是"能否解析"**，不是"是否有效果"。例如某属性被解析但不产生视觉效果时，条件仍为真
2. 条件里**只能写声明**（`property: value`），不能写选择器 —— 检测选择器要用 `selector()`
3. `not` 只能作用于**整个括号表达式**，不能只否定一半：`@supports not (a) and (b)` 里的 `not` 只作用于 `(a)`
4. 嵌套在 `@media` / `@layer` 内均合法，反之亦然
5. `@supports` 内的样式**照常参与级联**，特异性、`@layer` 层序都不受影响
6. 老浏览器会**整块忽略** `@supports`（连里面的回退样式一起忽略），所以**回退样式必须写在 `@supports` 外面**
7. 不要把它当成浏览器嗅探工具，始终按"能力"而非"品牌/版本"来写
8. `@supports` 无法检测**部分实现**或**有 bug 的实现** —— 只保证语法层面的支持

---

## 与其他方案对比

| 方案 | 判断依据 | 特点 |
|------|----------|------|
| 层叠回退（写两遍声明） | 后写的覆盖先写的 | 只能处理单条声明 |
| **`@supports`** | 声明 / 选择器是否被支持 | 可切换整块样式，声明式 |
| `CSS.supports()` | 同上 | JS 中运行时判断 |
| UA 嗅探 | User-Agent 字符串 | ❌ 脆弱，已不推荐 |

---

## 相关资源

- [MDN: @supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)
- [MDN: CSS.supports()](https://developer.mozilla.org/en-US/docs/Web/API/CSS/supports_static)
- [CSS Conditional Rules Module Level 3](https://www.w3.org/TR/css-conditional-3/)

---

## 在线示例

<Demo src="/demos/css/at-rules/supports/01-basic.html" title="基础用法 — 检测 display: grid，支持才应用" height="360px" />

<Demo src="/demos/css/at-rules/supports/02-not.html" title="not 回退 — 不支持时用另一套样式兜底" height="360px" />

<Demo src="/demos/css/at-rules/supports/03-and-or.html" title="and / or — 多条件组合" height="360px" />

<Demo src="/demos/css/at-rules/supports/04-selector.html" title="selector() — 检测 :has() 等选择器是否支持" height="360px" />

<Demo src="/demos/css/at-rules/supports/05-progressive.html" title="渐进增强 — 基础样式 + @supports 增强" height="360px" />

<Demo src="/demos/css/at-rules/supports/06-js-api.html" title="CSS.supports() — JS 中的等价判断" height="360px" />
