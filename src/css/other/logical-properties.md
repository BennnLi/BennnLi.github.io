# Logical Properties

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values

Logical Properties 是 CSS 逻辑属性与值模块引入的特性，使用 `inline`（行内方向）和 `block`（块方向）替代物理方向（上下左右），自动适配不同书写方向。

---

## 为什么需要 Logical Properties？

传统 CSS 使用物理方向（上下左右），无法自动适配 RTL（从右到左）语言：

```css
/* 传统写法：物理方向 */
.card {
  margin-left: 16px;
  padding-right: 16px;
  border-left: 3px solid #1a73e8;
}
```

Logical Properties 使用逻辑方向，自动适配不同书写方向：

```css
/* 新写法：逻辑方向 */
.card {
  margin-inline-start: 16px;
  padding-inline-end: 16px;
  border-inline-start: 3px solid #1a73e8;
}
```

---

## 语法

### 物理属性 → 逻辑属性

| 物理属性 | 逻辑属性 | 说明 |
|----------|----------|------|
| `margin-left` | `margin-inline-start` | 行内方向起始边 |
| `margin-right` | `margin-inline-end` | 行内方向结束边 |
| `margin-top` | `margin-block-start` | 块方向起始边 |
| `margin-bottom` | `margin-block-end` | 块方向结束边 |
| `padding-left` | `padding-inline-start` | 行内方向起始边 |
| `padding-right` | `padding-inline-end` | 行内方向结束边 |
| `padding-top` | `padding-block-start` | 块方向起始边 |
| `padding-bottom` | `padding-block-end` | 块方向结束边 |
| `border-left` | `border-inline-start` | 行内方向起始边 |
| `border-right` | `border-inline-end` | 行内方向结束边 |
| `border-top` | `border-block-start` | 块方向起始边 |
| `border-bottom` | `border-block-end` | 块方向结束边 |
| `left` | `inset-inline-start` | 行内方向起始偏移 |
| `right` | `inset-inline-end` | 行内方向结束偏移 |
| `top` | `inset-block-start` | 块方向起始偏移 |
| `bottom` | `inset-block-end` | 块方向结束偏移 |
| `width` | `inline-size` | 行内方向尺寸 |
| `height` | `block-size` | 块方向尺寸 |

### 简写属性

```css
/* margin 简写 */
margin-inline: 16px;           /* 左右 */
margin-block: 16px;            /* 上下 */
margin-inline-start: 16px;     /* 左 */
margin-inline-end: 16px;       /* 右 */

/* padding 简写 */
padding-inline: 16px;          /* 左右 */
padding-block: 16px;           /* 上下 */

/* border 简写 */
border-inline: 1px solid #ddd; /* 左右 */
border-block: 1px solid #ddd;  /* 上下 */

/* inset 简写 */
inset: 0;                      /* 四个方向 */
inset-inline: 0;               /* 左右 */
inset-block: 0;                /* 上下 */
```

---

## 实际运用

### 1. 基础布局自动适配 RTL

```css
.card {
  margin-inline-start: 16px;
  padding-inline-end: 16px;
  border-inline-start: 3px solid #1a73e8;
}
```

### 2. 定位元素

```css
.tooltip {
  position: absolute;
  inset-inline-start: 0;
  inset-block-end: 100%;
}

.badge {
  position: absolute;
  inset-inline-end: -4px;
  inset-block-start: -4px;
}
```

### 3. 尺寸

```css
.sidebar {
  inline-size: 250px;
  block-size: 100%;
}

.content {
  inline-size: min(90%, 1200px);
  block-size: auto;
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 69 |
| Firefox | 41 |
| Safari | 12.1 |
| Edge | 79 |

Baseline 2020，全浏览器可用。

---

## 注意事项

1. Logical Properties 自动适配不同书写方向（LTR/RTL）
2. `inline` 方向：LTR 时为左→右，RTL 时为右→左
3. `block` 方向：通常为上→下
4. 可以与物理属性混用，但推荐统一使用逻辑属性
5. `inset` 简写可以同时设置四个方向

---

## 相关资源

- [MDN: Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)
- [CSS Logical Properties and Values Level 1](https://www.w3.org/TR/css-logical-1/)

---

## 在线示例

<Demo src="/demos/css/other/logical-properties/01-basic.html" title="基础用法 — 逻辑属性基础" height="360px" />
