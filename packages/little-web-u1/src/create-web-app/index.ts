import { createApp } from "vue";
import { initRouter } from "../router";
import { initi18n } from "../i18n";


export const createWebApp = async (config: any) => {
  const { root } = config;

  await initi18n(config)
  const router1 = initRouter(config)

  console.log('router1: ', router1);

  const app = createApp(root.component)
  app.use(router1).mount('#app')

  return app
}