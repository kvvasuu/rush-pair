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
      meta: { requiresAuth: true },
      beforeEnter: (_to, _from, next) => {
        const store = useAuthStore();
        if (store.firstVisit) {
          next("/app/first-steps");
        } else {
          next();
        }
      },
      children: [
        {
          path: "",
          name: "App",
          component: AppView,
        },
        {
          path: "first-steps",
          name: "FirstSteps",
          component: () => import("../components/FirstSteps.vue"),
          meta: { requiresAuth: true },
          /* beforeEnter: (_to, _from, next) => {
            const store = useAuthStore();
            if (!store.firstVisit) {
              next("/app");
            } else {
              next();
            }
          }, */
        },
      ],
    },
  ],
});

router.beforeEach(async (to, _from) => {
  const store = useAuthStore();

  if (to.meta.requiresAuth && !store.token && to.name !== "Welcome") {
    return { name: "Welcome" };
  }
});

export default router;
