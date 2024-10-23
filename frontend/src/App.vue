<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";
import { useSettingsStore } from "./stores/settingsStore";

const authStore = useAuthStore();
const settingsStore = useSettingsStore();

onMounted(async () => {
  await authStore.login();
  settingsStore.settings.theme &&
    document.documentElement.setAttribute(
      "data-theme",
      settingsStore.settings.theme
    );
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
