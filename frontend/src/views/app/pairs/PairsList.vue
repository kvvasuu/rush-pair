<template>
  <div
    class="absolute top-0 pt-20 pb-12 flex flex-col items-center justify-start w-full h-[calc(100%-4rem)] md:h-full overflow-y-auto"
  >
    <div
      class="flex w-full h-full items-center justify-center flex-col gap-8 text-neutral-500 select-none max-w-[666px]"
      v-if="userStore.pairs?.length <= 0"
    >
      <p class="text-xl">{{ t("pairs.noPairs") }}</p>
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
        v-model="searchValue"
        :placeholder="t('general.search') + '...'"
      />
      <label
        for="search-input"
        class="absolute left-5 h-full flex items-center top-0 text-neutral-500 dark:text-neutral-400 text-xl"
        ><i class="fa-solid fa-magnifying-glass"></i
      ></label>
    </div>
    <div class="w-full h-full mt-2 max-w-[666px]">
      <ul class="w-full">
        <PairListElement
          v-for="pair in pairsList"
          :key="pair.id"
          :pair="pair"
          :search-value="searchValue"
        ></PairListElement>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../../../stores/userStore";
import { ref, watch } from "vue";
import PairListElement from "./PairListElement.vue";
import { PairInfo } from "../../../types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const userStore = useUserStore();

userStore.getPairs();

const searchValue = ref("");
const pairsList = ref<PairInfo[]>([...userStore.pairs]);

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
watch(
  () => userStore.pairs,
  (newPairs) => {
    pairsList.value = [...newPairs];
  }
);
</script>
