# @import

> MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@import

CSS `@import` 用于**从其他样式表导入样式规则**。它必须出现在样式表的**最顶部**，在所有其他规则（`@charset` 除外）之前。

---

## 为什么需要 @import？

当一个项目的样式越来越多时，把所有 CSS 写在一个文件里会变得难以维护。`@import` 让你可以把样式拆分成多个文件，从一个入口文件引入它们。

```css
/* style.css —— 入口文件 */
@import url('./reset.css');
@import url('./variables.css');
@import url('./components/button.css');
@import url('./components/modal.css');
@import url('./utilities.css');

/* 自己的样式 */
body { font-family: sans-serif; }
```

---

## 语法

### 1. 基本形式

```css
@import url('./reset.css');
@import './reset.css';             /* url() 可以省略 */
@import url('./reset.css') screen; /* 带媒体查询 */
```

### 2. 指定层（与 @layer 配合）

```css
/* 导入并放入指定层 */
@import url('./reset.css') layer(reset);
@import url('antd/dist/antd.css') layer(reset);
```

### 3. 指定媒体查询

```css
/* 仅在屏幕宽度 ≤ 768px 时导入 */
@import url('./mobile.css') (max-width: 768px);

/* 仅在打印时导入 */
@import url('./print.css') print;

/* 多个条件 */
@import url('./dark.css') screen and (prefers-color-scheme: dark);
```

### 4. supports() 条件

```css
/* 仅在浏览器支持某种特性时导入 */
@import url('./grid.css') supports(display: grid);
@import url('./oklch.css') supports(color: oklch(0 0 0));
```

---

## 必须放在最顶部

`@import` 必须在所有普通规则之前（`@charset` 除外），否则会被忽略：

```css
/* ✅ 正确 */
@import url('./reset.css');
body { margin: 0; }
```

```css
/* ❌ 错误 —— @import 不在最顶部 */
body { margin: 0; }
@import url('./reset.css'); /* 这行会被忽略 */
```

---

## 与 `<link>` 标签的对比

| | `<link>` | `@import` |
|---|---|---|
| **位置** | HTML `<head>` 内 | CSS 文件顶部 |
| **加载方式** | 并行下载 | 串行下载（必须先下载包含它的 CSS 文件） |
| **性能** | 更快 | 多一层请求链，可能阻塞渲染 |
| **灵活性** | 不支持 `layer()` / `supports()` | 支持 `layer()` / `supports()` / 媒体查询 |
| **使用场景** | 页面主样式 | 组织 CSS 模块、条件加载 |

**建议**：页面主要样式用 `<link>` 以获得更好的加载性能；CSS 模块拆分/条件导入用 `@import`。

---

## 实际用法示例

### 场景一：组织模块化样式

```
styles/
├── index.css        ← 入口，只写 @import
├── reset.css
├── variables.css
├── base.css
├── components/
│   ├── button.css
│   ├── card.css
│   └── modal.css
└── utilities.css
```

```css
/* index.css */
@import url('./reset.css') layer(reset);
@import url('./variables.css') layer(base);
@import url('./base.css') layer(base);
@import url('./components/button.css') layer(components);
@import url('./components/card.css') layer(components);
@import url('./components/modal.css') layer(components);
@import url('./utilities.css') layer(utilities);
```

### 场景二：条件加载暗色主题

```css
/* 默认亮色主题 */
@import url('./theme-light.css');

/* 系统偏好暗色时加载暗色主题 */
@import url('./theme-dark.css') (prefers-color-scheme: dark);
```

### 场景三：渐进增强

```css
/* 基础样式（所有浏览器） */
@import url('./base.css');

/* 支持 grid 的浏览器加载增强布局 */
@import url('./grid-layout.css') supports(display: grid);

/* 支持 OKLCH 的浏览器加载高饱和颜色 */
@import url('./vivid-theme.css') supports(color: oklch(0 0 0));
```

---

## 与 `@layer` 配合的细节

```css
/* 声明层顺序 */
@layer reset, base, components, utilities;

/* 将外部样式导入到指定层 */
@import url('./reset.css') layer(reset);
@import url('https://cdn.com/lib.css') layer(reset);
```

**注意**：`@import url(...) layer(层名)` 会自动创建该层（如果还没声明的话），但层顺序由首次出现的位置决定。建议先显式声明所有层顺序，再导入。

---

## 性能注意事项

1. **`@import` 是串行加载的** —— 浏览器必须先下载并解析包含 `@import` 的 CSS 文件，才能发现需要导入的其他文件，这会产生请求链
2. **深层嵌套的 `@import` 会显著延迟渲染** —— A 导入 B，B 又导入 C...浏览器需要逐层发现
3. **媒体查询的 `@import` 仍然是下载的** —— 只是条件不满足时不应用，但文件仍会被下载
4. **生产环境建议用打包工具**（Webpack/Vite/PostCSS）将 `@import` 合并为单一文件，避免多次请求

---

## 浏览器兼容性

所有浏览器均支持，是最古老的 CSS at-rule 之一。

---

## 注意事项

1. `@import` 必须在所有规则之前（`@charset` 除外），否则会被忽略
2. `@import` 不能在条件规则（`@media`、`@supports`）内部使用
3. `@import url()` 中的 URL 相对于当前样式表文件，不是 HTML 页面
4. 同一个 URL 多次 `@import` 会导致重复下载和重复应用（没有自动去重）
5. CSS 预处理器的 `@import`（SCSS/Less）行为与原生 CSS 不同 —— 预处理器会在编译时内联文件，而原生 CSS 是运行时发起 HTTP 请求

---

## 在线示例

<Demo src="/demos/css/at-rules/import/01-basic-import/index.html" title="01-basic-import" height="360px" />

<Demo src="/demos/css/at-rules/import/02-import-layer/index.html" title="02-import-layer" height="360px" />

<Demo src="/demos/css/at-rules/import/03-media-import/index.html" title="03-media-import" height="360px" />

<Demo src="/demos/css/at-rules/import/04-modular-css/index.html" title="04-modular-css" height="360px" />

<Demo src="/demos/css/at-rules/import/05-prefer-color-scheme/index.html" title="05-prefer-color-scheme" height="360px" />
