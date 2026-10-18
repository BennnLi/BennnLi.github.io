import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext, Theme } from 'vitepress'

import Demo from './components/Demo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    // 全局注册，Markdown 里可直接写 <Demo src="..." />
    app.component('Demo', Demo)
  },
} satisfies Theme
