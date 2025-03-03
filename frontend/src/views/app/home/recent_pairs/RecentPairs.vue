<template>
  <div
    class="w-full flex flex-col items-center justify-center pt-4 px-6 md:px-0"
  >
    <p
      class="w-full border-b-[1px] border-neutral-300 dark:border-neutral-750 text-neutral-400 dark:text-neutral-500 select-none"
    >
      {{ t("home.recentPairs") }}
    </p>
    <div class="w-full relative flex items-center justify-center min-h-24">
      <p
        v-if="pairs?.length <= 0"
        class="text-neutral-400 dark:text-neutral-500 select-none"
      >
        {{ t("home.noPairsYet") }}
      </p>

      <div
        class="w-full flex gap-6 py-4 scroll-px-2 px-2 overflow-x-scroll scroll-hide snap-x"
        ref="horizontalSlider"
        v-else
      >
        <div class="relative" v-for="pair in pairs" :key="pair?.id">
          <PairAvatar
            :pair="pair"
            :is-active="pair.isActive"
            class="snap-start min-w-[72px] max-w-[72px] cursor-pointer"
            :class="{ 'pair-fav': pair.isFavourite }"
            :title="
              pair.unreadMessagesCount
                ? t('general.unreadMessages', {
                    count: pair.unreadMessagesCount,
                  })
                : pair?.name
            "
            @click="goToPair(pair.id)"
          ></PairAvatar>
          <div
            v-if="!!pair.unreadMessagesCount"
            class="absolute right-0 top-0 h-6 min-w-6 px-1 flex items-center justify-center text-xs font-semibold text-neutral-100 rounded-full bg-rose-500 shadow"
          >
            {{
              pair.unreadMessagesCount < 100 ? pair.unreadMessagesCount : "99+"
            }}
          </div>
        </div>

        <button
          class="h-full px-2 absolute left-0 top-0 items-center justify-center rounded-full text-xl text-neutral-200/90 hover:text-neutral-100/90 transition-all cursor-pointer outline-none"
          v-if="showLeftArrow && !isTouchDevice"
          @click="scrollLeft"
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
        <button
          class="h-full px-2 absolute rotate-180 right-0 top-0 items-center justify-center rounded-full text-xl text-neutral-200/90 hover:text-neutral-100/90 transition-all cursor-pointer outline-none"
          v-if="showRightArrow && !isTouchDevice"
          @click="scrollRight"
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useUserStore } from "../../../../stores/userStore.ts";
import { useRouter } from "vue-router";
import PairAvatar from "../../../../components/PairAvatar.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();
const userStore = useUserStore();

const pairs = computed(() => {
  return [...userStore.pairs]
    .filter((pair) => !pair?.isBlocked)
    .sort(
      (a, b) =>
        Number(b.isFavourite) - Number(a.isFavourite) || b.pairedAt - a.pairedAt
    );
});

const goToPair = (id: string) => {
  router.push(`/app/pairs/${id}`);
};

const isTouchDevice = ref(
  "ontouchstart" in window || navigator.maxTouchPoints > 0
);

const horizontalSlider = ref<HTMLElement | null>();

const showLeftArrow = ref(false);
const scrollLeft = () => {
  if (!horizontalSlider.value || !horizontalSlider.value.parentElement) return;
  horizontalSlider.value.scrollTo({
    left:
      horizontalSlider.value.scrollLeft -
      horizontalSlider.value.parentElement?.clientWidth,
    behavior: "smooth",
  });
};

const showRightArrow = ref(false);
const scrollRight = () => {
  if (!horizontalSlider.value || !horizontalSlider.value.parentElement) return;
  horizontalSlider.value.scrollTo({
    left:
      horizontalSlider.value.scrollLeft +
      horizontalSlider.value.parentElement?.clientWidth,
    behavior: "smooth",
  });
};

const checkScrollPosition = () => {
  if (!horizontalSlider.value || !horizontalSlider.value.parentElement) return;
  showLeftArrow.value = horizontalSlider.value.scrollLeft > 0;
  showRightArrow.value =
    horizontalSlider.value.scrollLeft <
    horizontalSlider.value.scrollWidth - horizontalSlider.value.clientWidth - 1;
};

onMounted(() => {
  if (!horizontalSlider.value) return;
  horizontalSlider.value.addEventListener("scroll", checkScrollPosition);
  checkScrollPosition();
});

onUnmounted(() => {
  if (!horizontalSlider.value) return;
  horizontalSlider.value.removeEventListener("scroll", checkScrollPosition);
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

.pair-fav {
  padding: 2px;
  background: linear-gradient(
    20deg,
    rgba(245, 121, 11, 1) 0%,
    rgba(253, 251, 71, 1) 100%
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
