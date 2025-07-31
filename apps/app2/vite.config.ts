import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { vitePlugin } from '@little-framework/cli'
import config from './config.js'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'
  const __dirname = path.resolve()
  return {
    define: { __MICRO_APPNAME__: JSON.stringify(config.microAppName) },
    base: isBuild ? `/${config.microAppName}` : '/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})
