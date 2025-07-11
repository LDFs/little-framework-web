export default {
  default: {
    path: "/goukaku",
    component: () => import("./index.vue"),
    meta: { keepAlive: true },
  },
};
