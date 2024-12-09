<template>
  <main
    class="flex flex-col items-center h-full relative w-full"
    :class="{ 'bg-red-500': isDrawing }"
  >
    <div
      class="h-28 w-full flex items-center justify-center"
      v-if="isLoading && !isDrawing"
    >
      <BasicSpinner></BasicSpinner>
    </div>

    <RecentPairs
      class="md:max-w-[666px]"
      v-else-if="!isLoading && !isDrawing"
    ></RecentPairs>
    <DrawPair
      class="absolute w-full h-64 top-[calc(50%-8rem)] sm:h-[30rem] sm:top-[calc(50%-15rem)]"
      :class="{
        'h-full sm:h-full top-0 sm:top-0': isEnlarged,
      }"
      @start-drawing="startDrawing"
      @stop-drawing="stopDrawing"
    ></DrawPair>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import RecentPairs from "./recent_pairs/RecentPairs.vue";
import DrawPair from "./DrawPair.vue";
import BasicSpinner from "../../../components/BasicSpinner.vue";
import { useUserStore } from "../../../stores/userStore.ts";

const userStore = useUserStore();

const isLoading = ref(true);
const isDrawing = ref(false);

const isEnlarged = ref(false);

const startDrawing = () => {
  isEnlarged.value = true;
  setTimeout(() => {
    isDrawing.value = true;
  }, 1200);
};

const stopDrawing = () => {
  isDrawing.value = false;
  setTimeout(() => {
    isEnlarged.value = false;
  }, 500);
};

onMounted(async () => {
  await userStore.getPairs();
  isLoading.value = false;
});
</script>
