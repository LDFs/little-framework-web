import { resolve } from 'path'
import dayjs from 'dayjs'

const webApp = (options) => {
  const {
    base = './',
    apply = 'build',
    entry = 'src/main.ts',
    external = [
      'vue',
      'vue-router',
      'pinia',
      'pinia-plugin-persistedstate',
      /^@little-framework\/(.*)$/,
      /^dayjs(\/.*)?$/,
      /^element-plus(\/.*)?$/,
      /^ant-design-vue(\/.*)?$/,
    ],
  } = options || {}
  const cwd = process.cwd()
  const timeId = dayjs().format('YYYY-MM-DD-HH-mm-ss-SSS')

  return {
    name: 'vite-plugin-web-app',
    apply: apply,
    config: () => {
      return {
        base: base,
        build: {
          lib: {
            entry: resolve(cwd, entry),
            name: 'index',
            fileName: 'index'
          },
          rollupOptions: {
            external: external,
            output: {
              chunkFileNames: `[name]-[hash]-${timeId}.js`,
            },
          }
        }
      }
    }
  }
}

export default (opt) => [webApp(opt)]