import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import type { Router } from "vue-router";

import router from "./router/index.ts";
import i18n from "./locales/i18n.ts";

declare module "pinia" {
  export interface PiniaCustomProperties {
    router: Router;
  }
}

const app = createApp(App);

const pinia = createPinia();

pinia.use(({ store }) => {
  store.router = markRaw(router);
});

app.use(i18n);
app.use(pinia);
app.use(router);

router.isReady().then(() => app.mount("#app"));
