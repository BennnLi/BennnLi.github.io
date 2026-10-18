# oklch() / oklab()

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklab

`oklch()` 和 `oklab()` 是 CSS 颜色模块 Level 4 引入的新色彩空间，基于人类视觉感知设计，比传统的 `hsl()` 和 `rgb()` 更符合人眼对颜色的感知。

---

## 为什么需要 oklch() / oklab()？

传统的 `hsl()` 色彩空间存在一个问题：**改变亮度时，颜色的感知色相会发生偏移**。

```css
/* 传统 hsl — 改变亮度时，颜色会偏色 */
color: hsl(250, 100%, 50%);  /* 蓝色 */
color: hsl(250, 100%, 90%);  /* 亮度提高后，看起来偏紫 */

/* oklch — 改变亮度时，颜色保持一致 */
color: oklch(0.7 0.2 250);   /* 蓝色 */
color: oklch(0.9 0.2 250);   /* 亮度提高后，仍然是蓝色 */
```

---

## 语法

### oklch()

```css
oklch(L C H)
oklch(L C H / A)
```

- **L（Lightness）**：亮度，0-1（或 0%-100%），0 = 黑色，1 = 白色
- **C（Chroma）**：色度/饱和度，0-0.4（无单位），0 = 灰色
- **H（Hue）**：色相，0-360 度
- **A（Alpha）**：透明度，0-1（可选）

### oklab()

```css
oklab(L a b)
oklab(L a b / A)
```

- **L（Lightness）**：亮度，0-1
- **a**：绿-红轴，负值偏绿，正值偏红
- **b**：蓝-黄轴，负值偏蓝，正值偏黄
- **A（Alpha）**：透明度，0-1（可选）

---

## oklch vs oklab

| 色彩空间 | 参数 | 用途 |
|----------|------|------|
| `oklch()` | 亮度、色度、色相 | 直观调整颜色（类似 HSL，但更好） |
| `oklab()` | 亮度、a轴、b轴 | 颜色插值、渐变混合 |

---

## 实际运用

### 1. 设计系统色板

```css
:root {
  /* 品牌色 — oklch 定义 */
  --brand-50:  oklch(0.97 0.02 250);
  --brand-100: oklch(0.93 0.04 250);
  --brand-200: oklch(0.87 0.08 250);
  --brand-300: oklch(0.78 0.12 250);
  --brand-400: oklch(0.68 0.16 250);
  --brand-500: oklch(0.58 0.20 250);
  --brand-600: oklch(0.48 0.20 250);
  --brand-700: oklch(0.38 0.18 250);
  --brand-800: oklch(0.28 0.14 250);
  --brand-900: oklch(0.18 0.10 250);
}
```

### 2. 生成 hover/active 色

```css
.button {
  --base: oklch(0.6 0.2 250);
  background: var(--base);
  transition: background 0.2s;
}

.button:hover {
  /* 降低亮度 = 加深颜色 */
  background: oklch(0.5 0.2 250);
}

.button:active {
  /* 进一步降低亮度 */
  background: oklch(0.4 0.2 250);
}
```

### 3. 无障碍对比度

```css
/* 确保文字与背景的对比度足够 */
.text-on-dark {
  color: oklch(0.95 0.02 250);  /* 浅色文字 */
  background: oklch(0.2 0.1 250);  /* 深色背景 */
}

.text-on-light {
  color: oklch(0.2 0.1 250);  /* 深色文字 */
  background: oklch(0.95 0.02 250);  /* 浅色背景 */
}
```

### 4. 渐变颜色

```css
.gradient {
  background: linear-gradient(
    90deg,
    oklch(0.7 0.2 250),  /* 蓝色 */
    oklch(0.7 0.2 350)   /* 粉色 */
  );
}

/* 锥形渐变 — 色环 */
.color-wheel {
  background: conic-gradient(
    oklch(0.7 0.2 0),
    oklch(0.7 0.2 60),
    oklch(0.7 0.2 120),
    oklch(0.7 0.2 180),
    oklch(0.7 0.2 240),
    oklch(0.7 0.2 300),
    oklch(0.7 0.2 360)
  );
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 111 |
| Firefox | 113 |
| Safari | 15.4 |
| Edge | 111 |

Baseline 2023，全浏览器可用。

---

## 注意事项

1. `oklch()` 的色度（C）范围是 0-0.4，超出范围的颜色会被裁剪
2. `oklch()` 的色相（H）是 0-360 度，与 HSL 类似
3. `oklab()` 的 a、b 轴没有固定范围，通常在 -0.4 到 0.4 之间
4. 在渐变中使用 `oklch()` 或 `oklab()` 可以获得更平滑的颜色过渡
5. 可以与 `color-mix()` 结合使用

---

## 相关资源

- [MDN: oklch()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
- [MDN: oklab()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklab)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
- [OKLCH Color Picker](https://oklch.com/)

---

## 在线示例

<Demo src="/demos/css/colors/oklch-oklab/01-basic.html" title="基础用法 — oklch() 和 oklab() 基本语法" height="360px" />

<Demo src="/demos/css/colors/oklch-oklab/02-design-system.html" title="设计系统 — 用 oklch() 生成色板" height="360px" />

<Demo src="/demos/css/colors/oklch-oklab/03-hover-active.html" title="交互状态 — 用 oklch() 生成 hover/active 色" height="360px" />

<Demo src="/demos/css/colors/oklch-oklab/04-gradient.html" title="渐变 — oklch() 在渐变中的应用" height="360px" />

<Demo src="/demos/css/colors/oklch-oklab/05-accessibility.html" title="无障碍 — 用 oklch() 确保对比度" height="360px" />
