<template>
  <div
    class="fixed left-0 top-0 w-16 xl:w-56 h-full hidden md:flex bg-neutral-100 dark:bg-neutral-800 flex-col items-center justify-start border-r-[1px] border-neutral-300 dark:border-neutral-750"
  >
    <div class="w-full px-3 py-5 max-w-20">
      <img src="/logo_sygnet.png" alt="RushPair" class="w-full h-full" />
    </div>

    <nav
      class="w-full h-full flex flex-col items-center justify-start mt-8 gap-2"
    >
      <RouterLink to="/app" class="menu-link">
        <div class="w-12 flex justify-center items-center">
          <i
            class="fa-solid fa-house text-3xl transition-all duration-150"
            :class="{ 'text-rose-500': isRouteActive }"
          ></i>
        </div>

        <p
          class="font-semibold hidden xl:block transition-all duration-150"
          :class="{ 'text-rose-500': isRouteActive }"
        >
          Home
        </p>
      </RouterLink>
      <RouterLink to="/app/stars" class="menu-link">
        <div class="w-12 flex justify-center items-center">
          <i
            class="fa-solid fa-star text-3xl transition-all duration-150"
            :class="{
              'text-rose-500': route.path.startsWith('/app/stars'),
            }"
          ></i>
        </div>
        <p
          class="font-semibold hidden xl:block transition-all duration-150"
          :class="{
            'text-rose-500': route.path.startsWith('/app/stars'),
          }"
        >
          Stars
        </p>
      </RouterLink>
      <RouterLink to="/app/pairs" class="menu-link">
        <div class="w-12 flex justify-center items-center">
          <i
            class="fa-solid fa-handshake-simple text-3xl transition-all duration-150"
            :class="{
              'text-rose-500': route.path.startsWith('/app/pairs'),
            }"
          ></i>
        </div>
        <p
          class="font-semibold hidden xl:block transition-all duration-150"
          :class="{
            'text-rose-500': route.path.startsWith('/app/pairs'),
          }"
        >
          Pairs
        </p>
      </RouterLink>
      <RouterLink to="/app/settings" class="py-6 mt-auto menu-link">
        <div class="w-12 flex justify-center items-center">
          <i
            class="fa-solid fa-bars text-3xl transition-all duration-150"
            :class="{
              'text-rose-500': route.path.startsWith('/app/settings'),
            }"
          ></i>
        </div>
        <p
          class="font-semibold hidden xl:block transition-all duration-150"
          :class="{
            'text-rose-500': route.path.startsWith('/app/settings'),
          }"
        >
          Settings
        </p>
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

<style lang="postcss" scoped>
.menu-link {
  @apply h-10 w-full flex items-center justify-center xl:justify-start xl:px-4 md:h-14 gap-6 text-neutral-400 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-slate-50/5;
  transition: background-color 150ms;
}
</style>
