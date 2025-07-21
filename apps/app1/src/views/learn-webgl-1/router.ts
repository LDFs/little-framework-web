export default {
  path: "/goukaku",
  name: "1. 开始",
  id: 2,
  component: () => import("./index.vue"),
  meta: { keepAlive: true },
};
