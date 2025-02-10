<template>
  <div
    class="flex items-center justify-center w-60 h-60 rounded-lg shadow transition-all duration-300 overflow-hidden relative bg-neutral-100 dark:bg-neutral-800"
    :class="{ 'cursor-pointer hover:-translate-y-1': isLoaded }"
  >
    <img
      :key="name"
      src="https://gamescrafters.berkeley.edu/instructions/i/tictactoe/tictactoe.svg"
      :alt="name"
      draggable="false"
      @load="onLoad"
      class="object-cover h-full w-full absolute z-10"
      v-show="isLoaded"
    />
    <div
      class="w-full h-full bg-slate-300 dark:bg-neutral-800/60 animate-pulse absolute flex items-center justify-center font-semibold text-lg text-neutral-400 dark:text-neutral-600 select-none"
      v-if="!isLoaded"
    >
      {{ name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps({ name: String, imageURL: String });

const isLoaded = ref(false);

const onLoad = () => {
  isLoaded.value = true;
};
</script>
