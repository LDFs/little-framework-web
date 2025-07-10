import type { RouteRecordRaw } from 'vue-router'
import { setI18nRule, setThemeRule } from '@das-fed/web'
import i18n from './i18n'
import theme from './theme'

setI18nRule(i18n)
setThemeRule(theme)

export default {
  default: {
    path: '/',
  component: () => import('./app.vue'),
  }
} 
