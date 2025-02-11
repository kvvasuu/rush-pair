<template>
  <div
    class="flex items-center justify-center w-60 h-60 rounded-3xl shadow transition-all duration-300 border-4 border-neutral-100 dark:border-neutral-800 overflow-hidden relative bg-neutral-100 dark:bg-neutral-800 select-none"
    :class="{ 'cursor-pointer hover:scale-105': isLoaded }"
    @click="toggleOverlay"
  >
    <img
      :src="imgUrl"
      :alt="name"
      draggable="false"
      @load="onLoad"
      class="object-cover h-full w-full absolute z-10"
      v-show="isLoaded"
    />
    <div
      class="w-full h-full bg-slate-300 dark:bg-neutral-800/60 animate-pulse absolute flex items-center justify-center font-semibold text-lg text-neutral-400 dark:text-neutral-600 select-none"
      v-if="!isLoaded"
    >
      {{ name }}
    </div>
    <Transition name="fade" mode="out-in">
      <Teleport to="body">
        <BasicOverlay
          v-if="isOverlayVisible"
          @close="toggleOverlay"
          class="overflow-y-hidden"
        >
          <div
            class="w-full h-full flex flex-col justify-end relative overflow-y-hidden"
          >
            <img
              :src="imgUrl"
              :alt="name"
              draggable="false"
              class="object-cover h-3/5 w-full absolute top-0 img"
            />

            <div
              class="w-full h-3/5 pt-10 flex flex-col items-start justify-start z-10 overflow-y-auto"
            >
              <div
                class="w-full px-6 flex flex-col items-start justify-start gap-6"
              >
                <h1 class="text-4xl font-bold text-neutral-100 drop-shadow">
                  {{ name }}
                </h1>

                <button
                  class="px-10 py-3 w-full md:w-auto font-semibold bg-main-gradient hover:bg-main-gradient-dark text-neutral-100 shadow-md rounded-xl justify-center transition-all drop-shadow-sm"
                >
                  <i class="fa-solid fa-play mr-2"></i> Play
                </button>
              </div>

              <div class="overflow-y-auto mt-4 sm:mt-10 px-6 pb-6 flex">
                <div class="w-1/2">
                  <p
                    class="text-sm font-semibold text-neutral-500 dark:text-neutral-400"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </div>
                <div class="w-1/2 flex flex-col px-4">
                  <div
                    class="w-full h-full flex flex-col bg-neutral-800 rounded-md"
                  >
                    <p
                      class="w-full p-1 text-center text-md shadow-inner font-semibold text-neutral-500 dark:text-neutral-400"
                    >
                      Games in progress:
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BasicOverlay>
      </Teleport>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicOverlay from "../../../components/containers/BasicOverlay.vue";

const props = defineProps({ name: String });

const isLoaded = ref(false);

const onLoad = () => {
  isLoaded.value = true;
};

const imgUrl = new URL(
  `../../../assets/images/${props.name}.webp`,
  import.meta.url
).href;

const isOverlayVisible = ref(false);
const toggleOverlay = () => {
  isOverlayVisible.value = !isOverlayVisible.value;
};
</script>

<style scoped>
.img {
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 70%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>
