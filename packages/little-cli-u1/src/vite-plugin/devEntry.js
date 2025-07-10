import { resolve } from 'path'
import fs from 'fs-extra'

export default (entry = '/src/main.ts', devEntry = '/src/main.dev.ts') => {
  const cwd = process.cwd()

  return {
    name: 'dynamic-entry',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      handler: async (html) => {
        if (!(await fs.exists(resolve(cwd, '.' + devEntry)))) return html
        return html.replace(entry, devEntry)
      },
    },
  }
}
