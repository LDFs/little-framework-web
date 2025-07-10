import { createRouter, createWebHistory } from "vue-router"

function initRouter(config: any){
  const { router } = config || {}

  const globRoutes = Object.values(router?.glob || [])
    .filter((item) => !!item)
    .flat()
    .sort((a: any, b: any) => (a.index ?? 0) - (b.index ?? 0))

  const routes = globRoutes.map((item: any) => {
    const meta = item.meta || {}
    meta.keepAlive = meta.keepAlive ?? true
    return { ...item, meta }
  })

  const microAppRoutes: any[] = []
  config.microApps?.forEach((item: any) => {
    const microAppItemRoutes = Object.values(item.router?.glob || {})
      .filter((item) => !!item)
      .flat()
      .sort((a: any, b: any) => (a.index ?? 0) - (b.index ?? 0))
    // 添加子应用路由
    microAppRoutes.push(
      ...microAppItemRoutes.map((rItem: any) => {
        return { ...rItem, path: `${rItem.path}` }
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

  const inputRouters = router?.routers || []
  const actualRoutes = [
    ...routes,
    ...inputRouters,
    ...microAppRoutes,
  ]
  console.log('actualRoutes', actualRoutes);

  return createRouter({ history: createWebHistory(), routes: actualRoutes })
}

export { initRouter }