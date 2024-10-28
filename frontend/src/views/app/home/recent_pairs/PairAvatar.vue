<template>
  <div
    class="aspect-square rounded-full cursor-pointer pair w-1/5 min-w-[72px] select-none"
  >
    <img
      :src="pair"
      class="w-full h-full rounded-full border-slate-50 dark:border-neutral-900 border-[2px]"
      draggable="false"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps(["pair"]);
</script>
