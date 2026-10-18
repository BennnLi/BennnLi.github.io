<script setup lang="ts">
/**
 * 在线示例：用 iframe 嵌入仓库里的独立 HTML demo
 *
 * 用法：<Demo src="/demos/at-rules/layer/01-basic-layer.html" title="基础用法" height="360px" />
 */
interface Props {
  /** demo 在站点内的路径，如 /demos/at-rules/layer/01-basic.html */
  src: string
  /** 标题栏文案；留空则不显示标题栏 */
  title?: string
  /** iframe 高度 */
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  height: '360px',
})
</script>

<template>
  <div class="demo">
    <div v-if="props.title" class="demo__bar">
      <span class="demo__dot" />
      <span class="demo__title">{{ props.title }}</span>
      <a class="demo__open" :href="props.src" target="_blank" rel="noreferrer">新窗口打开 ↗</a>
    </div>
    <iframe class="demo__frame" :src="props.src" :style="{ height: props.height }" loading="lazy" />
  </div>
</template>

<style scoped>
.demo {
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.demo__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
}

.demo__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  flex: none;
}

.demo__title {
  flex: 1;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.demo__open {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  white-space: nowrap;
}

.demo__open:hover {
  text-decoration: underline;
}

.demo__frame {
  display: block;
  width: 100%;
  border: 0;
  background: #fff;
}
</style>
