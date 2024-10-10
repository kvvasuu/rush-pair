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
      beforeEnter: (to, _from, next) => {
        const store = useAuthStore();
        if (store.firstVisit && to.path !== "/app/first-steps") {
          next("/app/first-steps"); // Przekierowanie na first-steps
        } else {
          next(); // Kontynuacja do domyślnej trasy /app
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
          meta: { requiresAuth: true }, // Sprawdź, czy użytkownik jest zalogowany
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
