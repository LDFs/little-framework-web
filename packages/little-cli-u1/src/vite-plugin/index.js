import vuePlugin from '@vitejs/plugin-vue'
import vueJsxPlugin from '@vitejs/plugin-vue-jsx'

import webApp from './webApp.js'
import handleDevEntry from './devEntry.js'

export const vitePlugin = async (options = {}) => {
  const {
    defaultEntry = 'src/main.ts',
    devEntry = 'src/main.dev.ts',
    webAppOption = {}
  } = options

  const plugins = [
    vuePlugin(),
    vueJsxPlugin(),   // JSX支持插件，允许在.vue文件或.jsx文件中使用类似React的JSX语法来编写Vue组件
    webApp(webAppOption),
    handleDevEntry(defaultEntry, devEntry),
  ] 
  return plugins
}