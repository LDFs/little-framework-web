export default {
  default: {
    path: "/kohoku",
    component: () => import("./index.vue"),
    meta: { keepAlive: true },
  },
};
