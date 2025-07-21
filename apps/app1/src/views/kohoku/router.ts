export default {
  path: "/kohoku",
  name: "2. render",
  id: 3,
  component: () => import("./index.vue"),
  meta: { keepAlive: true },
};
