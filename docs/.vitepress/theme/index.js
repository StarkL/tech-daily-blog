import DefaultTheme from 'vitepress/theme'
import GiscusComments from './components/GiscusComments.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(GiscusComments)
    })
  },
  enhanceApp({ app }) {
    app.component('GiscusComments', GiscusComments)
  }
}
