<template>
  <Transition name="fade" mode="out-in">
    <LoadingScreen v-if="isLoading"></LoadingScreen>
    <main v-else><h1>Hello</h1></main>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";
import LoadingScreen from "../components/LoadingScreen.vue";

const isLoading = ref<boolean>(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
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
