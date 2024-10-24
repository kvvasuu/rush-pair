<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.login();
  document.documentElement.setAttribute("data-theme", authStore.settings.theme);
});
</script>
