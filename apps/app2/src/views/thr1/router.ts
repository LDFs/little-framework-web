export default {
  path: "/light1",
  name: "1. 光源",
  id: 2,
  component: () => import("./index.vue"),
  meta: { keepAlive: true },
};
