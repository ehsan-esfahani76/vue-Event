import { createRouter, createWebHistory } from "vue-router";
import { checkAuth } from "../middlewares/routerGuard";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/Signup.vue"),
    },
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/Dashboard.vue"),
      meta: { requiresAuth: true },
      redirect: { name: "home" },
      children: [
        {
          path: "home",
          name: "home",
          component: () => import("../views/Home.vue"),
        },
        {
          path: "events",
          name: "event",
          component: () => import("../views/Event.vue"),
        },
        {
          path: "activities",
          name: "activity",
          component: () => import("../views/Activity.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to,from, next) => {
  const { $cookies } = router.app.config.globalProperties;
  checkAuth(to,$cookies,next)
});
export default router;
