<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <Component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useUserStore } from "./stores/userStore";

const userStore = useUserStore();

onBeforeMount(async () => {
  await userStore.login();
});
</script>
