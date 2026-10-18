# :is() / :where()

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/:is()
> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/:where()

`:is()` 和 `:where()` 都是**函数式伪类**，接受一个选择器列表作为参数，匹配其中任意一个。它们的区别在于**特异性（Specificity）**。

---

## 为什么需要 :is() / :where()？

传统 CSS 中，如果要为多个选择器设置相同样式，需要重复书写：

```css
/* 以前：重复写 */
header h1, header h2, header h3,
nav h1, nav h2, nav h3,
footer h1, footer h2, footer h3 {
  font-family: "PingFang SC", sans-serif;
}
```

`:is()` 和 `:where()` 让这种写法变得简洁：

```css
/* 现在：一行搞定 */
:is(header, nav, footer) :is(h1, h2, h3) {
  font-family: "PingFang SC", sans-serif;
}
```

---

## 语法

```css
:is(selector-list) { ... }
:where(selector-list) { ... }
```

- `selector-list`：用逗号分隔的选择器列表
- `:is()` 的特异性 = 参数中**特异性最高**的那个
- `:where()` 的特异性 = **0**（始终为 0）

---

## :is() 与 :where() 的区别

| 伪类 | 特异性 | 用途 |
|------|--------|------|
| `:is()` | 取参数中特异性最高的那个 | 通用简化，保持原有优先级 |
| `:where()` | 始终为 0 | 写可被轻松覆盖的默认/基础样式 |

```css
/* :is() — 特异性 = (0,1,0)，因为 .container 的特异性是 (0,1,0) */
:is(.container, .wrapper) p { color: red; }

/* :where() — 特异性 = (0,0,0)，即使参数有高特异性 */
:where(.container, .wrapper) p { color: red; }

/* 后续任何规则都能覆盖 :where() */
p { color: blue; } /* 胜出 */
```

---

## 实际运用

### 1. 简化复杂选择器

```css
/* 以前：重复写 */
header h1, header h2, header h3,
nav h1, nav h2, nav h3,
footer h1, footer h2, footer h3 {
  font-family: "PingFang SC", sans-serif;
}

/* 现在：一行搞定 */
:is(header, nav, footer) :is(h1, h2, h3) {
  font-family: "PingFang SC", sans-serif;
}
```

### 2. :where() 写可覆盖的基础样式

```css
/* 基础样式 — 特异性为 0，极易被覆盖 */
:where(button) {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

/* 业务样式 — 普通选择器就能覆盖，不需要 !important */
.btn-primary {
  background: #1a73e8;
  color: white;
  border-color: #1a73e8;
}
```

### 3. 配合伪类做复杂匹配

```css
/* 选中所有非第一个、非最后一个子元素 */
li:is(:not(:first-child), :not(:last-child)) {
  border-top: 1px solid #eee;
}

/* 选中所有带 href 的 a 标签或 button 元素 */
:is(a[href], button):hover {
  opacity: 0.8;
}
```

### 4. :where() 用于默认主题

```css
/* 默认主题 — 特异性为 0，用户可轻松覆盖 */
:where(:root) {
  --primary: #1a73e8;
  --text: #333;
  --bg: #fff;
}

/* 用户自定义 — 不需要 !important */
:root {
  --primary: #e91e63;
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 88 |
| Firefox | 78 |
| Safari | 14 |
| Edge | 88 |

Baseline 2021，全浏览器可用。

---

## 注意事项

1. `:is()` 和 `:where()` **不能嵌套**（如 `:is(:is(a, b), c)` 是无效的）
2. `:is()` 的特异性取参数中最高的，可能比预期更高
3. `:where()` 的特异性始终为 0，适合写可覆盖的默认样式
4. 参数中的选择器必须是有效的 CSS 选择器
5. `:is()` 和 `:where()` 可以组合使用

---

## 相关资源

- [MDN: :is()](https://developer.mozilla.org/en-US/docs/Web/CSS/:is)
- [MDN: :where()](https://developer.mozilla.org/en-US/docs/Web/CSS/:where)
- [CSS Selectors Level 4](https://www.w3.org/TR/selectors-4/#matches)

---

## 在线示例

<Demo src="/demos/css/selectors/is-where/01-basic-is.html" title=":is() 基础 — 简化多选择器，保持特异性" height="360px" />

<Demo src="/demos/css/selectors/is-where/02-basic-where.html" title=":where() 基础 — 特异性为 0 的默认样式" height="360px" />

<Demo src="/demos/css/selectors/is-where/03-is-vs-where.html" title=":is() vs :where() 对比 — 特异性差异对比" height="360px" />

<Demo src="/demos/css/selectors/is-where/04-nested-selectors.html" title="嵌套选择器 — :is() 配合伪类和组合器" height="360px" />

<Demo src="/demos/css/selectors/is-where/05-default-theme.html" title="默认主题 — :where() 写可覆盖的 CSS 变量" height="360px" />
