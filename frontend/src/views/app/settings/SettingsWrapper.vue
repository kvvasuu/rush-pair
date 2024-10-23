<template>
  <main
    class="w-full h-full flex justify-center relative bg-slate-200 dark:bg-neutral-900 overflow-hidden"
  >
    <div
      class="flex justify-center items-center w-full h-16 relative bg-slate-200 dark:bg-neutral-800"
    >
      <p
        class="text-neutral-800 dark:text-neutral-300 font-semibold text-xl select-none"
      >
        {{ route.name }}
      </p>

      <button
        class="absolute left-0 top-0 text-4xl text-neutral-600 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300 transition-all cursor-pointer py-3 px-4"
        :class="{
          'opacity-30 cursor-auto hover:text-neutral-500': mainStore.isLoading,
        }"
        @click="router.back()"
        v-if="route.name !== 'Settings'"
        :disabled="mainStore.isLoading"
      >
        <i class="fa-solid fa-angle-left"></i>
      </button>
    </div>
    <RouterView
      v-slot="{ Component }"
      class="absolute top-0 w-full h-[calc(100%-4rem)]"
    >
      <Transition name="slide-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "../../../stores";

const mainStore = useMainStore();

const router = useRouter();
const route = useRoute();
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
