# CSS 起源与发展

> 本文梳理 CSS（层叠样式表，Cascading Style Sheets）的诞生背景、版本演进、各版本重要特性、未来趋势，以及标准维护者与浏览器厂商之间的关系。

---

## 目录

1. [CSS 的起源与发展](#1-css-的起源与发展)
2. [各版本重要属性与功能](#2-各版本重要属性与功能)
3. [CSS 未来的发展趋势](#3-css-未来的发展趋势)
4. [CSS 标准维护者与浏览器厂商的关系](#4-css-标准维护者与浏览器厂商的关系)
5. [参考链接](#5-参考链接)

---

## 1. CSS 的起源与发展

### 1.1 诞生背景

在 CSS 出现之前，网页的样式只能通过 HTML 的标签和属性来控制，例如 `<font>`、`<center>`、`bgcolor` 等。这种做法存在严重问题：

- **内容与表现混在一起**：文档结构（HTML）与视觉样式耦合，维护困难。
- **无法复用**：改一个颜色需要逐处修改，无法集中管理。
- **语义被破坏**：为了排版而滥用表格（table layout）和占位图片。

人们迫切需要一种"把内容与表现分离"的机制。

### 1.2 提出者

1994 年，在瑞士 CERN 工作的**哈肯·维姆·莱（Håkon Wium Lie）**提出了层叠样式表的构想，并与**伯特·博斯（Bert Bos）**合作完善。他们的目标是设计一种简单、可层叠、可继承的样式语言，让作者、用户和浏览器都能参与样式的最终确定（这正是"层叠"一词的含义）。

### 1.3 发展时间线

| 时间 | 事件 |
| --- | --- |
| 1994 年 | Håkon Wium Lie 提出 CSS 构想 |
| 1996 年 12 月 | **CSS1** 成为 W3C 推荐标准（Recommendation） |
| 1998 年 5 月 | **CSS2** 成为 W3C 推荐标准 |
| 2000 年代初 | 浏览器大战（browser wars），各厂商对 CSS 支持参差不齐 |
| 2004 年 | CSS2.1 进入候选推荐标准（CR），修正 CSS2 的问题 |
| 2011 年 6 月 | **CSS2.1** 正式成为推荐标准 |
| 1999 年起 | **CSS3** 开始采用"模块化"方式制定，各模块独立演进 |
| 2010–2019 | CSS3 各模块陆续成熟：媒体查询、Flexbox、Grid 等成为推荐标准 |
| 2010 年代至今 | 进入"现代 CSS"时代，模块持续快速迭代，不再以单一版本号发布 |

> 关键转折点：从 CSS3 开始，规范不再以"一个大版本"整体发布，而是拆分为几十个独立**模块（modules）**，每个模块拥有自己的版本号（如 Selectors Level 3、Color Level 4）和独立的发布节奏。因此严格来说，"CSS4"并不存在——现代 CSS 是一组并行演进的模块。

---

## 2. 各版本重要属性与功能

### 2.1 CSS1（1996）

CSS1 奠定了最基本的样式能力，核心是**字体、颜色、文本与盒模型**。

| 类别 | 重要属性 |
| --- | --- |
| 字体 | `font-family`、`font-size`、`font-style`、`font-weight`、`font-variant` |
| 颜色与背景 | `color`、`background-color`、`background-image`、`background-repeat`、`background-position` |
| 文本 | `text-align`、`text-decoration`、`text-indent`、`letter-spacing`、`word-spacing`、`text-transform`、`line-height`、`vertical-align`、`white-space` |
| 盒模型 | `margin`、`padding`、`border`、`width`、`height`、`float`、`clear` |
| 其他 | `display`、`list-style`、`position`（初版） |

### 2.2 CSS2（1998）

CSS2 在 CSS1 基础上大幅扩展，引入**定位、媒体查询雏形、伪类和生成内容**等能力。

| 类别 | 重要属性 / 功能 |
| --- | --- |
| 定位 | `position` 的 `absolute` / `relative` / `fixed`、`z-index`、`clip` |
| 媒体类型 | `@media`（媒体类型雏形，针对屏幕、打印等） |
| 伪类与伪元素 | `:hover`、`:active`、`:focus`、`:first-child`、`:first-line`、`:first-letter`、`:before`、`:after` |
| 生成内容 | `content`（配合 `:before` / `:after`） |
| 表格显示 | `display: table` 系列（`table-row`、`table-cell` 等） |
| 字体 | `@font-face`、`@import`、`@page` |
| 其他 | `outline`、`cursor`、`visibility`、`overflow`、双向文本（bidi）支持 |

### 2.3 CSS2.1（2004 CR → 2011 Rec）

CSS2.1 是对 CSS2 的**修订与澄清**，删除了浏览器未实现或实现不一致的特性，明确了盒模型、定位上下文、层叠与继承等细节。它是后来很长一段时间内浏览器实现的"对齐基准"。

### 2.4 CSS3（模块化，2010 年代陆续成熟）

CSS3 不是单一版本，而是一批模块。以下是其中影响最大的几个：

#### 选择器（Selectors Level 3）
- 属性选择器增强：`[attr^=]、[attr$=]、[attr*=]`
- 结构伪类：`:nth-child()`、`:nth-of-type()`、`:first-of-type`、`:last-child`、`:only-child`、`:empty`
- 目标与排除：`:target`、`:not()`
- 兄弟组合器：`~`（通用兄弟组合器）
- 伪元素改用双冒号：`::before`、`::after`

#### 颜色与透明度（Color Level 3）
- `rgba()`、`hsl()`、`hsla()`、`opacity`、`currentColor`

#### 背景与边框（Backgrounds and Borders Level 3）
- 多背景：多个 `background-image` 叠加
- `background-size`、`background-origin`、`background-clip`
- `border-radius`（圆角）、`border-image`、`box-shadow`

#### 文本（Text Level 3）
- `text-shadow`、`text-overflow`、`word-wrap` / `overflow-wrap`、`hyphens`

#### 媒体查询（Media Queries Level 3）—— 响应式设计的基石
- `@media` 结合 `min-width`、`max-width`、`orientation` 等条件，让同一页面适配不同设备

#### 弹性布局（Flexbox Level 1，2017 Rec）
- 容器：`display: flex`、`flex-direction`、`flex-wrap`、`justify-content`、`align-items`、`align-content`
- 子项：`flex-grow`、`flex-shrink`、`flex-basis`、`flex`、`order`、`align-self`

#### 网格布局（Grid Layout Level 1，2017 Rec）
- `display: grid`、`grid-template-columns`、`grid-template-rows`、`grid-template-areas`
- `grid-column`、`grid-row`、`grid-area`、`gap`、`fr` 单位、`minmax()`

#### 变换、过渡与动画
- 变换（Transforms）：`transform`、`rotate()`、`translate()`、`scale()`、`skew()`、`transform-origin`
- 过渡（Transitions）：`transition`、`transition-property`、`transition-duration`、`transition-timing-function`、`transition-delay`
- 动画（Animations）：`@keyframes`、`animation-*`

#### 其他重要模块
- **多列布局**：`column-count`、`column-width`、`column-gap`
- **字体（Fonts Level 3）**：`@font-face` 增强、`font-feature-settings`、`font-variant`
- **书写模式**：`writing-mode`、`direction`、`text-orientation`
- **混合与合成**：`mix-blend-mode`、`background-blend-mode`
- **滤镜**：`filter`、`backdrop-filter`
- **自定义属性 / 变量（Custom Properties）**：`--name`、`var()`
- **值与单位（Values and Units Level 3）**：`calc()`、`rem`、`vw` / `vh` / `vmin` / `vmax`、`ch`

### 2.5 现代 CSS（2019 年至今，持续演进）

这一时期 CSS 能力爆发式增长，各模块在浏览器中快速落地：

| 特性 | 说明 |
| --- | --- |
| **级联层 `@layer`** | 显式控制样式优先级，解决大型项目中的级联冲突 |
| **`:is()` / `:where()` / `:has()`** | `:has()` 被称为"父选择器"，极大提升选择能力 |
| **容器查询 `@container`** | 根据容器尺寸（而非视口）进行响应式设计 |
| **CSS 嵌套（Nesting）** | 允许选择器嵌套书写，减少重复 |
| **子网格 `subgrid`** | 子元素继承父网格轨道 |
| **逻辑属性** | `margin-inline`、`padding-block`、`inset` 等，适应不同书写方向 |
| **独立变换属性** | `translate`、`rotate`、`scale` 作为独立属性 |
| **锚点定位（Anchor Positioning）** | `anchor()`、`position-anchor` 等，让元素相对其他元素定位（弹出层、工具提示） |
| **视图过渡（View Transitions）** | `view-transition-name`、`::view-transition`，实现页面/元素切换动画 |
| **滚动驱动动画** | `scroll-timeline`、`animation-timeline`，动画随滚动进度播放 |
| **滚动捕捉** | `scroll-snap-type`、`scroll-snap-align` |
| **现代颜色** | `oklch()`、`oklab()`、`color-mix()`、相对颜色语法、宽色域 `color(display-p3)` |
| **数学函数** | `min()`、`max()`、`clamp()`、`round()`、`mod()`、`rem()` |
| **`@property`** | 注册自定义属性的类型，使其可过渡、可动画 |
| **`@scope`** | 限定样式作用范围 |
| **渐变增强** | `conic-gradient()`、`repeating-*-gradient` |
| **文本排版** | `text-wrap: balance` / `pretty`、`font-size-adjust` |
| **其他实用属性** | `aspect-ratio`、`gap`（Flexbox 中）、`accent-color`、`:focus-visible`、`content-visibility` |

---

## 3. CSS 未来的发展趋势

### 3.1 布局能力继续增强
- **瀑布流布局（Masonry）**：原生的 masonry 布局正在 CSS 网格规范中讨论与实现，有望替代依赖 JavaScript 的方案。
- **更精细的容器查询**：样式查询（style queries）允许基于容器自身的样式值（如自定义属性）做响应。
- **锚点定位与弹出层成熟化**：让弹出层、下拉菜单、工具提示的定位更原生、更健壮。

### 3.2 设计系统友好化
- **CSS 原生 mixin 与函数（`@mixin` / `@function`）**：正在讨论中，有望原生支持样式的复用与抽象，减少对预处理器的依赖。
- **`@property` 与类型化自定义属性**：让 CSS 变量具备类型、默认值、继承控制和动画能力。
- **级联层 `@layer` 与作用域 `@scope` 普及**：帮助大型项目管理样式冲突与隔离。

### 3.3 动态与交互能力提升
- **滚动驱动动画与视图过渡**：从"基于时间的动画"走向"基于滚动与视图状态"的动画，减少 JS 动画开销。
- **状态查询 `scroll-state()`、`@starting-style`** 等：让进入/离开过渡、悬停前初始状态等更易表达。
- **CSS 与无障碍深度融合**：`prefers-reduced-motion`、`prefers-color-scheme`、`prefers-contrast` 等用户偏好媒体特性持续扩展。

### 3.4 颜色与视觉的现代化
- **宽色域与色彩空间**：`oklch()`、`oklab()`、`color(display-p3)` 等让色彩更符合人眼感知，适配现代显示器。
- **相对颜色语法与 `color-mix()`**：让颜色计算更直观。
- **`light-dark()` 函数**：更优雅地处理亮/暗主题。

### 3.5 性能与工程化
- **`content-visibility` 与渲染包含**：跳过屏幕外内容的渲染，提升长页面性能。
- **CSS 原生能力替代部分 JS**：动画、布局、颜色计算等越来越多可由 CSS 完成，减少主线程负担。
- **浏览器互操作性（Interop）**：通过统一测试和协作，缩小各浏览器行为差异（见下节）。

### 3.6 总体方向
CSS 正从"描述静态样式"走向"表达能力接近编程语言的样式系统"，同时保持声明式、可访问、性能友好的核心特质。未来的重点不是推出一个大版本（CSS4），而是**持续、模块化、跨浏览器一致**地演进。

---

## 4. CSS 标准维护者与浏览器厂商的关系

### 4.1 谁来维护 CSS 标准？

CSS 标准由 **W3C（万维网联盟）下的 CSS 工作组（CSS Working Group，CSS WG）** 维护。CSS WG 负责编写和修订各模块规范（Specification）。

与相关标准组织的关系：

| 组织 | 职责 |
| --- | --- |
| **W3C CSS Working Group** | 制定、维护 CSS 规范 |
| **WHATWG** | 负责 HTML、DOM 等"活标准"（living standard） |
| **TC39** | 负责 ECMAScript（JavaScript）标准 |
| **web-platform-tests（WPT）** | 跨浏览器的共享测试套件，用于验证标准实现 |

### 4.2 浏览器厂商的双重身份

浏览器厂商（Google / Chrome、Mozilla / Firefox、Apple / Safari、Microsoft / Edge，以及 Brave、Opera 等）在 CSS 标准中扮演**双重角色**：

1. **标准制定者**：浏览器厂商的工程师是 CSS WG 的核心成员，通常还是各规范的主编（Editor）。例如 Grid、Flexbox 等规范的编辑就来自 Mozilla、Google 等公司。因此标准并非"由外部强加给厂商"，而是厂商深度参与、共同撰写的产物。

2. **标准实现者**：厂商在自己浏览器中实现规范。规范的最终发布往往以"已有两个独立实现并通过互操作测试"为前提。

### 4.3 标准制定流程（W3C 过程）

一个 CSS 模块大致经历以下阶段：

```
编辑草案（Editor's Draft）
   → 工作草案（WD, Working Draft）
   → 候选推荐标准（CR, Candidate Recommendation）
   → 建议推荐标准（PR, Proposed Recommendation）
   → 推荐标准（REC, Recommendation）
```

关键规则：进入**候选推荐标准（CR）**并最终成为推荐标准，通常要求**至少两个独立、互操作的实现**通过测试。这确保了标准不是"纸上谈兵"，而是可落地、跨浏览器一致的。

### 4.4 双向影响：标准与实现相互塑造

- **标准 → 浏览器**：厂商依据规范实现功能。
- **浏览器 → 标准**：厂商在实际实现中发现的问题会以 issue 形式反馈到规范（如 [w3c/csswg-drafts](https://github.com/w3c/csswg-drafts)），推动规范修订。这被称为"实现驱动的标准化"。
- **先实现后标准（ship-to-standard / 反向标准化）**：有时浏览器会先实验性地实现某特性，经过开发者反馈和跨厂商讨论后再正式纳入标准（例如早期的 `-webkit-` 前缀特性、后续的 anchor positioning 等）。

### 4.5 历史教训：前缀与碎片化

浏览器大战时期，各厂商为抢占先机，在实验性属性前加厂商前缀：`-webkit-`、`-moz-`、`-ms-`、`-o-`。这导致：

- 同一功能需要写多份前缀代码，维护痛苦。
- 某些 `-webkit-` 特性被大量网站依赖，其他浏览器被迫"兼容性实现"（成为事实标准）。

现代浏览器更倾向于通过**特性开关（feature flag）** 或 **`@supports`** 检测来实验，而非大规模滥用前缀。

### 4.6 当代协作机制：Interop 与共享测试

近年来，厂商协作进入新阶段：

- **web-platform-tests（WPT）**：一套共享的跨浏览器测试套件，用于客观衡量标准实现的一致性。
- **Interop 项目（2022 年起，逐年推进）**：由 Google、Mozilla、Apple、Microsoft 等共同参与，每年选定一批"痛点特性"（如 Grid、`:has()`、容器查询、颜色函数等），集中攻关，目标是让这些特性在所有主流浏览器中**行为一致**。
- **CSS WG GitHub 开放讨论**：任何开发者都可在 [w3c/csswg-drafts](https://github.com/w3c/csswg-drafts) 上提出 issue、参与讨论。

### 4.7 一句话总结

> CSS 标准由 **W3C CSS 工作组**制定，而工作组的核心成员和规范编辑主要来自**浏览器厂商**；厂商既是标准的撰写者，也是实现者，标准与浏览器实现之间是**相互塑造、双向反馈**的共生关系，并通过共享测试套件（WPT）和 Interop 项目持续收敛差异、保证互操作性。

---

## 5. 参考链接

- [W3C CSS Working Group](https://www.w3.org/Style/CSS/)
- [CSS 规范草稿仓库 w3c/csswg-drafts（GitHub）](https://github.com/w3c/csswg-drafts)
- [web-platform-tests（WPT）](https://github.com/web-platform-tests/wpt)
- [Interop 2025 项目](https://raw.githubusercontent.com/web-platform-tests/interop/1c88a5837cf342594783dc49fc1159dcddc114bd/2025/README.md)
- [Interop 2026（CSS-Tricks）](https://css-tricks.com/interop-2026/)
- [Masonry: Watching a CSS Feature Evolve（CSS-Tricks）](https://css-tricks.com/masonry-watching-a-css-feature-evolve/)
- [Chrome for Developers：CSS 和界面](https://developer.chrome.com/docs/css-ui)

---

*文档生成日期：2026 年 7 月。CSS 标准持续演进，具体特性支持情况请以 [caniuse.com](https://caniuse.com) 和各模块最新规范为准。*
