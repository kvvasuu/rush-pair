<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <Component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.login();
});
</script>
