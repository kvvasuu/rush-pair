<template>
  <main
    class="w-full h-full flex justify-center relative bg-slate-200 dark:bg-neutral-900 overflow-hidden"
  >
    <header
      class="flex justify-center items-center w-full h-16 relative bg-slate-200 dark:bg-neutral-800"
    >
      <p
        class="text-slate-700 dark:text-neutral-300 font-semibold text-xl select-none"
      >
        {{ pairName || "Pairs" }}
      </p>

      <button
        class="absolute flex items-center gap-2 left-0 top-0 text-neutral-600 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300 transition-all cursor-pointer py-3 px-4"
        @click="router.push({ name: 'PairsList' })"
        v-if="route.params.id"
      >
        <i class="fa-solid fa-angle-left text-4xl"></i>
        <span class="text-xl hidden md:block select-none">Pairs</span>
      </button>
    </header>
    <RouterView v-slot="{ Component }">
      <Transition name="slide-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../../../stores/userStore";

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();

const pairName = computed(() => {
  if (route.params.id) {
    return (
      userStore.pairs.filter((el) => el.id === route.params.id)[0].name ||
      "Anonymous user"
    );
  }
});
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
