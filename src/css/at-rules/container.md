# @container

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/@container
> MDN（容器查询指南）: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries

CSS `@container` 用于**容器查询（Container Queries）**：让样式依据**祖先容器自身的尺寸**生效，而不是视口尺寸。

---

## 为什么需要 @container？

`@media` 只能感知**视口**大小，无法感知"组件被放在多宽的容器里"。这导致同一个组件在不同布局位置无法自适应：

```css
/* 用 @media 的问题：只关心视口宽度 */
@media (min-width: 600px) {
  .card { flex-direction: row; }
}
```

问题在于：**同样的视口宽度下，`.card` 可能在宽侧栏（600px）里，也可能在窄侧栏（280px）里** —— `@media` 无法区分，只能一刀切。

`@container` 让组件根据**自己所在的容器**决定布局：

```css
/* 用 @container：关心的是「卡片所在容器」的宽度 */
@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

> 这是组件化设计的关键一步：组件真正可以"放到任何地方都自适应"，而不需要为每个放置位置写不同的媒体查询。

---

## 语法

### 1. 声明容器

先用 `container-type` 把某个祖先元素声明为**查询容器**：

```css
.card-list {
  container-type: inline-size;   /* 可按「行内方向尺寸」查询 */
}
```

| `container-type` | 含义 | 说明 |
|------------------|------|------|
| `normal`（默认） | 不是尺寸查询容器 | 仍可作为样式查询容器 |
| `inline-size` | 可按行内方向（通常是宽度）查询 | **最常用**，不要求高度确定 |
| `size` | 可按行内 + 块方向（宽和高）查询 | 要求容器两个方向尺寸都确定 |

### 2. 命名容器（可选）

```css
.card-list {
  container-type: inline-size;
  container-name: card-container;
}

/* 简写：container: <name> / <type> */
.sidebar {
  container: sidebar-container / inline-size;
}
```

### 3. 编写查询

```css
@container [<container-name>] (<条件>) {
  /* 样式 */
}
```

```css
/* 不写名字：使用最近的祖先容器 */
@container (min-width: 400px) {
  .card { flex-direction: row; }
}

/* 写名字：使用最近的、名字匹配的祖先容器 */
@container card-container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

### 4. 可查询的条件

| 类别 | 可查询的特性 |
|------|-------------|
| 尺寸 | `width`、`height`、`inline-size`、`block-size`、`aspect-ratio`、`orientation` |
| 范围语法 | `(width > 400px)`、`(400px <= width <= 800px)` |
| 样式 | `style(--theme: dark)`（**样式查询**，见下） |

---

## 容器查询单位

容器查询还提供了**相对容器尺寸的长度单位**，可以在容器内部任意使用：

| 单位 | 含义 |
|------|------|
| `cqw` | 容器宽度的 1% |
| `cqh` | 容器高度的 1% |
| `cqi` | 容器行内尺寸的 1% |
| `cqb` | 容器块方向尺寸的 1% |
| `cqmin` | `cqi` 与 `cqb` 中较小者 |
| `cqmax` | `cqi` 与 `cqb` 中较大者 |

```css
.card-list { container-type: inline-size; }

.card h2 {
  /* 字号随容器宽度缩放，而不是视口 */
  font-size: clamp(1rem, 4cqi, 1.75rem);
}

.card {
  padding: 2cqi;
}
```

---

## 样式查询（style queries）

除了尺寸，`@container` 还能查询**容器上的自定义属性值**：

```css
.theme-box {
  container-name: theme;
  --theme: dark;
}

@container theme style(--theme: dark) {
  .card {
    background: #1a1a1a;
    color: #eee;
  }
}
```

> 样式查询中，容器**不需要** `container-type`（`normal` 即可参与样式查询）。该特性较新，见下方兼容性。

---

## 实际运用

### 1. 卡片组件自适应

```css
.card-list {
  container-type: inline-size;
}

/* 窄容器：竖排 */
.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 宽容器：横排 */
@container (min-width: 400px) {
  .card {
    flex-direction: row;
    align-items: center;
  }
  .card img {
    width: 120px;
    flex-shrink: 0;
  }
}
```

### 2. 同一组件在不同栏位表现不同

```css
.sidebar { container: sidebar / inline-size; }
.main    { container: main / inline-size; }

/* 侧栏里的卡片：紧凑 */
@container sidebar (max-width: 300px) {
  .card .meta { display: none; }
}

/* 主区里的卡片：完整 */
@container main (min-width: 600px) {
  .card { display: grid; grid-template-columns: 200px 1fr; }
}
```

### 3. 响应式 Grid

```css
.grid-wrap { container-type: inline-size; }

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@container (min-width: 500px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@container (min-width: 900px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

### 4. 与 @media 分工

```css
/* @media：管「页面级 / 设备级」的事 */
@media (prefers-color-scheme: dark) {
  :root { --bg: #111; }
}
@media print {
  .no-print { display: none; }
}

/* @container：管「组件级」的事 */
@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

---

## 浏览器兼容性

### 尺寸查询（`@container` + `container-type`）

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 105 |
| Firefox | 110 |
| Safari | 16 |
| Edge | 105 |

**Baseline 2023，全浏览器可用**（容器查询单位 `cq*` 同样支持）。

### 样式查询（`@container style(...)`）

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 111 |
| Firefox | 128 |
| Safari | 18 |
| Edge | 111 |

较新，建议配合 `@supports` 做渐进增强。

---

## 注意事项

1. **元素不能查询自己的尺寸** —— 查询的是**祖先容器**，所以 `container-type` 必须加在父级上
2. 只作用于容器的**后代元素**，容器自身不受 `@container` 影响
3. 未指定名字时，使用**最近的**祖先查询容器；指定名字时，使用最近的**名字匹配**的祖先
4. `container-type: inline-size` 会带来 **containment**（布局/样式/行内尺寸包含），因此该元素会成为**绝对定位后代的包含块** —— 这一点容易踩坑
5. `container-type: size` 要求容器在两个方向上都有确定尺寸，否则查询不生效
6. 不能用 `@container` 查询容器的**颜色、字体**等非尺寸、非自定义属性的样式（样式查询目前主要支持自定义属性）
7. `container-name` 可以是空格分隔的多个名字，便于在不同查询中复用
8. 移动端注意：`container-type: inline-size` 与 `position: fixed` 后代可能产生预期外的定位行为

---

## 与其他方案对比

| 方案 | 依据 | 局限 |
|------|------|------|
| `@media` | 视口尺寸 | 无法感知组件所处容器 |
| JS ResizeObserver | 容器尺寸 | 需 JS，有性能与闪烁开销 |
| **`@container`** | 容器尺寸 | 原生、声明式、无 JS |

---

## 相关资源

- [MDN: @container](https://developer.mozilla.org/en-US/docs/Web/CSS/@container)
- [MDN: container-type](https://developer.mozilla.org/en-US/docs/Web/CSS/container-type)
- [MDN: container-name](https://developer.mozilla.org/en-US/docs/Web/CSS/container-name)
- [MDN: 容器查询长度单位](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#container_query_length_units)
- [CSS Containment Module Level 3](https://www.w3.org/TR/css-contain-3/)

---

## 在线示例

<Demo src="/demos/css/at-rules/container/01-container-basic.html" title="基础用法 — container-type + @container（可拖动容器宽度）" height="360px" />

<Demo src="/demos/css/at-rules/container/02-card-responsive.html" title="卡片自适应 — 同一卡片在 240px / 460px 容器中分别竖排、横排" height="360px" />

<Demo src="/demos/css/at-rules/container/03-container-name.html" title="命名容器 — 查询 outer 与 inner 两个不同容器" height="360px" />

<Demo src="/demos/css/at-rules/container/04-nested-containers.html" title="嵌套容器 — 命名查找 vs 不写名字的就近匹配" height="360px" />

<Demo src="/demos/css/at-rules/container/05-vs-media-query.html" title="对比 @media — 两个 250px 容器，@media 会误判、@container 不会" height="360px" />
