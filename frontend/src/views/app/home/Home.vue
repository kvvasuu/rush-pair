<template>
  <main
    class="flex flex-col items-center h-full relative w-full md:max-w-[666px]"
  >
    <div class="h-28 w-full flex items-center justify-center" v-if="isLoading">
      <BasicSpinner></BasicSpinner>
    </div>

    <RecentPairs v-else></RecentPairs>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import RecentPairs from "./recent_pairs/RecentPairs.vue";
import BasicSpinner from "../../../components/BasicSpinner.vue";
import { useUserStore } from "../../../stores/userStore.ts";

const userStore = useUserStore();

const isLoading = ref(true);

onMounted(async () => {
  await userStore.getPairs();
  isLoading.value = false;
});
</script>
