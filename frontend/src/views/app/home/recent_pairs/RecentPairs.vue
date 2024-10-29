<template>
  <div
    class="w-full flex flex-col items-center justify-center pt-4 px-6 md:px-0"
  >
    <p
      class="w-full border-b-[1px] border-neutral-300 dark:border-neutral-750 text-neutral-400 dark:text-neutral-500"
    >
      Recent pairs
    </p>
    <div class="w-full relative">
      <div
        class="w-full flex gap-6 py-4 overflow-x-scroll scroll-hide"
        ref="horizontalSlider"
      >
        <PairAvatar
          v-for="(pair, index) in arr"
          :pair="pair"
          :key="`pair_${index}`"
        ></PairAvatar>

        <button
          class="h-full px-2 absolute left-0 top-0 items-center justify-center rounded-full text-xl text-neutral-200/90 hover:text-neutral-100/90 transition-all cursor-pointer outline-none"
          v-if="showLeftArrow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path
              class="cls-1"
              d="M64,0C28.65,0,0,28.65,0,64s28.65,64,64,64,64-28.65,64-64S99.35,0,64,0ZM80.64,92.98c1.95,1.95,1.95,5.12,0,7.07-.98.98-2.26,1.46-3.54,1.46s-2.56-.49-3.54-1.46l-32.52-32.52c-1.95-1.95-1.95-5.12,0-7.07l32.52-32.52c1.95-1.95,5.12-1.95,7.07,0,1.95,1.95,1.95,5.12,0,7.07l-28.98,28.98,28.98,28.98Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import PairAvatar from "./PairAvatar.vue";

const arr = [
  "lukaszkwas96_gmail_com.png",
  "lukaszkwas96_gmail_com1.png",
  "lukaszkwas96_gmail_com2.png",
  "lukaszkwas96_gmail_com3.png",
  "lukaszkwas96_gmail_com4.png",
  "lukaszkwas96_gmail_com2.png",
  "lukaszkwas96_gmail_com1.png",
  "lukaszkwas96_gmail_com.png",
];

const horizontalSlider = ref<HTMLElement | null>();

const showLeftArrow = computed(() => {
  if (!horizontalSlider.value) return;
  console.log(horizontalSlider.value.scrollLeft);
  return horizontalSlider.value.scrollLeft == 0;
});
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
