<template>
  <main
    class="w-full h-full flex justify-center relative bg-slate-200 dark:bg-neutral-900 overflow-hidden"
  >
    <header
      class="flex justify-center items-center w-full h-16 relative bg-slate-200 dark:bg-neutral-800 shadow z-30"
    >
      <div
        class="text-slate-700 dark:text-neutral-300 text-xl font-semibold min-w-0 max-w-52 min-[400px]:max-w-72 sm:max-w-96 relative"
      >
        <p class="w-full select-none truncate">
          {{ gameName }}
        </p>
      </div>
      <button
        class="absolute flex items-center gap-2 left-0 top-0 text-neutral-600 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300 transition-all cursor-pointer py-3 px-4"
        @click="router.push({ name: 'GamesList' })"
        v-if="route.params.id"
      >
        <i class="fa-solid fa-angle-left text-4xl"></i>
        <span class="text-xl hidden md:block select-none">{{
          t("games.games")
        }}</span>
      </button>
    </header>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const gameName = computed(() => {
  return route.params.id ? route.name : t("general.games");
});
</script>
