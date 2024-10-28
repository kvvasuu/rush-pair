<template>
  <div
    class="w-full flex flex-col items-center justify-center pt-4 px-6 md:px-0"
  >
    <p
      class="w-full border-b-[1px] border-neutral-300 dark:border-neutral-750 text-neutral-400 dark:text-neutral-500"
    >
      Recent pairs
    </p>
    <div
      class="w-full flex gap-6 py-4 overflow-x-scroll scroll-hide relative"
      ref="horizontalSlider"
      @scroll="handleScroll"
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
      <button
        class="h-full px-2 absolute left-0 top-0 items-center justify-center rounded-full text-xl text-neutral-600 hover:text-neutral-500 transition-all cursor-pointer hidden"
      >
        <div
          class="w-8 h-8 flex items-center justify-center bg-neutral-200/75 rounded-full"
        >
          <i class="fa-solid fa-angle-left"></i>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import photo from "../../../../../backend/uploads/lukaszkwas96_gmail_com.png";

const arr = [photo, photo, photo, photo, photo, photo, photo, photo];

const horizontalSlider = ref<HTMLElement | null>();

const handleScroll = () => {
  if (!horizontalSlider.value) return;

  console.log(horizontalSlider.value.scrollLeft);
};
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
