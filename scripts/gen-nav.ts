/**
 * 扫描 site/src 下的 Markdown，生成导航与首页：
 *   1. sidebar.gen.ts  —— 侧边栏数据
 *   2. src/index.md    —— 首页（hero + features）
 *
 * ⚠️ 本脚本**只生成这两个文件**，不会读取或改写 src 下的任何文档内容。
 *    所有文档与示例都直接在 site/src 中维护。
 *
 * 侧边栏层级来自目录结构：
 *   src/<大类>/index.md              → 大类落地页（如 /css）
 *   src/<大类>/<小节>.md             → 二级小节（如 /javascript/es6）
 *   src/<大类>/<分类>/<特性>.md      → 三级特性（如 /css/at-rules/layer）
 *
 * 运行：node scripts/gen-nav.ts   （Node 23+ 原生支持 TS 类型擦除）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { GroupResult, GroupStats, PageMeta, SidebarNode } from './types.ts'

// ── 路径 ───────────────────────────────────────────
const here = path.dirname(fileURLToPath(import.meta.url))
const SITE = path.resolve(here, '..')
const SRC = path.join(SITE, 'src')

/** 不参与扫描的目录 */
const SKIP_DIRS = new Set(['public', 'node_modules', '.vitepress', 'assets'])

/**
 * 分组显示名。键为「相对 src 的 URL 路径」。
 * 未配置的分组退回目录名（连字符转空格、首字母大写）。
 */
const GROUP_LABELS: Readonly<Record<string, string>> = {
  css: 'CSS',
  javascript: 'JavaScript',
  'css/at-rules': 'At-Rules 条件规则与作用域',
  'css/selectors': '选择器增强',
  'css/colors': '颜色与主题',
  'css/animations': '动画与过渡',
  'css/values': '值与函数',
  'css/other': '其他实用特性',
}

/**
 * 子项排序。键为父级 URL 路径，值为期望的子项顺序（目录名或 md 文件名去掉扩展名）。
 * 未列出的按名称自然排序。
 */
const CHILD_ORDER: Readonly<Record<string, readonly string[]>> = {
  css: ['at-rules', 'selectors', 'colors', 'animations', 'values', 'other'],
  // javascript: es6…es17 自然排序即正确，无需配置
}

// ── 小工具 ─────────────────────────────────────────
const natSort = (a: string, b: string): number => a.localeCompare(b, 'en', { numeric: true })

/** URL 片段：小写化，如 'CSS' → 'css' */
const urlSegment = (name: string): string => name.toLowerCase()

/** 目录名兜底标题：'some-thing' → 'Some Thing' */
const prettify = (name: string): string =>
  name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

/** 按期望顺序排列，未列出的排在其后 */
function ordered(names: readonly string[], preferred: readonly string[]): string[] {
  const rank = new Map(preferred.map((name, index) => [name, index]))
  return [...names].sort((a, b) => {
    const ra = rank.get(a) ?? Number.MAX_SAFE_INTEGER
    const rb = rank.get(b) ?? Number.MAX_SAFE_INTEGER
    return ra === rb ? natSort(a, b) : ra - rb
  })
}

/** 去掉 Markdown 强调、反引号、链接语法，压成单行纯文本 */
function plain(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 取侧边栏显示文本：
 * frontmatter 的 title > 首个一级标题 > 文件名
 */
function extractTitle(text: string, fallback: string): string {
  const fmTitle = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]?.match(/^title:\s*(.+)$/m)?.[1]
  if (fmTitle) return plain(fmTitle.replace(/^["']|["']$/g, ''))

  const h1 = text.match(/^#\s+(.+)$/m)?.[1]
  return h1 ? plain(h1) : fallback
}

/**
 * 统计页面里真正生效的 <Demo ...> 数量。
 * 先剔除 HTML 注释块（<!-- ... -->），否则被注释掉的示例也会被算进去。
 */
const countDemos = (text: string): number =>
  (text.replace(/<!--[\s\S]*?-->/g, '').match(/<Demo[\s/>]/g) ?? []).length

// ── 目录扫描 ───────────────────────────────────────
/** 目录下的 .md 文件名（自然排序） */
function mdFiles(absDir: string): string[] {
  return fs
    .readdirSync(absDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name)
    .sort(natSort)
}

/** 目录下的子目录名（自然排序，排除 SKIP_DIRS） */
function childDirs(absDir: string): string[] {
  return fs
    .readdirSync(absDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !SKIP_DIRS.has(e.name))
    .map((e) => e.name)
    .sort(natSort)
}

/** 读一页的元信息（只读，不写文件） */
function readPage(abs: string, segments: readonly string[]): PageMeta {
  const text = fs.readFileSync(abs, 'utf8')
  return {
    abs,
    url: `/${segments.join('/')}`,
    title: extractTitle(text, path.basename(abs, '.md')),
    demos: countDemos(text),
  }
}

/**
 * 递归构建某个目录的侧边栏条目（不含该目录自身的 index.md）。
 * 顺序：同级 .md 文件 → 子目录分组。
 */
function buildNodes(
  absDir: string,
  segments: readonly string[],
  stats: GroupStats,
): SidebarNode[] {
  const order = CHILD_ORDER[segments.join('/')] ?? []
  const nodes: SidebarNode[] = []

  // 1) 同级 md 文件（index.md 由调用方处理）
  for (const name of ordered(
    mdFiles(absDir).filter((n) => n !== 'index.md'),
    order,
  )) {
    const page = readPage(path.join(absDir, name), [...segments, name.replace(/\.md$/, '')])
    nodes.push({ text: page.title, link: page.url })
    stats.files++
    stats.pages++
    stats.demos += page.demos
  }

  // 2) 子目录 → 分组
  for (const dir of ordered(childDirs(absDir), order)) {
    const subSegments = [...segments, urlSegment(dir)]
    const childStats: GroupStats = {
      hasLanding: false,
      pages: 0,
      demos: 0,
      dirs: 0,
      files: 0,
    }
    const children = buildNodes(path.join(absDir, dir), subSegments, childStats)

    // 该子目录自己的 index.md 作为分组首项
    const indexPath = path.join(absDir, dir, 'index.md')
    const items: SidebarNode[] = []
    if (fs.existsSync(indexPath)) {
      const page = readPage(indexPath, subSegments)
      items.push({ text: page.title, link: page.url })
      childStats.hasLanding = true
      childStats.pages++
      childStats.demos += page.demos
    }
    items.push(...children)

    if (items.length === 0) continue
    nodes.push({
      text: GROUP_LABELS[subSegments.join('/')] ?? prettify(dir),
      collapsed: false,
      items,
    })
    stats.dirs++
    stats.pages += childStats.pages
    stats.demos += childStats.demos
  }

  return nodes
}

/** 扫描 src 下的一级目录（大类） */
function collectGroups(): GroupResult[] {
  const results: GroupResult[] = []

  for (const top of ordered(childDirs(SRC), CHILD_ORDER[''] ?? [])) {
    const absTop = path.join(SRC, top)
    const slug = urlSegment(top)
    const stats: GroupStats = { hasLanding: false, pages: 0, demos: 0, dirs: 0, files: 0 }

    const nodes = buildNodes(absTop, [slug], stats)

    // 大类自身的 index.md 作为首项
    const indexPath = path.join(absTop, 'index.md')
    if (fs.existsSync(indexPath)) {
      const page = readPage(indexPath, [slug])
      nodes.unshift({ text: page.title, link: page.url })
      stats.hasLanding = true
      stats.pages++
      stats.demos += page.demos
    }

    if (nodes.length === 0) continue
    results.push({
      slug,
      label: GROUP_LABELS[slug] ?? prettify(top),
      stats,
      nodes,
    })
  }

  return results
}

// ── 输出 ───────────────────────────────────────────
/** 生成 YAML 安全的双引号标量（JSON 字符串恰好是合法 YAML） */
const yaml = (value: string): string => JSON.stringify(value)

/** 首页 features 里的一句话描述 */
function summarize(result: GroupResult): string {
  const { dirs, files, pages, hasLanding, demos } = result.stats
  if (dirs > 0) {
    const docCount = hasLanding ? pages - 1 : pages
    return `${dirs} 个分类 · ${docCount} 篇文档 · ${demos} 个在线 demo`
  }
  // 小节型（如 JavaScript）：排除落地页，用首尾小节表示范围
  const sections = result.nodes.filter((n) => n.link !== `/${result.slug}`)
  const labels = sections.map((n) => n.text)
  const demoPart = demos > 0 ? ` · ${demos} 个在线 demo` : ''
  return `${labels[0] ?? ''} – ${labels.at(-1) ?? ''} · 共 ${files} 个小节${demoPart}`
}

function writeSidebar(results: readonly GroupResult[]): void {
  const sidebar: SidebarNode[] = results.map((r) => ({
    text: r.label,
    collapsed: false,
    items: r.nodes,
  }))

  fs.writeFileSync(
    path.join(SITE, 'sidebar.gen.ts'),
    [
      '// 由 scripts/gen-nav.ts 自动生成，请勿手动修改',
      "import type { DefaultTheme } from 'vitepress'",
      '',
      `const sidebar: DefaultTheme.SidebarItem[] = ${JSON.stringify(sidebar, null, 2)}`,
      '',
      'export default sidebar',
      '',
    ].join('\n'),
    'utf8',
  )
}

function writeHomePage(results: readonly GroupResult[]): void {
  const totalPages = results.reduce((sum, r) => sum + r.stats.pages, 0)
  const totalDemos = results.reduce((sum, r) => sum + r.stats.demos, 0)

  const first = results[0]
  const second = results[1]

  const features = results
    .map((r) =>
      [
        `  - title: ${yaml(r.label)}`,
        `    details: ${yaml(summarize(r))}`,
        `    link: ${r.nodes[0]?.link ?? '/'}`,
      ].join('\n'),
    )
    .join('\n')

  fs.writeFileSync(
    path.join(SRC, 'index.md'),
    `---
layout: home

hero:
  name: 前端笔记
  text: CSS / JavaScript 特性整理
  tagline: ${yaml(`${totalPages} 篇文档 · ${totalDemos} 个在线 demo · 全站本地搜索`)}
  actions:
    - theme: brand
      text: ${first ? `开始阅读 ${first.label}` : '开始阅读'}
      link: ${first?.nodes[0]?.link ?? '/'}
    - theme: alt
      text: ${second ? `前往 ${second.label}` : 'JavaScript'}
      link: ${second?.nodes[0]?.link ?? '/'}

features:
${features}
---
`,
    'utf8',
  )
}

// ── 主流程 ─────────────────────────────────────────
function main(): void {
  if (!fs.existsSync(SRC)) {
    console.error(`[gen-nav] 找不到 ${SRC}，请确认脚本位置`)
    process.exitCode = 1
    return
  }

  const results = collectGroups()
  writeSidebar(results)
  writeHomePage(results)

  const pages = results.reduce((s, r) => s + r.stats.pages, 0)
  const demos = results.reduce((s, r) => s + r.stats.demos, 0)
  console.log(`[gen-nav] 扫描到 ${pages} 篇文档，${demos} 个在线 demo`)
  for (const r of results) {
    const { dirs, files, pages: p, demos: d } = r.stats
    const detail = dirs > 0 ? `${dirs} 个分类 · ${p} 篇文档` : `${files} 个小节`
    console.log(`  ${r.label}: ${detail}，demo ${d} 个`)
  }
}

main()
