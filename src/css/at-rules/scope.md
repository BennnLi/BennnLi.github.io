# @scope
> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope

CSS `@scope` 用于**限制样式的作用范围**。它定义了一个"作用域根"，让选择器只匹配该根下的元素，同时可以设定下边界阻止样式继续向内穿透。

---

## 为什么需要 @scope？

传统 CSS 选择器是全局的 —— `.card .title` 会匹配页面上任何一个 `.card` 里的 `.title`，无论 DOM 嵌套多深。

`@scope` 解决了两个问题：

1. **样式泄漏** — 你写的样式意外影响了不该影响的元素
2. **样式污染** — 你很难写出"只在这个区域内生效"的样式（BEM 命名本质上是手工 scope）

---

## 语法

```css
@scope (scope-root) to (scope-limit) {
  /* 样式只作用于 scope-root 之内、scope-limit 之外的区域 */
}
```

- `scope-root` — 作用域**上边界**（起始点），必选
- `to (scope-limit)` — 作用域**下边界**（结束点），可选
- `:scope` 伪类 — 在块内指代 scope-root 元素本身

---

## 基础用法

```css
@scope (.card) {
  /* 只影响 .card 内部的所有元素 */
  img {
    border-radius: 8px;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
  }
}
```

HTML:

```html
<div class="card">
  <img src="a.jpg" />          <!-- ✅ 被选中 -->
  <span class="title">卡片</span> <!-- ✅ 被选中 -->
</div>

<div class="sidebar">
  <img src="b.jpg" />          <!-- ❌ 不受影响 -->
  <span class="title">侧栏</span> <!-- ❌ 不受影响 -->
</div>
```

---

## 设置下边界 `to (...)`

`to` 定义了下边界 —— 边界内的子元素**不再受作用域影响**。

```css
@scope (.post) to (.comments) {
  p { color: #333; }
}
```

```html
<article class="post">
  <p>正文段落 —— ✅ 有样式</p>
  <div class="related">
    <p>相关阅读 —— ✅ 仍在作用域内</p>
  </div>
  <section class="comments">
    <p>评论区 —— ❌ 在下边界外，不受影响</p>
  </section>
</article>
```

**注意**：下边界元素本身（`.comments`）也在作用域之外。

---

## `:scope` 伪类

选中 scope-root **自身**（不是内部元素）：

```css
@scope (.card) {
  :scope {
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  :scope:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
}
```

---

## 优先级

`@scope` 内的选择器优先级计算**不包含 scope-root**，因此：

```css
@scope (.app) {
  .title { color: red; }      /* 特异性 = (0,1,0) */
}

/* 全局样式 */
.title { color: blue; }       /* 特异性 = (0,1,0)，正常级联规则决定 */
```

两个选择器特异性相同，按书写顺序决定。Scope 本身不增加特异性 —— 这是它与嵌套选择器（`.app .title` → 特异性 (0,2,0)）的关键区别。

---

## 与 @layer 配合

`@scope` 和 `@layer` 解决的是不同维度的问题，可以组合：

```css
@layer components {
  @scope (.card) {
    img { border-radius: 8px; }
    :scope { padding: 16px; }
  }

  @scope (.sidebar) {
    img { border-radius: 4px; }
    :scope { padding: 12px; }
  }
}
```

| | @layer | @scope |
|---|---|---|
| **解决的问题** | 优先级管理 | 作用域隔离 |
| **控制维度** | 垂直（层叠） | 水平（DOM 区域） |
| **比喻** | z-index 堆叠 | 围栏隔离 |

---

## 内联 style 标签中的 @scope

`<style>` 标签上直接使用 `@scope`（也称为"内联 scope"）：

```html
<div class="card">
  <style>
    @scope {
      p { color: red; }
    }
  </style>
  <p>红色文字</p>
</div>
```

当 `<style>` 标签放在某个元素内部，且 `@scope` 省略了 scope-root 时，scope-root 自动设为该 `<style>` 的父元素。

---

## 与现有方案的对比

| 方案 | 写法 | 问题 |
|------|------|------|
| 手工命名空间 | `.card__title` | 命名负担重，无法限制穿透深度 |
| 嵌套选择器 | `.card .title` | 增加特异性，`to` 做不到 |
| Shadow DOM | `attachShadow()` | 完全隔离，无法共享全局样式 |
| **@scope** | `@scope (.card) { … }` | 精确控制范围+深度，低特异性 |

---

## 浏览器兼容性

Chrome 118+、Edge 118+、Safari 17.4+、Firefox 待定（开发中）。

---

## 注意事项

1. scope-root 不能是伪类选择器（如 `:hover`），但可以是 `:scope` 以外的伪类吗？不——scope-root 必须是有效的 CSS 选择器，`::before` 等伪元素不可用作 root
2. `to` 边界内的样式不受作用域影响，但可以被外层 scope 或其他样式覆盖
3. `@scope` 可以嵌套使用，形成多层隔离
4. 内联 style 的 `@scope` 省略 root 时，以 style 元素的父元素作为 root

---

## 在线示例

<Demo src="/demos/css/at-rules/scope/01-scope-basic.html" title="基础作用域 — .card 内的样式不影响外部元素" height="360px" />

<Demo src="/demos/css/at-rules/scope/02-scope-boundary.html" title="下边界 to() — 作用域在指定边界处停止" height="360px" />

<Demo src="/demos/css/at-rules/scope/03-scope-pseudo.html" title=":scope 伪类 — 样式化 scope-root 自身" height="360px" />

<Demo src="/demos/css/at-rules/scope/04-scope-specificity.html" title="不增加特异性 — @scope 内选择器保持低特异性" height="360px" />

<Demo src="/demos/css/at-rules/scope/05-scope-inline.html" title="内联 @scope — <style> 在元素内部自动确定 root" height="360px" />
