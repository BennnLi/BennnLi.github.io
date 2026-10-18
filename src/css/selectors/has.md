# :has()

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/:has
> 规范: https://www.w3.org/TR/selectors-4/#relational

`:has()` 是一个**关系型伪类（relational pseudo-class）**，也是 CSS 中第一个真正意义上的"父选择器"。它让选择器可以**反向匹配**：根据元素内部（或后面）是否存在某个匹配的元素，来决定是否选中它。

---

## 为什么需要 :has()？

在 `:has()` 出现之前，CSS 只能"从父往子"选，无法"从子往父"选：

```css
/* 以前做不到：选中「包含图片的卡片」 */
/* 只能给卡片加类名，用 JS 维护 */
```

传统的解决方式都要靠 JavaScript：

```javascript
// 以前的做法：JS 观察子元素，给父元素加类名
document.querySelectorAll('.card').forEach(card => {
  if (card.querySelector('img')) {
    card.classList.add('has-image');
  }
});
```

```css
.card.has-image { border-radius: 12px; }
```

`:has()` 让这在纯 CSS 中成为可能：

```css
/* 现在的做法：纯 CSS，无需 JS */
.card:has(img) { border-radius: 12px; }
```

---

## 语法

```css
:has(<relative-selector-list>)
```

参数是一个**相对选择器列表**，也就是说选择器可以以组合器开头：

| 写法 | 含义 |
|------|------|
| `.card:has(img)` | `.card` 内**任意深度**存在 `img` |
| `.card:has(> img)` | `.card` 的**直接子元素**是 `img` |
| `.card:has(+ .card)` | `.card` 的**紧邻下一个兄弟**是 `.card` |
| `.card:has(~ .card)` | `.card` 的**后续某个兄弟**是 `.card` |
| `label:has(+ input)` | `label` 后面紧跟着 `input` |

> **关键点**：`:has()` 的参数是"相对选择器"，所以组合器 `>`、`+`、`~` 可以出现在**开头**，表示相对当前元素的查找方向。这是它与普通选择器的核心区别。

---

## 实际运用

### 1. 父选择器：根据子元素决定父元素样式

```css
/* 卡片含图片时加圆角 */
.card:has(img) { border-radius: 12px; }

/* 有视频的卡片用深色背景 */
.card:has(video) { background: #000; color: #fff; }

/* 列表项含链接时加下划线 */
li:has(a) { text-decoration: underline; }
```

### 2. 表单验证联动

```css
/* 表单项有错误时，高亮整个字段组（包括 label、提示文字） */
.field:has(input:invalid) {
  border-color: #dc3545;
  background: #fff5f5;
}

.field:has(input:invalid) label {
  color: #dc3545;
}

/* 用户输入有效时显示绿色 */
.field:has(input:user-valid) {
  border-color: #28a745;
}
```

### 3. 兄弟选择器组合

```css
/* 每个后面还有兄弟的 li 加分隔线（最后一项不加） */
li:has(+ li) { border-bottom: 1px solid #eee; }

/* 后面紧跟段落的标题加下边距 */
h2:has(+ p) { margin-bottom: 8px; }

/* 后面不是段落的标题加大边距 */
h2:not(:has(+ p)) { margin-bottom: 24px; }
```

### 4. 空状态处理

```css
/* 列表为空时隐藏 */
ul:not(:has(li)) { display: none; }

/* 空列表显示占位提示 */
.list:not(:has(> *))::after {
  content: '暂无数据';
  color: #999;
}
```

### 5. 状态联动：高亮整块

```css
/* 导航中有激活项时，整个导航加背景 */
nav:has(a.active) { background: #e8f0fe; }

/* 表单中有必填项未填时，提交按钮置灰 */
form:has(input:invalid) button[type="submit"] {
  opacity: 0.5;
  pointer-events: none;
}
```

### 6. 与 :is() / :not() 组合

```css
/* 卡片中有图片但没有图片说明时加边框 */
.card:has(img):not(:has(figcaption)) {
  border: 2px dashed #ddd;
}

/* 含标题或图标的卡片 */
.card:has(:is(h1, h2, h3, svg)) {
  padding-top: 24px;
}
```

---

## 特异性（Specificity）

`:has()` 与 `:is()`、`:not()` 一样：**取参数中特异性最高的那个**，而不是把所有参数加总。

```css
/* .card 是 (0,1,0)，参数 img 是 (0,0,1) */
/* 整体 = (0,1,0) + (0,0,1) = (0,1,1) */
.card:has(img) { color: red; }

/* 参数是列表时，只取最高的那一项，不累加 */
/* max( .title(0,1,0), img(0,0,1) ) = (0,1,0) */
/* 整体 = (0,1,0) + (0,1,0) = (0,2,0) */
.card:has(.title, img) { color: blue; }

/* 对比：普通后代选择器会把两边相加，同样是 (0,1,1) */
.card img { color: green; }
```

> **记忆方法**：`:has(...)` 内部的参数**只按最高的一项计一次**，然后与外层选择器相加。这一点和 `:is()` / `:not()` 完全一致。

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 105 |
| Firefox | 121 |
| Safari | 15.4 |
| Edge | 105 |

Baseline 2023，全浏览器可用。

> 注：Safari 15.4 是最早支持 `:has()` 的浏览器（2022 年 3 月），Firefox 直到 121（2023 年 12 月）才支持，因此 `:has()` 曾被戏称为"Safari 专属特性"。

---

## 注意事项

1. `:has()` **不能嵌套**在另一个 `:has()` 内（`:has(:has(...))` 无效），但可以放在 `:is()` / `:not()` / `:where()` 内
2. `:has()` 参数中**不能使用伪元素**（如 `:has(::before)` 无效）
3. 参数是**相对选择器**，组合器 `>`、`+`、`~` 可以放在开头
4. 性能上浏览器会做优化；但避免在大范围元素上使用过于复杂的 `:has()`
5. `:has()` 只能沿"向内 / 向后"查找，**无法向上选择祖先**
6. 页面加载时会立即匹配，不受用户交互影响（与 `:user-valid` 不同）

---

## 相关资源

- [MDN: :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [CSS Selectors Level 4 — Relational Pseudo-class](https://www.w3.org/TR/selectors-4/#relational)
- [web.dev: :has() 已支持跨浏览器](https://web.dev/blog/has-is-now-supported-cross-browser)

---

## 在线示例

<Demo src="/demos/css/selectors/has/01-basic.html" title="基础用法 — 父选择器概念，根据子元素选父元素" height="360px" />

<Demo src="/demos/css/selectors/has/02-form-validation.html" title="表单验证 — 表单项出错时高亮整个字段组" height="360px" />

<Demo src="/demos/css/selectors/has/03-card-layout.html" title="卡片条件布局 — 有无图片时卡片样式不同" height="360px" />

<Demo src="/demos/css/selectors/has/04-sibling.html" title="兄弟组合器 — :has(+ x) / :has(~ x) 相对兄弟选择" height="360px" />

<Demo src="/demos/css/selectors/has/05-empty-state.html" title="空状态处理 — 列表为空时隐藏或显示占位" height="360px" />

<Demo src="/demos/css/selectors/has/06-vs-js.html" title="对比 JS 做法 — 同样的效果，纯 CSS vs JavaScript" height="360px" />
