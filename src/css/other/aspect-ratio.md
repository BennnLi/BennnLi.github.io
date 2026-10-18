# aspect-ratio

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio

`aspect-ratio` 是 CSS 属性，用于指定元素的宽高比，无需再用 `padding-top` 百分比 hack。

---

## 为什么需要 aspect-ratio？

以前实现固定宽高比需要使用 `padding-top` hack：

```css
/* 以前的写法：padding-top hack */
.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 = 9/16 = 56.25% */
}

.video-wrapper video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

`aspect-ratio` 让这变得一行代码：

```css
/* 现在的写法：一行代码 */
.video {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```

---

## 语法

```css
aspect-ratio: <width> / <height>;
```

- `<width>`：宽度比例
- `<height>`：高度比例

---

## 常用宽高比

| 宽高比 | 用途 |
|--------|------|
| `1 / 1` | 正方形 |
| `16 / 9` | 视频、宽屏 |
| `4 / 3` | 传统屏幕 |
| `3 / 2` | 摄影 |
| `2 / 3` | 竖版海报 |

---

## 实际运用

### 1. 视频容器

```css
.video {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}
```

### 2. 头像

```css
.avatar {
  width: 48px;
  aspect-ratio: 1;
  border-radius: 50%;
  object-fit: cover;
}
```

### 3. 卡片图片

```css
.card-image {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: 8px;
}
```

### 4. Grid 网格

```css
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.photo-grid img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}
```

---

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 88 |
| Firefox | 89 |
| Safari | 15 |
| Edge | 88 |

Baseline 2021，全浏览器可用。

---

## 注意事项

1. `aspect-ratio` 只设置宽高比，不设置具体尺寸
2. 需要配合 `width` 或 `height` 使用
3. `object-fit: cover` 用于图片裁剪而非拉伸
4. 可以用于任何元素，不仅仅是图片和视频
5. 替代了以前的 `padding-top` hack

---

## 相关资源

- [MDN: aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)

---

## 在线示例

<Demo src="/demos/css/other/aspect-ratio/01-basic.html" title="基础用法 — aspect-ratio 基础" height="360px" />
