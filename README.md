# 前端笔记站（VitePress + TypeScript）

CSS / JavaScript / Web API 笔记站：**文档与示例直接在 `src/` 中维护**，脚本只负责生成导航与首页。

## 快速开始

```bash
cd site
npm install          # 首次运行

npm run dev          # 生成导航 + 启动开发服务器（默认 http://localhost:5173）
npm run build        # 生成导航 + 构建静态站点到 .vitepress/dist
npm run preview      # 预览构建产物
npm run gen          # 只重新生成导航与首页
npm run typecheck    # vue-tsc 类型检查
```

> **环境要求**：Node **≥ 23**（脚本以 `.ts` 直接运行，依赖 Node 原生类型擦除；实测 v25.2.1）。
>
> **注意**：`npm install` 与 `dev`/`build` 需要执行 esbuild 的子进程，
> 在受限沙箱（禁止管道 spawn 的环境）下会报 `spawn EPERM`，请在普通终端中运行。

## ⭐ 维护方式：一切都在 `src/` 里

**`src/` 就是唯一的文档源**，直接编辑，改完刷新即可。

```
site/src/
├── index.md                      ⚙️ 自动生成（首页，勿手改）
│
├── css/                          ← 大类
│   ├── index.md                  → /css            （CSS 起源与发展）
│   ├── at-rules/
│   │   ├── layer.md              → /css/at-rules/layer
│   │   ├── container.md
│   │   ├── supports.md
│   │   └── ...
│   ├── selectors/  colors/  animations/  values/  other/
│
├── javascript/                   ← 大类
│   ├── index.md                  → /javascript
│   ├── es6.md                    → /javascript/es6
│   ├── es7.md
│   └── ... es17.md
│
├── webapi/                       ← 大类
│   ├── index.md                  → /webapi
│   └── animation.md              → /webapi/animation
│
└── public/
    └── demos/                    ← 示例 HTML 放这里
        ├── css/at-rules/layer/01-basic-layer.html
        └── javascript/...
```

### 侧边栏层级怎么来的

完全由**目录结构**自动推导，不需要手动配置：

| `src/` 下的形式 | 生成的层级 | 示例 |
|----------------|-----------|------|
| `<大类>/index.md` | 大类落地页（分组首项） | `/css` |
| `<大类>/<小节>.md` | 二级条目 | `/javascript/es6` |
| `<大类>/<分类>/index.md` | 分类落地页（分组首项） | `/css/at-rules` |
| `<大类>/<分类>/<特性>.md` | 三级条目 | `/css/at-rules/layer` |

- **条目文字**：`<markdown 首个 # 标题>`（可用 frontmatter 的 `title` 覆盖）
- **分组文字**：取自 `scripts/gen-nav.ts` 的 `GROUP_LABELS`，未配置则用目录名
- **URL**：由目录名逐段拼接（如 `src/webapi/index.md` → `/webapi`），目录名统一用小写
- **排序**：自然排序；可用 `CHILD_ORDER` 显式指定（CSS 分类已配）

### 加一篇文档

1. 在 `src/` 对应位置新建 `.md`，第一行写 `# 标题`
2. 在 `src/public/demos/` 建同名路径的目录，放入示例 HTML
3. 页面里用 `<Demo>` 嵌入示例
4. `npm run dev` —— 侧边栏自动出现新条目

### 加一个新分类 / 新大类

直接建目录即可（会自动识别为分组）。只有想在侧边栏显示**中文分组名**或**指定顺序**时，
才需要去 `scripts/gen-nav.ts` 补 `GROUP_LABELS` / `CHILD_ORDER`。

## 嵌入示例

`<Demo>` 组件已在全局注册：

```md
<Demo src="/demos/css/at-rules/layer/01-basic-layer.html" title="基本层优先级" height="420px" />
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | 必填 | demo 路径，必须以 `/demos/` 开头 |
| `title` | `string` | `''` | 标题栏文字，留空则不显示标题栏 |
| `height` | `string` | `'360px'` | iframe 高度 |

> `public/` 下的文件按原路径对外提供服务：`public/demos/a/b.html` → `/demos/a/b.html`。

## 生成脚本做什么（以及不做什么）

`scripts/gen-nav.ts` **只生成两个文件**：

| 输出 | 内容 |
|------|------|
| `sidebar.gen.ts` | 侧边栏数据（递归扫描 `src/**/*.md`） |
| `src/index.md` | 首页（hero + features，含文档/demo 统计） |

**它不会读取或改写 `src/` 下的任何文档内容** —— 内容完全由你手工维护。

统计口径：`<Demo ...>` 在页面里出现的次数即为该页 demo 数。

## 目录结构（工程）

```
site/
├── package.json
├── tsconfig.json             # strict + erasableSyntaxOnly + verbatimModuleSyntax
├── env.d.ts                  # .vue 模块声明 + vite/client 类型
├── scripts/
│   ├── types.ts              # 共享类型定义
│   └── gen-nav.ts            # ★ 只生成导航与首页
├── .vitepress/
│   ├── config.mts            # 站点配置（导航、侧边栏、本地搜索）
│   └── theme/
│       ├── index.ts          # 注册全局组件（satisfies Theme）
│       └── components/
│           └── Demo.vue      # <Demo> 组件（lang="ts"）
├── src/                      # ★ 文档源码（手工维护）
│   ├── index.md              # ⚙️ 生成
│   ├── css/  javascript/  webapi/
│   └── public/demos/
└── sidebar.gen.ts            # ⚙️ 生成
```

## ⚠️ 与仓库根目录的关系

仓库根目录下的 `CSS/`、`JavaScript/` 是**早期内容**（markdown + `example/`），
本站点不再从它们同步，它们也**不再维护**。仅供历史参考，请勿以其为准。

如需改文档，请改 `site/src/`。

## TypeScript 约定

脚本由 Node 直接执行 `.ts`，受两条约束（`tsconfig.json` 已开启检查，违反会报错）：

- **`erasableSyntaxOnly`** —— 不能用 `enum`、`namespace`、构造函数参数属性等「不可擦除」语法
- **`verbatimModuleSyntax`** —— 类型导入必须写 `import type { X } from '...'`

脚本内部相对导入要带 `.ts` 扩展名（已开启 `allowImportingTsExtensions`）：

```ts
import type { SidebarNode } from './types.ts'
```

## 已启用能力

- ✅ **全文本地搜索** —— 纯前端 minisearch 索引，无需服务端
- ✅ **示例内嵌** —— 85 个 demo 以 iframe 嵌入，可「新窗口打开」
- ✅ **自动三级侧边栏** —— 目录结构驱动
- ✅ **自动本页目录**
- ✅ **深色模式**
- ✅ **代码行号**
- ✅ **严格类型检查**
- ✅ 移动端适配

## 部署

`npm run build` 后把 `.vitepress/dist` 整个目录丢到任意静态托管：

- GitHub Pages / Netlify / Vercel / Cloudflare Pages
- 或本地预览：`npm run preview`

站内使用 `cleanUrls: true`，URL 形如 `/css/at-rules/layer`（无 `.html` 后缀）。
若托管环境不支持无后缀路径，把 `config.mts` 里的 `cleanUrls` 改为 `false`。
