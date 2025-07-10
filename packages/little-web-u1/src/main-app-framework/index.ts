import Layout from './layout/index.vue'

const routes = [
  {
    path: '/application',
    component: () => import('./pages/index.vue'),
  }, 
]

const mainAppFramework = {
  Layout,
  routes
}

export {
  mainAppFramework
}