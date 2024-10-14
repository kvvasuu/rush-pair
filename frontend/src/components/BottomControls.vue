<template>
  <div
    class="w-full h-full bg-neutral-800 flex items-center justify-center md:hidden"
  >
    <nav
      class="w-full max-w-[666px] h-full flex items-center justify-between px-2"
    >
      <RouterLink
        to="/app"
        class="max-w-28 w-full h-full flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-all"
      >
        <i
          class="fa-solid fa-house text-3xl text-neutral-500"
          :class="{ 'text-neutral-300': route.path === '/app' }"
        ></i>
      </RouterLink>
      <RouterLink
        to="/app/stars"
        class="max-w-28 w-full h-full flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-all"
      >
        <i
          class="fa-solid fa-star text-3xl"
          :class="{ 'text-neutral-300': route.path === '/app/stars' }"
        ></i>
      </RouterLink>
      <RouterLink
        to="/app/pairs"
        class="max-w-28 w-full h-full flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-all"
      >
        <i
          class="fa-solid fa-handshake-simple text-3xl"
          :class="{ 'text-neutral-300': route.path === '/app/pairs' }"
        ></i>
      </RouterLink>
      <RouterLink
        to="/app/settings"
        class="max-w-28 w-full h-full flex items-center justify-center text-neutral-500 hover:text-neutral-300 transition-all"
      >
        <i
          class="fa-solid fa-bars text-3xl"
          :class="{ 'text-neutral-300': route.path === '/app/settings' }"
        ></i>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";

const route = useRoute();
</script>
