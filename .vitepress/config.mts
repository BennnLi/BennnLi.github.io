import { defineConfig } from 'vitepress'
import sidebar from '../sidebar.gen'

export default defineConfig({
  lang: 'zh-CN',
  title: '前端笔记',
  description: 'CSS / JavaScript 特性整理：文档 + 可运行示例',
  srcDir: 'src',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  markdown: {
    lineNumbers: true,
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'CSS', link: '/css' },
      { text: 'JavaScript', link: '/javascript' },
    ],

    sidebar,

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    externalLinkIcon: true,

    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'short', timeStyle: 'short' },
    },

    footer: {
      message: '由本地 Markdown 与示例 HTML 自动生成',
      copyright: '前端笔记',
    },
  },
})
