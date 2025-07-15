import { createWebApp } from '@little-framework/web'

createWebApp({
  // @ts-ignore
  microAppName: __MICRO_APPNAME__,
  router: { glob: import.meta.glob('@/views/**/router.ts', { eager: true, import: 'default' }) },
  plugins: { glob: import.meta.glob('@/plugins/*/index.ts', { eager: true, import: 'default' }) },
})


// import { createRouter, createWebHistory } from 'vue-router';
// import { defineAsyncComponent } from 'vue';

// // 异步导入组件
// const Home = defineAsyncComponent(() => import('@/views/goukaku/index.vue'));

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   }
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// });

// import { createApp } from 'vue';
// import App from './views/App.vue'; // 假设存在根组件 App.vue

// const app = createApp(App);
// app.use(router);
// app.mount('#app');