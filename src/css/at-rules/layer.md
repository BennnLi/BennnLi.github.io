# @layer
> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer

CSS `@layer` 用于**声明级联层（cascade layer）**，让开发者可以显式控制样式优先级。

---

## 为什么需要 @layer？

传统的 CSS 优先级由"选择器特异性"和"书写顺序"决定，当一个项目引入多个样式源（第三方库、组件样式、工具类、自定义样式等）时，优先级冲突会非常混乱。

`@layer` 提供了一个更上层的排序机制：**层的顺序决定优先级，而非选择器的特异性或出现顺序。**

---

## 语法

### 1. 声明层顺序（必须放在最前面）

```css
@layer reset, base, components, utilities;
```

这声明了 4 个层，**越靠后优先级越高**：`utilities` > `components` > `base` > `reset`。

### 2. 将样式放入层

**方式一：块级写法**

```css
@layer base {
  h1 { font-size: 2rem; }
  p  { line-height: 1.6; }
}
```

**方式二：@import 时指定层**

```css
@import url('./reset.css') layer(reset);
@import url('antd/dist/antd.css') layer(reset);
```

### 3. 嵌套层

```css
@layer framework {
  @layer base {
    /* framework.base 层 */
  }
  @layer theme {
    /* framework.theme 层 */
  }
}
```

引用嵌套层：`framework.base` 或 `framework.theme`。

### 4. 未分层样式（最高优先级）

没有放在任何 `@layer` 中的样式，优先级**高于所有分层样式**。

```css
/* 这个样式优先级最高，会覆盖任何层中的 `.box` */
.box { color: red; }

@layer components {
  .box { color: blue; } /* 被上面的覆盖 */
}
```

---

## 优先级规则

| 优先级 | 来源 | 说明 |
|--------|------|------|
| 最高 | 未分层样式 | 不在任何层中的普通 CSS |
| ↓ | 后声明的层 | `@layer A, B;` 中 B > A |
| ↓ | 先声明的层 | `@layer A, B;` 中 A 最低 |
| 最低 | 浏览器默认样式 | UA stylesheet |

**关键点**：在同一层内，还是按原来的特异性+书写顺序规则；但**不同层之间，层的顺序是第一优先级**。

---

## 示例：解决第三方库覆盖问题

不用 `@layer` 时：

```css
/* 第三方组件库的样式 —— 选择器特异性很高 */
.ant-btn.ant-btn-primary {
  background: #1677ff;
}

/* 你想覆盖 —— 不得不写更高的特异性 */
.my-app .ant-btn.ant-btn-primary {
  background: #ff4d4f !important; /* 甚至要上 !important */
}
```

用 `@layer` 后：

```css
/* 声明层顺序：第三方库在最底层，自己的样式在高层 */
@layer lib, app;

@layer lib {
  .ant-btn.ant-btn-primary {
    background: #1677ff;
  }
}

@layer app {
  /* 简单选择器也能覆盖 —— 因为 app 层优先级更高 */
  .btn-custom {
    background: #ff4d4f;
  }
}
```

---

## 匿名层

不写层名就是匿名层，每个匿名层都是独立的，不能追加样式：

```css
@layer {
  /* 匿名层，内容无法被后续追加 */
  body { margin: 0; }
}
```

---

## 常用分层方案

```css
@layer reset, base, layout, components, utilities, overrides;
```

| 层名 | 用途 |
|------|------|
| `reset` | CSS Reset / Normalize，第三方库基础样式 |
| `base` | 标签默认样式（h1-h6、a、p 等） |
| `layout` | 布局（header、footer、grid 等） |
| `components` | 组件样式（button、card、modal 等） |
| `utilities` | 工具类（.text-center、.mt-4 等） |
| `overrides` | 覆盖/状态样式（最高优先级） |

---

## 与 SCSS 配合

在 SCSS 中同样可以使用 `@layer`：

```scss
// index.scss —— 声明层顺序
@layer reset, layout, components, utilities, overrides;

@import url('./reset.scss') layer(reset);
@import url('ant-design-vue/es/style/default.css') layer(reset);
@import url('./base.scss') layer(layout);
```

```scss
// components.scss
@layer components {
  .card {
    background: #fff;
    border-radius: 6px;
    padding: 24px;
  }
}
```

---

## 浏览器兼容性

所有现代浏览器均支持：Chrome 99+、Firefox 97+、Safari 15.4+、Edge 99+。

---

## 注意事项

1. `@layer` 的**层顺序声明**必须放在所有样式之前（在 `@import` 之后）
2. `!important` 会反转层优先级 —— 低层级中的 `!important` 优先级高于高层级中的 `!important`
3. 未分层样式优先级最高，适合做最终覆盖

---

## 在线示例

<Demo src="/demos/css/at-rules/layer/01-basic-layer.html" title="基本层优先级 — 同选择器在不同层中，后声明的层胜出" height="360px" />

<Demo src="/demos/css/at-rules/layer/02-selector-vs-layer.html" title="层 vs 选择器特异性 — 层优先级高于选择器特异性" height="360px" />

<Demo src="/demos/css/at-rules/layer/03-lib-override.html" title="覆盖第三方库 — 用层轻松覆盖三方组件库样式" height="360px" />

<Demo src="/demos/css/at-rules/layer/04-unlayered.html" title="未分层样式 — 不在任何层中的样式优先级最高" height="360px" />

<Demo src="/demos/css/at-rules/layer/05-nested-layer.html" title="嵌套层 — 框架级分层（framework.base / framework.theme）" height="360px" />
