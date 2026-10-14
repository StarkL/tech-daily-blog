<script setup>
import Giscus from '@giscus/vue'
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

const { isDark, theme, frontmatter } = useData()
const route = useRoute()

const giscusConfig = computed(() => {
  return theme.value.giscus || {
    repo: 'StarkL/tech-daily-blog',
    repoId: 'R_kgDOTtHrIA',
    category: 'Announcements',
    categoryId: 'DIC_kwDOTtHrIM4DIU0_',
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'bottom',
    lang: 'zh-CN',
  }
})

const showComment = computed(() => {
  // If explicitly disabled in frontmatter
  if (frontmatter.value.comments === false) return false
  // Do not show on homepage or section index
  const path = route.path
  if (
    path === '/' ||
    path === '/blog/' ||
    path === '/posts/horizon/' ||
    path === '/blog/posts/horizon/' ||
    path.endsWith('/index.html')
  ) {
    return false
  }
  return true
})
</script>

<template>
  <div v-if="showComment" class="giscus-wrapper">
    <Giscus
      :key="route.path"
      :repo="giscusConfig.repo"
      :repo-id="giscusConfig.repoId"
      :category="giscusConfig.category"
      :category-id="giscusConfig.categoryId"
      :mapping="giscusConfig.mapping || 'pathname'"
      :strict="giscusConfig.strict || '0'"
      :reactions-enabled="giscusConfig.reactionsEnabled || '1'"
      :emit-metadata="giscusConfig.emitMetadata || '0'"
      :input-position="giscusConfig.inputPosition || 'bottom'"
      :theme="isDark ? 'github-dark' : 'light'"
      :lang="giscusConfig.lang || 'zh-CN'"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.giscus-wrapper {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
