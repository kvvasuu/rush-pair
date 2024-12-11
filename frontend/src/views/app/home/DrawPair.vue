<template>
  <div class="flex flex-col items-center justify-center">
    <Transition name="fade" mode="out-in">
      <div
        class="rounded-full bg-slate-100 dark:bg-neutral-800 w-full h-full max-w-64 max-h-64 sm:max-w-[30rem] sm:max-h-[30rem] p-6 sm:p-12 shadow-md"
        v-if="!isDrawing"
      >
        <div
          class="rounded-full bg-slate-100 dark:bg-neutral-800 w-full h-full p-6 sm:p-12 shadow-md"
        >
          <button
            class="rounded-full bg-slate-100 dark:bg-neutral-800 w-full h-full shadow-top border-slate-100 dark:border-stone-800 border-4 sm:border-8 group"
            @click="startDrawing"
            :disabled="mainStore.isDrawing"
          >
            <div
              class="rounded-full bg-red-500 dark:bg-red-600/60 w-full h-full shadow-inner shadow-red-950/25 p-4"
            >
              <div
                class="rounded-full bg-red-500 w-full h-full shadow-top flex items-center justify-center transition-all duration-150"
                :class="{
                  'animate-pulse group-active:animate-none group-active:scale-[98%] group-active:shadow-[0_1px_6px_2px_rgba(0,0,0,0.3)]':
                    !mainStore.isDrawing,
                }"
              >
                <Transition name="start-drawing">
                  <div
                    v-if="mainStore.isDrawing"
                    class="absolute bg-red-500 w-full h-full"
                  ></div>
                </Transition>
                <p
                  class="text-slate-100 dark:text-neutral-700 font-bold text-xl sm:text-3xl drop-shadow-md"
                >
                  Rush for Pair!
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div
        v-else
        class="bg-red-500 w-full h-full py-24 flex flex-col items-center justify-center"
      >
        <div
          class="h-full w-full flex flex-col items-center justify-center gap-8"
          v-if="isSearching"
        >
          <BasicSpinner
            :color="
              userStore.settings.theme === 'dark'
                ? 'fill-neutral-700'
                : 'fill-neutral-100'
            "
            class="w-full flex justify-center items-center"
          ></BasicSpinner>
          <p
            class="text-neutral-100 dark:text-neutral-700 font-semibold animate-pulse select-none"
          >
            Searching...
          </p>
        </div>
        <div
          class="h-full w-full flex flex-col items-center justify-center text-center"
          v-else
        >
          <p
            class="text-neutral-100 dark:text-neutral-700 font-semibold select-none"
          >
            {{ mainStore.socketMessage }}
          </p>
          <p
            v-if="!mainStore.pairId"
            class="text-neutral-100 dark:text-neutral-700 text-sm select-none"
          >
            Try again later or wait for others :D
          </p>
        </div>

        <div class="w-full flex justify-center">
          <button
            @click="stopDrawing"
            class="flex items-center text-red-500 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-800 shadow-md py-2 px-6 rounded-xl justify-center text-xl font-semibold transition-colors"
          >
            <span v-if="isSearching">Stop searching</span>
            <span v-else>Back</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import BasicSpinner from "../../../components/BasicSpinner.vue";
import { useMainStore } from "../../../stores";
import { useUserStore } from "../../../stores/userStore";
import { useRouter } from "vue-router";

const emit = defineEmits(["startDrawing", "stopDrawing"]);

const router = useRouter();

const mainStore = useMainStore();
const userStore = useUserStore();

const isDrawing = ref(false);
const isSearching = ref(false);

const startSearching = async () => {
  isSearching.value = true;
  userStore.startDrawingAPair();
};

const startDrawing = () => {
  emit("startDrawing");
  mainStore.isDrawing = true;
  setTimeout(() => {
    isDrawing.value = true;
    startSearching();
  }, 1200);
};

const stopDrawing = () => {
  isDrawing.value = false;
  emit("stopDrawing");
  mainStore.isDrawing = false;
  userStore.stopDrawingAPair();
};

watch(
  () => mainStore.pairId,
  async (pairId) => {
    setTimeout(() => {
      isSearching.value = false;
    }, 1000);

    await userStore.getPairs();
    router.push(`/app/pairs/${pairId}`);
  },
  { deep: true }
);
watch(
  () => mainStore.isEmpty,
  () => {
    setTimeout(() => {
      isSearching.value = false;
    }, 10000);
  },
  { deep: true }
);

onBeforeUnmount(() => {
  mainStore.isDrawing = false;
  userStore.stopDrawingAPair();
});
</script>

<style scoped>
.start-drawing-enter-active {
  transition: all 1s ease-out;
}

.start-drawing-leave-active {
  transition: all 2s ease-in;
}

.start-drawing-enter-from {
  transform: scale(0%);
  border-radius: 100%;
}
.start-drawing-leave-to {
  transform: scale(100%);
  border-radius: 0%;
}
</style>
