import { createWebApp } from '@little-framework/web'

createWebApp({
  // @ts-ignore
  microAppName: __MICRO_APPNAME__,
  router: { glob: import.meta.glob('@/views/**/router.ts', { eager: true, import: 'default' }) },
  plugins: { glob: import.meta.glob('@/plugins/*/index.ts', { eager: true, import: 'default' }) },
})
