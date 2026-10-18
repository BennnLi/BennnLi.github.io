# color-mix()

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix

`color-mix()` 是 CSS 颜色模块 Level 4 引入的函数，用于在指定的色彩空间中混合两种颜色。

---

## 颜色模型和 css 函数
### RGB
最经典的颜色模型，由红（Red），绿（Green），蓝（Blue）三种颜色占比组成，

1. css 函数 rgb(r, g, b), 0 <= r/g/b <= 255
````css
.font-color {
  color: rgb(12, 44, 56);
}
````

### HSL
由色相(Hue 0-360)、饱和度(Saturation 0-100%)、亮度(lightness 0-100%) 组成
1. css 函数 hsl(h, s, l)
````css
.font-color {
  color: hsl(255, 50%, 50%);
}
````

### HWB
由色相（Hue 0-360）、白度（White 0-100%）、黑度（Black 0-100%）组成
1. css 函数 hwb(h, w, b)
````css
.font-color {
  color: hwb(255, 50%, 50%);
}
````

## 为什么需要 color-mix()？

以前要生成一个颜色的变体（如 hover 色、disabled 色），需要手动计算或使用预处理器：

```scss
/* SCSS 以前的写法 */
$primary: #1a73e8;
$primary-hover: darken($primary, 10%);
$primary-disabled: lighten($primary, 30%);
```

`color-mix()` 让这在原生 CSS 中成为可能：

```css
/* 原生 CSS 现在的写法 */
color-mix(in srgb, var(--primary) 80%, black);  /* hover 色 */
color-mix(in srgb, var(--primary) 30%, white);  /* disabled 色 */
```

---

## 语法

```css
color-mix(in <color-space>, <color1> <percentage1>, <color2> <percentage2>)
```

- `in <color-space>`：混合使用的色彩空间（如 `srgb`、`oklch`、`oklab`、`hsl`、`hwb`）
- `<color1>` 和 `<color2>`：要混合的两种颜色
- `<percentage1>` 和 `<percentage2>`：每种颜色的占比（可选，默认各 50%）

---

## 色彩空间选择

| 色彩空间 | 特点 | 推荐场景 |
|----------|------|----------|
| `srgb` | 默认，标准 RGB | 通用场景 |
| `oklch` | 感知均匀，亮度独立 | **推荐**：颜色变体生成 |
| `oklab` | 感知均匀，适合插值 | 渐变混合 |
| `hsl` | 色相-饱和度-亮度 | 传统 HSL 用户 |
| `hwb` | 色相-白度-黑度 | 直观的颜色混合 |

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 111 |
| Firefox | 113 |
| Safari | 16.2 |
| Edge | 111 |

Baseline 2023，全浏览器可用。

---

## 注意事项

1. 百分比之和不必为 100%，浏览器会自动归一化
2. 如果只指定一个颜色的百分比，另一个默认为 `100% - 指定百分比`
3. `transparent` 是 `color-mix()` 的常用搭档
4. `srgb` 是最常用的色彩空间，兼容性最好
5. 可以嵌套使用 `color-mix()`

---

## 相关资源

- [MDN: color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/#color-mix)

---

## 在线示例

<Demo src="/demos/css/colors/color-mix/01-basic.html" title="基础用法 — 两种颜色混合（srgb 色彩空间）" height="360px" />

<Demo src="/demos/css/colors/color-mix/02-hover-active.html" title="交互状态 — 生成 hover/active/disabled 色" height="360px" />

<Demo src="/demos/css/colors/color-mix/03-transparent.html" title="透明色 — 生成半透明和浅色背景" height="360px" />

<Demo src="/demos/css/colors/color-mix/04-gradient.html" title="渐变混合 — 在渐变中使用 color-mix()" height="360px" />

<Demo src="/demos/css/colors/color-mix/05-theme.html" title="动态主题 — 用 color-mix() 生成主题色变体" height="360px" />
