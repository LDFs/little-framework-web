export default {
  path: "/",
  name: "首页",
  id: 1,
  component: () => import("./index.vue"),
  meta: { keepAlive: true },
};
