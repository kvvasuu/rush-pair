<template>
  <div
    class="w-full flex px-6 gap-6 overflow-hidden py-4 overflow-x-scroll scroll-hide"
  >
    <div
      v-for="(pair, index) in arr"
      class="aspect-square rounded-full cursor-pointer pair w-1/5 min-w-[72px] select-none"
    >
      <img
        :src="pair"
        :alt="`pair_${index}`"
        :key="`pair_${index}`"
        class="w-full h-full rounded-full border-slate-50 dark:border-neutral-900 border-[2px]"
        draggable="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import photo from "../../../../../backend/uploads/lukaszkwas96_gmail_com.png";

const arr = [photo, photo, photo, photo, photo, photo, photo, photo];
</script>

<style scoped>
.pair {
  padding: 2px;
  background-image: linear-gradient(
    20deg,
    rgba(255, 32, 108, 1) 0%,
    rgba(255, 127, 88, 1) 87%
  );
}

.scroll-hide::-webkit-scrollbar {
  display: none;
}

.scroll-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
