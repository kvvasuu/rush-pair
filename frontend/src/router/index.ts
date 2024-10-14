import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import AppView from "../views/app/AppView.vue";
import Home from "../views/app/Home.vue";

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
      beforeEnter: (to, _from, next) => {
        const store = useAuthStore();
        if (!store.token) {
          next("/");
        }
        if (store.firstVisit && to.path !== "/app/first-steps") {
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
          meta: { requiresAuth: true },
          children: [
            {
              path: "",
              name: "Home",
              component: Home,
              meta: { requiresAuth: true },
            },
          ],
        },
        {
          path: "first-steps",
          name: "FirstSteps",
          component: () => import("../components/FirstSteps.vue"),
          meta: { requiresAuth: true },
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
  if (to.meta.requiresAuth && store.token && to.name !== "App") {
    return { name: "App" };
  }
});

export default router;
