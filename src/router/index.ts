import { createRouter, createWebHistory } from "vue-router";
import { useMainStore } from "../stores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/:pathMatch(.*)*", redirect: "/" },
    {
      path: "/",
      name: "Welcome",
      component: () => import("../views/WelcomeScreen.vue"),
    },
    {
      path: "/host",
      name: "Host",
      component: () => import("../views/Host.vue"),
      meta: { requiresAuth: false, requiresAdmin: true },
    },
    {
      path: "/join",
      name: "Join",
      component: () => import("../views/Join.vue"),
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach((to, _from) => {
  const store = useMainStore();
  if (to.meta.requiresAuth && !store.loggedIn) {
    return {
      path: "/",
    };
  }
  if (to.meta.requiresAdmin && store.playerType !== "admin") {
    return {
      path: "/",
    };
  }
});

export default router;
