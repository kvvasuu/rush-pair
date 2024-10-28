<template>
  <div
    class="w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
  >
    <nav
      class="w-full max-w-[666px] h-full flex items-center justify-between px-2"
    >
      <RouterLink
        to="/app"
        class="max-w-28 w-full h-full flex items-center justify-center text-neutral-300 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        <i
          class="fa-solid fa-house text-3xl transition-all duration-150"
          :class="{ 'text-rose-500': isRouteActive }"
        ></i>
      </RouterLink>
      <RouterLink
        to="/app/stars"
        class="max-w-28 w-full h-full flex items-center justify-center text-neutral-300 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        <i
          class="fa-solid fa-star text-3xl transition-all duration-150"
          :class="{
            'text-rose-500': route.path.startsWith('/app/stars'),
          }"
        ></i>
      </RouterLink>
      <RouterLink
        to="/app/pairs"
        class="max-w-28 w-full h-full flex items-center justify-center text-neutral-300 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        <i
          class="fa-solid fa-handshake-simple text-3xl transition-all duration-150"
          :class="{
            'text-rose-500': route.path.startsWith('/app/pairs'),
          }"
        ></i>
      </RouterLink>
      <RouterLink
        to="/app/settings"
        class="max-w-28 w-full h-full flex items-center justify-center text-neutral-300 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        <i
          class="fa-solid fa-bars text-3xl transition-all duration-150"
          :class="{
            'text-rose-500': route.path.startsWith('/app/settings'),
          }"
        ></i>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const isRouteActive = computed(() => {
  return (
    route.path.startsWith("/app") &&
    !route.path.startsWith("/app/pairs") &&
    !route.path.startsWith("/app/stars") &&
    !route.path.startsWith("/app/settings")
  );
});
</script>
