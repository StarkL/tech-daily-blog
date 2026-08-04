// Auto-generate sidebar and homepage from markdown files
import { readdirSync, writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const docsDir = join(__dirname, '..', 'docs')
const postsDir = join(docsDir, 'posts', 'horizon')
const otherDir = join(docsDir, 'posts', 'other')

// Scan horizon article files (dated daily reports)
const files = readdirSync(postsDir)
  .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
  .sort()
  .reverse()

// Scan other article files (non-dated reports/tutorials)
const otherFiles = []
try {
  const otherList = readdirSync(otherDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))
  // Read frontmatter title from each file
  for (const f of otherList) {
    const filePath = join(otherDir, f)
    const content = readFileSync(filePath, 'utf-8')
    const titleMatch = content.match(/^title:\s*["']?([^"'\n]+)["']?\s*$/m)
    const dateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m)
    otherFiles.push({
      filename: f,
      title: titleMatch ? titleMatch[1].trim() : f.replace('.md', ''),
      date: dateMatch ? dateMatch[1] : null,
      link: `/posts/other/${f.replace('.md', '')}`,
    })
  }
  otherFiles.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
} catch (e) {
  // other directory may not exist
}

// Generate sidebar items for horizon
const sidebarItems = files.map(f => {
  const date = f.replace('.md', '')
  return `    { text: '${date} 每日科技要闻', link: '/posts/horizon/${date}' },`
}).join('\n')

// Generate sidebar items for other (if any)
const otherSidebarItems = otherFiles.length > 0
  ? `,\n        {\n          text: '其他',\n          items: [\n${otherFiles.map(f => `    { text: '${f.title.replace(/'/g, "\\'")}', link: '${f.link}' },`).join('\n')}\n          ]\n        }`
  : ''

// Build unified post list for homepage (merge horizon + other, sort by date desc)
const allPosts = []

// Add horizon articles
files.forEach(f => {
  const date = f.replace('.md', '')
  allPosts.push({
    date,
    title: '每日科技要闻',
    link: `/posts/horizon/${date}`,
  })
})

// Add other articles
otherFiles.forEach(f => {
  if (f.date) {
    allPosts.push({
      date: f.date,
      title: f.title,
      link: f.link,
    })
  }
})

// Sort by date descending
allPosts.sort((a, b) => b.date.localeCompare(a.date))

// Generate homepage list
const homeList = allPosts.map(p =>
  `  { date: '${p.date}', title: '${p.title.replace(/'/g, "\\'")}', link: '${p.link}' },`
).join('\n')

// Write config.js
const config = `import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '科技日报',
  description: '每日全球科技要闻精选',
  lang: 'zh-CN',
  base: '/blog/',

  themeConfig: {
    search: {
      provider: 'local',
      options: { lang: 'zh-CN' },
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '科技日报', link: '/posts/horizon/' },
    ],

    sidebar: {
      '/posts/': [
        {
          text: 'AI自动化',
          items: [
${sidebarItems}
          ]
        }${otherSidebarItems}
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/StarkL' },
    ],

    footer: {
      message: 'Powered by Horizon & VitePress',
    },
  },
})
`

writeFileSync(join(docsDir, '.vitepress', 'config.js'), config, 'utf-8')

// Write index.md
const index = `# 科技日报

> AI 驱动的信息聚合，精选全球科技动态

---

<script setup>
const posts = [
${homeList}
]
</script>

<ul style="list-style:none;padding:0;max-width:720px;">
  <li v-for="post in posts" :key="post.date + post.link" style="padding:10px 0;border-bottom:1px solid #eee;display:flex;align-items:baseline;">
    <a :href="'/blog' + post.link" style="text-decoration:none;display:flex;align-items:baseline;gap:12px;width:100%;">
      <span style="color:#3eaf7c;font-family:monospace;font-size:0.9em;min-width:90px;">{{ post.date }}</span>
      <span style="font-weight:500;">{{ post.title }}</span>
    </a>
  </li>
</ul>
`

writeFileSync(join(docsDir, 'index.md'), index, 'utf-8')

// Write horizon directory index page (分区索引：/posts/horizon/)
const horizonIndex = `# Horizon 科技日报

AI 驱动的全球科技要闻精选。

---

${files.map(f => {
  const date = f.replace('.md', '')
  return `- [${date} - 每日科技要闻](./${date})`
}).join('\n')}
`

writeFileSync(join(postsDir, 'index.md'), horizonIndex, 'utf-8')

console.log(`Auto-generated: ${files.length} horizon + ${otherFiles.length} other = ${allPosts.length} total articles in sidebar + homepage + horizon index`)
