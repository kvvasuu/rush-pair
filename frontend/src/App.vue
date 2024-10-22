<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";
import { useSettingsStore } from "./stores/settingsStore";

const store = useAuthStore();
const settingsStore = useSettingsStore();

onMounted(async () => {
  settingsStore.settings.theme &&
    document.documentElement.setAttribute(
      "data-theme",
      settingsStore.settings.theme
    );
  await store.login();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
