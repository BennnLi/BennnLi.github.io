/**
 * 生成脚本共用的类型定义
 */

/** 侧边栏节点：既可以是叶子（有 link），也可以是分组（有 items） */
export interface SidebarNode {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarNode[]
}

/** 一页的元信息（从 md 文件读出，不修改文件） */
export interface PageMeta {
  /** md 文件绝对路径 */
  abs: string
  /** 站内 URL，如 '/css/at-rules/layer' */
  url: string
  /** 侧边栏显示文本（frontmatter.title > 首个 # 标题 > 文件名） */
  title: string
  /** 页面内 <Demo> 组件的数量 */
  demos: number
}

/** 某个分组的统计 */
export interface GroupStats {
  /** 分组自身是否有 index.md 落地页 */
  hasLanding: boolean
  /** 分组下所有页面数（含落地页） */
  pages: number
  /** 分组下的 demo 总数 */
  demos: number
  /** 子目录数量（即"分类"数） */
  dirs: number
  /** 同级 md 文件数量（不含 index.md，即"小节"数） */
  files: number
}

/** 顶层大类（src 下的一级目录）的扫描结果 */
export interface GroupResult {
  /** URL 片段，如 'css' */
  slug: string
  /** 侧边栏分组标题 */
  label: string
  stats: GroupStats
  nodes: SidebarNode[]
}
