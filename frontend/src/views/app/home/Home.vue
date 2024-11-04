<template>
  <main
    class="flex flex-col items-center h-full relative w-full md:max-w-[666px]"
  >
    <div
      class="h-28 w-full flex items-start justify-center relative"
      v-if="isLoading"
    >
      <BasicSpinner></BasicSpinner>
    </div>

    <RecentPairs v-else></RecentPairs>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RecentPairs from "./recent_pairs/RecentPairs.vue";
import BasicSpinner from "../../../components/BasicSpinner.vue";

const isLoading = ref(true);
setTimeout(() => {
  isLoading.value = false;
}, 3000);
</script>
