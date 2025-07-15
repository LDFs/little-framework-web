import { createApp } from "vue";
import { initRouter } from "../router";
import { initi18n } from "../i18n";
import { mainAppFramework } from "../main-app-framework";
import { microApps as microAppsStore } from "../store/index.ts";

export const createWebApp = async (config: any) => {
  const { root = {} } = config;

  await initi18n(config);
  const router1 = initRouter(config);
  createMicro(config)

  console.log("已注册的路由: ", router1);

  const app = createApp(root.component ?? mainAppFramework.Layout);
  app.use(router1).mount("#app");

  return app;
};

// 根据子应用来创建目录
function createMicro(config: any) {
  // 主应用运行时，使用microApps；子应用运行时，使用microAppName
  const { microApps, microAppName } = config;
  microAppsStore.value = [
    {
      name: 'application',
      appCode: 'application',
      routeUrl: `/application`,
    },
  ]

  if (microAppName) {
    const m = microAppName.split('/').at(-1)
    microAppsStore.value.push({
      name: m,
      appCode: m,
      routeUrl: `/${microAppName}`,
    })
  }
  if (microApps) {
    microAppsStore.value.push(...microApps)
  }
}