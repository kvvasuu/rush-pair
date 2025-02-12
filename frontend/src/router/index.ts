import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";
import AppView from "../views/app/AppView.vue";
import Home from "../views/app/home/Home.vue";
import GamesWrapper from "../views/app/games/GamesWrapper.vue";
import SettingsWrapper from "../views/app/settings/SettingsWrapper.vue";
import Settings from "../views/app/settings/Settings.vue";
import PairsWrapper from "../views/app/pairs/PairsWrapper.vue";
import PairsList from "../views/app/pairs/PairsList.vue";
import PairChat from "../views/app/pairs/pair_chat/PairChat.vue";

const routes = [
  { path: "/:pathMatch(.*)*", redirect: "/" },
  {
    path: "/",
    name: "Welcome",
    meta: { requiresAuth: false },
    component: () => import("../views/welcome_screen/WelcomeScreen.vue"),
  },
  {
    path: "/terms",
    name: "Terms and Conditions",
    component: () => import("../views/welcome_screen/TermsAndConditions.vue"),
  },
  {
    path: "/app",
    component: AppView,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
      },
      {
        path: "games",
        name: "Games",
        component: GamesWrapper,
        children: [
          {
            path: "",
            name: "GamesList",
            component: () => import("../views/app/games/GamesList.vue"),
          },
        ],
      },
      {
        path: "pairs",
        component: PairsWrapper,
        children: [
          {
            path: "",
            name: "PairsList",
            component: PairsList,
          },
          {
            path: ":id",
            name: "PairChat",
            component: PairChat,
          },
        ],
      },
      {
        path: "settings",
        component: SettingsWrapper,
        children: [
          {
            path: "",
            name: "Settings",
            component: Settings,
          },
          {
            path: "profile",
            name: "Profile",
            component: () =>
              import("../views/app/settings/profile/Profile.vue"),
          },
          {
            path: "security",
            name: "Security",
            component: () =>
              import("../views/app/settings/security/Security.vue"),
          },
        ],
      },
      {
        path: "first-steps",
        name: "FirstSteps",
        component: () => import("../views/app/FirstSteps.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _from) => {
  const store = useUserStore();

  if (!store.token) {
    const token = localStorage.getItem("token");
    if (token) {
      store.setToken(token);
      await store.login();
    }
  }

  if (to.meta.requiresAuth && !store.token) {
    return { name: "Welcome" };
  }

  if (store.token && to.name === "Welcome") {
    return { path: "/app" };
  }

  if (store.token && store.firstVisit && to.path === "/app") {
    return { path: "/app/first-steps" };
  }

  if (store.token && !store.firstVisit && to.path === "/app/first-steps") {
    return { path: "/app" };
  }

  return true;
});

export default router;
