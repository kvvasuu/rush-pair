<template>
  <div
    class="absolute top-0 pt-24 pb-12 flex flex-col items-center justify-start w-full px-8 h-[calc(100%-4rem)] md:h-full overflow-y-auto overflow-x-hidden"
  >
    <p
      class="select-none mt-8 font-semibold text-neutral-400 dark:text-neutral-600"
    >
      Quiz
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useGameStore } from "../../../../stores/gameStore";
import { useRoute } from "vue-router";

const gameStore = useGameStore();
const route = useRoute();

const isLoading = ref(true);

onBeforeMount(async () => {
  isLoading.value = await gameStore.getGameData(
    route.params.id as string,
    "quiz"
  );
});
</script>
