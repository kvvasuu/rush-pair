import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import AppView from "../views/app/AppView.vue";

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
      path: "/app",
      name: "App",
      component: AppView,
      meta: { requiresAuth: true },
      beforeEnter: (_to, _from, next) => {
        const store = useAuthStore();
        if (store.token) {
          next();
        } else {
          next("/");
        }
      },
    },
  ],
});

export default router;
