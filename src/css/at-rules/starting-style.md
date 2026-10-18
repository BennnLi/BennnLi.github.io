# @starting-style
> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style

## 一句话概括

`@starting-style` 让元素**首次出现时也能播放过渡动画**。

---

## @starting-style 的作用

CSS 过渡（`transition`）的正常工作流程是：

```
状态 A（旧值）  ──transition──▶  状态 B（新值）
```

浏览器需要知道"从哪来"和"到哪去"两个状态，才能计算中间帧。但当一个元素刚刚被创建、或刚从 `display:none` 变为可见时，它**没有"之前的状态"**——元素在 DOM 中不存在或不可见，浏览器也就没有它的计算样式。所以过渡直接跳到最终值，没有任何动画。

`@starting-style` 就是手动告诉浏览器**"从哪来"**：在元素第一次渲染之前，先用你指定的样式作为起点，然后过渡到元素正常定义的样式。

```
@starting-style 中定义的状态（起点）  ──transition──▶  CSS 规则中定义的状态（终点）
```

---

## 为什么需要 @starting-style？

### 问题一：`display:none` 阻碍过渡

这是最常见的痛点。当元素从 `display:none` 切换到 `display:block`（或 `flex`、`grid`）：

```css
.modal {
  opacity: 1;
  transition: opacity 0.3s;
}
.modal.hidden {
  display: none;
  opacity: 0;
}
```

通过 JS 移除 `.hidden` 后，元素直接以 `opacity: 1` 出现，**没有任何过渡**。

**原因**：`display:none` 的元素不在渲染树中。当你把 `display` 切为 `block` 时，浏览器是"第一次"看到这个元素 —— 它没有这个元素"上一帧"的任何信息。没有起点，过渡就无法计算。

### 问题二：JS 动态插入的元素

```js
const div = document.createElement('div')
div.className = 'card'
document.body.appendChild(div)
```

`div` 加入 DOM 的瞬间，浏览器直接使用 `.card` 的最终样式渲染，没有任何入场效果。要让新元素有动画，以前必须用 JS 分两步操作并强制回流（见下文对比）。

### 问题三：页面首次加载

页面初次渲染时，所有元素都是"新的"，没有任何过渡。想让首屏元素有入场动画，`@starting-style` 是最直接的方式。

---

## `@starting-style` 如何解决

```css
/* 正常状态（终点） */
.modal {
  display: block;
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s, transform 0.3s;
}

/* 起始状态（起点）：浏览器在渲染第一帧前先读这里 */
@starting-style {
  .modal {
    opacity: 0;
    transform: scale(0.8);
  }
}
```

**工作流程**：

1. 元素从 `display:none` 变为 `display:block`
2. 浏览器发现元素有 `@starting-style`，**先用起始状态渲染第一帧**
3. 浏览器用正常的 `.modal` 样式渲染目标状态
4. `transition` 检测到属性差异，生成过渡动画

对于 JS 动态插入的元素，流程相同 —— `appendChild` 后浏览器自动完成以上步骤。

---

## 语法

```css
@starting-style {
  selector {
    /* 初始状态 */
  }
}
```

- `@starting-style` 是一个独立的 at-rule，不能嵌套在其他规则内
- 其中的选择器与普通 CSS 选择器完全一样
- 只在元素**首次渲染**或**从 `display:none` 切换为可见**时生效
- 元素已经渲染后再修改属性，`@starting-style` 不会再次触发

---

## 基础示例

```css
.card {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.4s, transform 0.4s;
}

@starting-style {
  .card {
    opacity: 0;
    transform: translateY(20px);
  }
}
```

刷新页面时，`.card` 从透明、下偏 20px 的位置淡入滑上。

---

## 使用场景

| 场景 | 触发时机 | 起点示例 |
|------|----------|----------|
| 弹窗打开 | `display:none` → `display:block` | `opacity:0; scale(0.9)` |
| JS 插入元素 | `appendChild()` | `opacity:0; translateY(10px)` |
| 首屏加载 | 页面首次渲染 | `opacity:0; translateY(20px)` |
| Toast 弹出 | 动态创建后插入 | `opacity:0; translateX(100%)` |
| Tab 切换内容 | `display:none` → 可见 | `opacity:0` |
| 路由页面切换 | 新 DOM 挂载 | `opacity:0; translateY(10px)` |

---

## 注意事项

1. **只在元素"诞生"时触发** —— 元素首次渲染或从 `display:none` 出现。已存在的元素的属性修改不会触发 `@starting-style`
2. **必须配合过渡使用** —— 如果没有 `transition` 或 `animation`，`@starting-style` 定义了起点也没意义
3. **不参与级联** —— `@starting-style` 的样式只用于确定过渡起点，不改变元素的最终计算样式
4. **浏览器兼容性** — Chrome 117+、Edge 117+、Safari 17.4+、Firefox 129+

---

## 对比：以前的做法 vs @starting-style

**以前 —— 必须用 JavaScript：**

```js
// 三步曲线救国
el.style.display = 'block'
el.style.opacity = '0'         // 1. 手动设起点
el.getBoundingClientRect()     // 2. 强制回流（让浏览器应用上一步）
el.style.opacity = '1'         // 3. 设终点，过渡终于触发
el.style.transition = 'opacity 0.3s'
```

这三个步骤缺一不可。没有第 2 步的强制回流，浏览器会把两次 `opacity` 赋值合并，相当于什么也没做。

**现在 —— 纯 CSS：**

```css
.modal {
  display: block;
  opacity: 1;
  transition: opacity 0.3s;
}

@starting-style {
  .modal { opacity: 0; }
}
```

JS 只需要切换类名或 `display`，剩下的浏览器全自动处理。

---

---

## 在线示例

<Demo src="/demos/css/at-rules/starting-style/01-starting-style-basic.html" title="入场动画 — 页面加载时元素从下方淡入" height="360px" />

<Demo src="/demos/css/at-rules/starting-style/02-display-transition.html" title="display:none 过渡 — 弹窗显示/隐藏的淡入缩放效果" height="360px" />

<Demo src="/demos/css/at-rules/starting-style/03-list-insert.html" title="动态插入 — JS 插入新元素时自动从左侧滑入" height="360px" />

<Demo src="/demos/css/at-rules/starting-style/04-theme-switch.html" title="主题切换 — 切换暗色模式时卡片有过渡效果" height="360px" />

<Demo src="/demos/css/at-rules/starting-style/05-staggered.html" title="错位入场 — 多个元素用不同 delay 实现依次出现" height="360px" />
