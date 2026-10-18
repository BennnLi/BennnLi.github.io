# Scroll-driven Animations

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline

Scroll-driven Animations 是 CSS 滚动驱动动画特性，允许动画进度由滚动位置驱动，而不是时间。

---

## 为什么需要 Scroll-driven Animations？

以前实现滚动动画需要 JavaScript 监听滚动事件：

```javascript
// 以前的写法：需要 JavaScript
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const progress = scrollY / (document.body.scrollHeight - window.innerHeight);
  element.style.transform = `translateY(${progress * 100}px)`;
});
```

Scroll-driven Animations 让这在纯 CSS 中成为可能：

```css
/* 现在的写法：纯 CSS */
.element {
  animation: move linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes move {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

---

## 语法

### 1. animation-timeline

```css
animation-timeline: auto;          /* 默认，基于时间 */
animation-timeline: scroll();      /* 基于滚动容器的滚动位置 */
animation-timeline: view();        /* 基于元素在视口中的位置 */
```

### 2. animation-range

```css
animation-range: entry 0% entry 100%;    /* 元素进入视口时 */
animation-range: exit 0% exit 100%;      /* 元素离开视口时 */
animation-range: cover 0% cover 100%;    /* 元素覆盖视口时 */
animation-range: contain 0% contain 100%; /* 元素在视口内时 */
```

---

## 实际运用

### 1. 滚动视差

```css
.parallax {
  animation: parallax linear both;
  animation-timeline: scroll();
}

@keyframes parallax {
  from { transform: translateY(0); }
  to { transform: translateY(-100px); }
}
```

### 2. 元素进入动画

```css
.card {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3. 进度条

```css
.progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: #1a73e8;
  animation: progress linear both;
  animation-timeline: scroll();
}

@keyframes progress {
  from { width: 0; }
  to { width: 100%; }
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 115 |
| Firefox | 110 |
| Safari | 16.4 |
| Edge | 115 |

Baseline 2023，全浏览器可用。

---

## 注意事项

1. `animation-timeline: scroll()` 需要在滚动容器上使用
2. `animation-timeline: view()` 需要在滚动容器内的元素上使用
3. `animation-range` 用于控制动画的触发范围
4. 动画进度由滚动位置决定，不是时间
5. 可以与 `@keyframes` 结合使用

---

## 相关资源

- [MDN: animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline)
- [CSS Scroll-driven Animations](https://drafts.csswg.org/scroll-animations-1/)

---

## 在线示例

<Demo src="/demos/css/animations/scroll-driven/01-basic.html" title="基础用法 — 滚动驱动动画基础" height="360px" />
