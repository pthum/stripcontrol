import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/colorprofileservice",
    name: "Color Profiles",
    component: () =>
      import(
        /* webpackChunkName: "colorprofiles" */ "../views/ColorProfile.vue"
      ),
  },
  {
    path: "/ledstripservice",
    name: "LED Strips",
    component: () =>
      import(
        /* webpackChunkName: "ledstrips" */ "../views/LedStripService.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
