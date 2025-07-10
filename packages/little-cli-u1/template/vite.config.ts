import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dasFeWebVitePlugin } from '@das-fed/cli'
import config from './config.js'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'
  return {
    define: { __MICRO_APPNAME__: JSON.stringify(config.microAppName) },
    base: isBuild ? `/${config.microAppName}` : '/',
    plugins: [vue(), dasFeWebVitePlugin()],
  }
})
