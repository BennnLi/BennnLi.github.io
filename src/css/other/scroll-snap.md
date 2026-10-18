# Scroll Snap

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap

Scroll Snap 是 CSS 滚动捕捉特性，允许滚动容器在滚动时自动对齐到指定位置。

---

## 为什么需要 Scroll Snap？

以前实现轮播图或分页滚动需要 JavaScript：

```javascript
// 以前的写法：需要 JavaScript
element.scrollTo({
  left: targetPosition,
  behavior: 'smooth'
});
```

Scroll Snap 让这在纯 CSS 中成为可能：

```css
/* 现在的写法：纯 CSS */
.carousel {
  scroll-snap-type: x mandatory;
}

.carousel-item {
  scroll-snap-align: start;
}
```

---

## 语法

### scroll-snap-type

```css
scroll-snap-type: none;       /* 默认，不捕捉 */
scroll-snap-type: x mandatory; /* 水平方向，强制捕捉 */
scroll-snap-type: y mandatory; /* 垂直方向，强制捕捉 */
scroll-snap-type: both mandatory; /* 两个方向，强制捕捉 */
scroll-snap-type: x proximity; /* 水平方向，接近时捕捉 */
```

### scroll-snap-align

```css
scroll-snap-align: start;   /* 对齐到容器起始位置 */
scroll-snap-align: center;  /* 对齐到容器中心 */
scroll-snap-align: end;     /* 对齐到容器结束位置 */
```

### scroll-snap-stop

```css
scroll-snap-stop: normal;  /* 默认，可以跳过 */
scroll-snap-stop: always;  /* 必须停留 */
```

---

## 实际运用

### 1. 水平轮播

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.carousel-item {
  flex: 0 0 100%;
  scroll-snap-align: start;
}
```

### 2. 垂直分页

```css
.pages {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.page {
  height: 100vh;
  scroll-snap-align: start;
}
```

### 3. 图片画廊

```css
.gallery {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  gap: 16px;
}

.gallery img {
  flex: 0 0 auto;
  scroll-snap-align: center;
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 69 |
| Firefox | 68 |
| Safari | 11 |
| Edge | 79 |

Baseline 2018，全浏览器可用。

---

## 注意事项

1. `scroll-snap-type: mandatory` 会强制对齐，`proximity` 会接近时对齐
2. `scroll-snap-align` 用于设置对齐位置
3. `scroll-snap-stop: always` 用于强制停留，避免跳过
4. 需要配合 `overflow: auto` 或 `overflow: scroll` 使用
5. 性能良好，浏览器会优化滚动行为

---

## 相关资源

- [MDN: Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap)
- [CSS Scroll Snap Module Level 1](https://www.w3.org/TR/css-scroll-snap-1/)

---

## 在线示例

<Demo src="/demos/css/other/scroll-snap/01-basic.html" title="基础用法 — Scroll Snap 基础" height="360px" />
