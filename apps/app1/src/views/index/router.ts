export default {
  path: "/",
  component: () => import("./index.vue"),
  meta: { keepAlive: true },
};
