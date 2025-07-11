export default {
  default: {
    path: "/demo",
    component: () => import("./index.vue"),
    meta: { keepAlive: true },
  },
};
