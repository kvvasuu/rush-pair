<template>
  <div
    class="flex items-center justify-center w-60 h-60 rounded-3xl shadow transition-all duration-300 overflow-hidden relative bg-neutral-100 dark:bg-neutral-800 select-none"
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

            <div class="w-full h-3/5 p-6 z-10 overflow-y-auto">
              <h1 class="text-4xl font-bold mb-6 text-neutral-100 drop-shadow">
                {{ name }}
              </h1>
              <div class="overflow-y-auto">
                <p
                  class="text-lg font-semibold text-neutral-500 dark:text-neutral-400"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
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
