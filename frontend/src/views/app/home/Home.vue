<template>
  <main
    class="flex flex-col items-center h-full relative w-full"
    :class="{ 'bg-main-gradient': isDrawing }"
  >
    <Transition name="fade" mode="out-in">
      <Teleport to="body">
        <InformationModal
          v-if="mainStore.showCoinsCollectionModal"
          @close="mainStore.showCoinsCollectionModal = false"
        >
          <template #title>
            <h2
              class="text-center font-bold text-3xl text-neutral-600 dark:text-neutral-300"
            >
              {{ t("home.congratulations") }}
            </h2>
            <h3
              class="text-center font-semibold text-lg text-neutral-600 dark:text-neutral-300"
            >
              {{ t("home.youEarnRushCoin") }}
            </h3>
          </template>
          <template #content>
            <div class="flex flex-col items-center justify-center gap-4">
              <img
                src="/RushCoin.svg"
                alt="RushCoin"
                draggable="false"
                class="aspect-square w-24 select-none my-2"
              />
              <p class="text-center font-semibold">
                {{ t("home.remember") }}
              </p>
            </div>
          </template>
        </InformationModal>
      </Teleport>
    </Transition>
    <div
      class="h-28 w-full flex items-center justify-center"
      v-if="isLoading && !isDrawing"
    >
      <BasicSpinner></BasicSpinner>
    </div>

    <RecentPairs
      class="md:max-w-[666px]"
      v-else-if="!isLoading && !isDrawing"
    ></RecentPairs>
    <DrawPair
      class="absolute w-full"
      :class="[
        isEnlarged
          ? 'h-full sm:h-full top-0 sm:top-0'
          : 'h-64 top-[calc(50%-8rem)] sm:h-[30rem] sm:top-[calc(50%-15rem)]',
      ]"
      @start-drawing="startDrawing"
      @stop-drawing="stopDrawing"
    ></DrawPair>
    <section
      class="mb-24 sm:mb-12 mt-auto text-neutral-400 dark:text-neutral-600 select-none"
      v-if="!isDrawing"
    >
      <p class="text-center font-bold text-base sm:text-lg mb-1">
        {{ t("home.howItWorks") }}
      </p>
      <p class="font-semibold text-xs sm:text-sm">
        <span class="mr-1 w-3 inline-block text-right">1.</span
        >{{ t("home.howItWorks1") }}
      </p>
      <p class="font-semibold text-xs sm:text-sm">
        <span class="mr-1 w-3 inline-block text-right">2.</span
        >{{ t("home.howItWorks2") }}
      </p>
      <p class="font-semibold text-xs sm:text-sm">
        <span class="mr-1 w-3 inline-block text-right">3.</span
        >{{ t("home.howItWorks3") }}
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import RecentPairs from "./recent_pairs/RecentPairs.vue";
import DrawPair from "./DrawPair.vue";
import BasicSpinner from "../../../components/BasicSpinner.vue";
import InformationModal from "../../../components/containers/InformationModal.vue";
import { useUserStore } from "../../../stores/userStore.ts";
import { useMainStore } from "../../../stores/index.ts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const userStore = useUserStore();
const mainStore = useMainStore();

const isLoading = ref(true);
const isDrawing = ref(false);

const isEnlarged = ref(false);

const startDrawing = () => {
  isEnlarged.value = true;
  setTimeout(() => {
    isDrawing.value = true;
  }, 1200);
};

const stopDrawing = () => {
  isDrawing.value = false;
  setTimeout(() => {
    isEnlarged.value = false;
  }, 500);
};

onMounted(async () => {
  await userStore.getPairs();
  isLoading.value = false;
});
</script>
