<template>
  <div class="flex flex-col items-center justify-center">
    <Transition name="fade" mode="out-in">
      <div
        class="rounded-full bg-slate-100 dark:bg-neutral-800 w-full h-full max-w-64 max-h-64 sm:max-w-[30rem] sm:max-h-[30rem] p-3 sm:p-8 shadow-md"
        v-if="!isDrawing"
      >
        <div
          class="rounded-full bg-slate-100 dark:bg-neutral-800 w-full h-full p-2 sm:p-6 shadow-md"
        >
          <button
            class="rounded-full bg-slate-100 dark:bg-neutral-800 w-full h-full shadow-top border-slate-100 dark:border-stone-900 border-4 sm:border-8 group"
            @click="startDrawing"
            :disabled="mainStore.isDrawing"
          >
            <div
              class="rounded-full bg-main-gradient dark:bg-main-gradient-dark w-full h-full shadow-inner shadow-red-950/25 p-4"
            >
              <div
                class="rounded-full bg-main-gradient w-full h-full shadow-top p-1 flex items-center justify-center transition-all duration-150"
                :class="{
                  'group-active:animate-none group-active:scale-[98%] group-hover:scale-[101%] group-active:shadow-[0_1px_6px_2px_rgba(0,0,0,0.3)]':
                    !mainStore.isDrawing,
                }"
              >
                <Transition name="start-drawing">
                  <div
                    v-if="mainStore.isDrawing"
                    class="absolute bg-main-gradient w-full h-full"
                  ></div>
                </Transition>
                <p
                  class="text-slate-100 dark:text-neutral-800 font-bold text-xl sm:text-3xl drop-shadow-md"
                >
                  {{ buttonTitle }}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div
        v-else
        class="bg-main-gradient w-full h-full flex flex-col items-center justify-center"
        :class="{ 'bg-main-gradient-dark': mainStore.pairId }"
      >
        <div
          class="h-full w-full mt-24 flex flex-col items-center justify-center gap-8"
          v-if="isSearching && !mainStore.pairId"
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
          class="h-full w-full mt-24 flex flex-col items-center justify-center text-center"
          v-else-if="!mainStore.pairId"
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
            class="text-neutral-100 dark:text-neutral-700 font-semibold select-none mt-8"
          >
            {{ mainStore.socketMessage }}
          </p>
          <p
            v-if="!mainStore.pairId"
            class="text-neutral-100 dark:text-neutral-700 text-sm select-none"
          >
            Try again later or wait for others.
          </p>
        </div>
        <Transition name="fade">
          <div
            class="w-full absolute sm:relative top-0 h-[calc(100%-4rem)] overflow-hidden sm:w-2/3 sm:h-2/3 flex flex-col items-center justify-start py-24 px-4 sm:py-16 sm:px-16 bg-slate-200 dark:bg-neutral-800 sm:rounded-2xl shadow-lg dark:text-neutral-300 text-slate-700"
            v-if="mainStore.pairId"
          >
            <i class="fa-solid fa-comments text-8xl mt-8 text-red-500"></i>
            <p
              class="font-semibold text-center text-3xl select-none mt-10"
              v-html="pairedTite"
            ></p>
            <button
              @click="router.push(`/app/pairs/${mainStore.pairId}`)"
              class="flex items-center mb-0 mt-auto justify-self-end text-neutral-50 dark:text-neutral-800 bg-red-500 hover:bg-red-600 dark:hover:bg-red-500/80 shadow-md py-2 px-6 rounded-xl justify-center text-xl font-semibold transition-colors"
            >
              <span>Start chatting</span>
            </button>
            <div class="w-full absolute bottom-0 left-0 h-">
              <div
                class="dark:bg-neutral-400 bg-neutral-700 h-2 loading-animation"
              ></div>
            </div>
          </div>
        </Transition>

        <div class="w-full flex justify-center mb-24" v-if="!mainStore.pairId">
          <button
            @click="stopDrawing"
            class="flex items-center text-rose-600 dark:text-rose-500 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-800 shadow-md py-2 px-6 rounded-xl justify-center text-xl font-semibold transition-colors"
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

const displayPairedTitle = () => {
  const pairedTitles = [
    "You've Been Paired!",
    "Success!</br>Your Chat Awaits.",
    "Pair Found!</br>Get Ready to Chat.",
  ];

  const titleIndex = Math.floor(Math.random() * pairedTitles.length);
  return pairedTitles[titleIndex];
};
const pairedTite = displayPairedTitle();

const displayButtonTitle = () => {
  const buttonTitles = [
    "Rush for Pair!",
    "Find a Pair!",
    "Match Me Now!",
    "Find Someone!",
    "Let's Pair Up!",
    "Get Matched!",
  ];

  const titleIndex = Math.floor(Math.random() * buttonTitles.length);
  return buttonTitles[titleIndex];
};

const buttonTitle = displayButtonTitle();

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

let pairedTimeout: ReturnType<typeof setTimeout> | null = null;

watch(
  () => mainStore.pairId,
  async (pairId) => {
    setTimeout(() => {
      isSearching.value = false;
    }, 1000);

    await userStore.getPairs();
    pairedTimeout = setTimeout(() => {
      router.push(`/app/pairs/${pairId}`);
    }, 6000);
  },
  { deep: true }
);

let isEmptyTimeout: ReturnType<typeof setTimeout> | null = null;

watch(
  () => mainStore.isEmpty,
  () => {
    isEmptyTimeout = setTimeout(() => {
      isSearching.value = false;
    }, 10000);
  },
  { deep: true }
);

onBeforeUnmount(() => {
  mainStore.isDrawing = false;
  userStore.stopDrawingAPair();
  if (isEmptyTimeout) clearTimeout(isEmptyTimeout);
  if (pairedTimeout) clearTimeout(pairedTimeout);
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
.loading-animation {
  border-top-right-radius: 10rem;
  border-bottom-right-radius: 10rem;
  animation: loading 5500ms linear 1 forwards;
}

@keyframes loading {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}
</style>
