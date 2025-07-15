import { createRouter, createWebHistory } from "vue-router"
import {mainAppFramework} from '../main-app-framework'
import {subMicroMenu} from '../store/index.ts'


function initRouter(config: any){
  const { router, microAppName } = config || {}

  const globRoutes = Object.values(router?.glob || [])
    .filter((item) => !!item)
    .flat()
    .sort((a: any, b: any) => (a.index ?? 0) - (b.index ?? 0))

  const routes = globRoutes.map((item: any) => {
    const meta = item.meta || {}
    meta.keepAlive = meta.keepAlive ?? true
    return { ...item, meta }
  })
  if (microAppName) {
    routes.forEach((item: any) => {
      item.path = `/${microAppName}${item.path}`
    })
    const name = microAppName.split('/').at(-1)
    if(!subMicroMenu.value[name]) {
      subMicroMenu.value[name] = routes.map((item: any) => {
        return {
          name: item.path.split('/').at(-1) || 'main',
          routeUrl: item.path,
        }
      })
    }
  }
  console.log('subMicroMenu:', subMicroMenu.value);


  const microAppRoutes: any[] = []
  config.microApps?.forEach((item: any) => {
    const microAppItemRoutes = Object.values(item.router?.glob || {})
      .filter((item) => !!item)
      .flat()
      .sort((a: any, b: any) => (a.index ?? 0) - (b.index ?? 0))
    // 添加子应用路由, 给子路由的路径添加前缀
    microAppRoutes.push(
      ...microAppItemRoutes.map((rItem: any) => {
        return { ...rItem, path: `/${item.microAppName}/${rItem.path}` }
      }),
    )
    // 处理路由重定向
    microAppRoutes.push(
      ...microAppItemRoutes
        .filter((item: any) => !!item.path)
        .filter((item: any) => item.path !== '')
        .filter((item: any) => item.path !== '/')
        .filter((item: any) => !item.path.startsWith(`/${item.microAppName}`))
        .map((rItem: any) => {
          return {
            path: rItem.path,
            redirect: `${rItem.path}`,
            meta: { ...(rItem.meta || {}), isMicroAppRouteRedirect: true },
          }
        }),
    )
  })

  const inputRouters = router?.routers || mainAppFramework.routes
  const actualRoutes = [
    ...routes,
    ...inputRouters,
    ...microAppRoutes,
  ]
  console.log('actualRoutes', actualRoutes);

  return createRouter({ history: createWebHistory(), routes: actualRoutes })
}

export { initRouter }