# light-dark()

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark

`light-dark()` 是 CSS 颜色模块 Level 4 引入的函数，用于根据系统的亮色/暗色主题自动选择颜色。

---

## 为什么需要 light-dark()？

以前实现亮暗主题切换需要写两套样式：

```css
/* 以前的写法 */
:root {
  --bg: #fff;
  --text: #333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111;
    --text: #eee;
  }
}
```

`light-dark()` 让这变得一行代码：

```css
/* 现在的写法 */
:root {
  color-scheme: light dark;
  --bg: light-dark(#fff, #111);
  --text: light-dark(#333, #eee);
}
```

---

## 语法

```css
light-dark(light-color, dark-color)
```

- `light-color`：亮色模式下使用的颜色
- `dark-color`：暗色模式下使用的颜色

---

## 前提条件

使用 `light-dark()` 需要在元素上设置 `color-scheme` 属性：

```css
:root {
  color-scheme: light dark;  /* 同时支持亮色和暗色 */
}
```

---

## 实际运用

### 1. 基础主题切换

```css
:root {
  color-scheme: light dark;
  --bg: light-dark(#ffffff, #111111);
  --text: light-dark(#333333, #eeeeee);
  --border: light-dark(#dddddd, #333333);
}

body {
  background: var(--bg);
  color: var(--text);
}
```

### 2. 组件主题

```css
.card {
  background: light-dark(#ffffff, #1a1a1a);
  border: 1px solid light-dark(#dddddd, #333333);
  color: light-dark(#333333, #eeeeee);
}

.button {
  background: light-dark(#1a73e8, #8ab4f8);
  color: light-dark(#ffffff, #111111);
}
```

### 3. 链接和交互元素

```css
a {
  color: light-dark(#1a73e8, #8ab4f8);
}

a:hover {
  color: light-dark(#1557b0, #aecbfa);
}

input {
  background: light-dark(#ffffff, #1a1a1a);
  border: 1px solid light-dark(#dddddd, #333333);
  color: light-dark(#333333, #eeeeee);
}
```

### 4. 阴影和边框

```css
.card {
  box-shadow: light-dark(
    0 2px 8px rgba(0,0,0,0.1),
    0 2px 8px rgba(0,0,0,0.3)
  );
}

.divider {
  border-bottom: 1px solid light-dark(#eeeeee, #333333);
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 123 |
| Firefox | 120 |
| Safari | 17.5 |
| Edge | 123 |

Baseline 2024，全浏览器可用。

---

## 注意事项

1. 必须在元素上设置 `color-scheme: light dark` 才能使用
2. `light-dark()` 只能用于颜色值，不能用于其他属性
3. 可以与 `@media (prefers-color-scheme: dark)` 结合使用
4. 浏览器会根据系统的主题自动选择对应的颜色
5. 可以通过 JS 动态修改 `color-scheme` 属性来切换主题

---

## 相关资源

- [MDN: light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/#light-dark)

---

## 在线示例

<Demo src="/demos/css/colors/light-dark/01-basic.html" title="基础用法 — 系统主题自动切换" height="360px" />

<Demo src="/demos/css/colors/light-dark/02-components.html" title="组件主题 — 卡片、按钮等组件主题切换" height="360px" />
