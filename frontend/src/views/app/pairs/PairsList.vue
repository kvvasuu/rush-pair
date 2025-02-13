<template>
  <div
    class="absolute top-0 pt-20 pb-12 flex flex-col items-center justify-start w-full h-[calc(100%-4rem)] md:h-full overflow-y-auto overflow-x-hidden"
  >
    <div
      class="flex w-full h-full items-center justify-center flex-col gap-8 text-neutral-500 select-none max-w-[666px]"
      v-if="userStore.pairs?.length <= 0"
    >
      <p class="text-xl">{{ t("pairs.noPairsYet") }}</p>
      <i class="fa-solid fa-handshake-simple text-5xl"></i>
      <p class="text-xl">{{ t("pairs.startPairing") }}</p>
    </div>
    <div
      class="relative w-[calc(100%-3rem)] flex justify-center max-w-[666px]"
      v-else
    >
      <input
        id="search-input"
        type="text"
        class="text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 pl-14 bg-neutral-50 hover:bg-neutral-100/90 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-xl placeholder:text-neutral-600 rounded-lg"
        autocomplete="off"
        @keyup="search"
        v-model.trim="searchValue"
        :placeholder="t('general.search') + '...'"
      />
      <label
        for="search-input"
        class="absolute left-5 h-full flex items-center top-0 text-neutral-500 dark:text-neutral-400 text-xl"
        ><i class="fa-solid fa-magnifying-glass"></i
      ></label>
    </div>
    <div class="w-full h-full mt-2 max-w-[666px]">
      <TransitionGroup name="list">
        <div
          class="w-full"
          v-if="pairsBlocked.length > 0 && searchValue.length < 2"
          key="blocked-pairs-toggle"
        >
          <label
            class="flex items-center justify-end gap-2 text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 px-6 sm:px-0 relative cursor-pointer"
          >
            <span class="px-1 select-none">{{
              t("pairs.showBlockedPairs")
            }}</span>

            <input
              type="checkbox"
              value=""
              class="sr-only peer"
              v-model="mainStore.showBlockedPairs"
              true-value="yes"
              false-value=""
            />
            <div
              class="relative w-11 h-6 bg-slate-300/80 dark:bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:bg-neutral-50 dark:peer-checked:after:bg-neutral-300 after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-slate-200 dark:after:bg-neutral-500/80 after:rounded-full after:h-5 after:w-5 after:transition-all"
            ></div>
          </label>
        </div>
        <ul
          class="w-full shadow-inner rounded-md bg-slate-300/60 dark:bg-neutral-800/60"
          v-if="mainStore.showBlockedPairs"
          key="blocked-pairs"
        >
          <PairListElement
            v-for="pair in pairsBlocked"
            :key="pair.id"
            :pair="pair"
          ></PairListElement>
        </ul>

        <ul class="w-full" key="pairs">
          <PairListElement
            v-for="pair in pairs"
            :key="pair.id"
            :pair="pair"
            :search-value="searchValue"
            @onClick="goToPair"
          ></PairListElement>
        </ul>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../../../stores/userStore";
import { useMainStore } from "../../../stores";
import { ref, watch, computed } from "vue";
import PairListElement from "./PairListElement.vue";
import { PairInfo } from "../../../types";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();

const userStore = useUserStore();
const mainStore = useMainStore();
const router = useRouter();

userStore.getPairs();

const searchValue = ref("");
const pairsList = ref<PairInfo[]>([...userStore.pairs]);

const pairs = computed(() => {
  return pairsList.value
    .filter((pair) => !pair?.isBlocked)
    .sort(
      (a, b) =>
        Number(b.isFavourite) - Number(a.isFavourite) || b.pairedAt - a.pairedAt
    );
});

const pairsBlocked = computed(() => {
  return pairsList.value.filter((pair) => pair?.isBlocked);
});

const search = () => {
  if (searchValue.value.length > 1) {
    const lowerCaseQuery = searchValue.value.toLowerCase();
    if (searchValue.value.length >= 2) {
      pairsList.value = userStore.pairs
        .filter((pair) => pair.name.toLowerCase().includes(lowerCaseQuery))
        .slice(0, 10);
    }
  } else {
    pairsList.value = userStore.pairs;
  }
};

const goToPair = (id: string) => {
  router.push(`/app/pairs/${id}`);
};

watch(
  () => userStore.pairs,
  (newPairs) => {
    pairsList.value = [...newPairs];
  }
);
</script>

<style scoped>
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-leave-active {
  position: absolute;
}
</style>
