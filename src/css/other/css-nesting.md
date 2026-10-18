# CSS Nesting

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting

CSS Nesting 是 CSS 嵌套特性，允许在 CSS 中使用类似 SCSS 的嵌套语法。

---

## 为什么需要 CSS Nesting？

以前 CSS 不支持嵌套，需要重复书写选择器：

```css
/* 传统写法：重复书写选择器 */
.card {
  background: #fff;
  border-radius: 8px;
}

.card .title {
  font-size: 18px;
  font-weight: bold;
}

.card .content {
  color: #666;
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

CSS Nesting 让这变得简洁：

```css
/* 新写法：嵌套语法 */
.card {
  background: #fff;
  border-radius: 8px;

  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .content {
    color: #666;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}
```

---

## 语法

```css
.parent {
  /* 父元素样式 */

  .child {
    /* 子元素样式 */
  }

  &:hover {
    /* 伪类样式 */
  }

  @media (min-width: 768px) {
    /* 媒体查询 */
  }
}
```

---

## 嵌套规则

### 1. 基本嵌套

```css
.card {
  background: #fff;

  .title {
    font-size: 18px;
  }
}
```

### 2. 伪类嵌套

```css
.button {
  background: #1a73e8;

  &:hover {
    background: #1557b0;
  }

  &:active {
    background: #0d47a1;
  }
}
```

### 3. 伪元素嵌套

```css
.list {
  list-style: none;

  &::before {
    content: '';
    display: block;
  }

  &::after {
    content: '';
    display: block;
  }
}
```

### 4. 媒体查询嵌套

```css
.container {
  width: 100%;

  @media (min-width: 768px) {
    width: 750px;
  }

  @media (min-width: 1200px) {
    width: 1200px;
  }
}
```

### 5. 嵌套选择器

```css
.nav {
  display: flex;

  & > li {
    margin-right: 16px;
  }

  & a {
    color: #333;
  }
}
```

---

## 实际运用

### 1. 组件样式

```css
.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;

  .card-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
    margin-bottom: 12px;
  }

  .card-body {
    color: #666;
  }

  .card-footer {
    border-top: 1px solid #eee;
    padding-top: 12px;
    margin-top: 12px;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}
```

### 2. 表单样式

```css
.form-group {
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }

  input, select, textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;

    &:focus {
      outline: none;
      border-color: #1a73e8;
    }
  }
}
```

### 3. 响应式布局

```css
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 120 |
| Firefox | 117 |
| Safari | 17.2 |
| Edge | 120 |

Baseline 2023，全浏览器可用。

---

## 注意事项

1. 嵌套选择器必须以 `&` 开头（表示父选择器）
2. 可以嵌套伪类、伪元素、媒体查询
3. 嵌套深度不宜过深，建议不超过 3 层
4. 可以与 SCSS 语法混用，但推荐统一使用原生嵌套
5. 性能良好，浏览器会优化嵌套选择器

---

## 相关资源

- [MDN: CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
- [CSS Nesting Module](https://drafts.csswg.org/css-nesting-1/)

---

## 在线示例

<Demo src="/demos/css/other/css-nesting/01-basic.html" title="基础用法 — CSS Nesting 基础" height="360px" />
