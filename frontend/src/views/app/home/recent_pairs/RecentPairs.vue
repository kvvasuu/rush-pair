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
      <PairAvatar
        v-for="(pair, index) in arr"
        :pair="pair"
        :key="`pair_${index}`"
      ></PairAvatar>

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
import photo from "../../../../../../backend/uploads/lukaszkwas96_gmail_com.png";
import photo1 from "../../../../../../backend/uploads/lukaszkwas96_gmail_com1.png";
import photo2 from "../../../../../../backend/uploads/lukaszkwas96_gmail_com2.png";
import photo3 from "../../../../../../backend/uploads/lukaszkwas96_gmail_com3.png";
import photo4 from "../../../../../../backend/uploads/lukaszkwas96_gmail_com4.png";
import PairAvatar from "./PairAvatar.vue";

const arr = [photo, photo1, photo2, photo3, photo4, photo, photo2, photo1];

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
