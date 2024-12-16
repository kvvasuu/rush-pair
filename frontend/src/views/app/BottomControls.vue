<template>
  <div
    class="fixed bottom-0 w-full h-16 md:hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
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
        class="relative max-w-28 w-full h-full flex items-center justify-center text-neutral-300 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        <div class="w-12 flex justify-center items-center relative">
          <i
            class="fa-solid fa-comments text-3xl transition-all duration-150"
            :class="{
              'text-rose-500': route.path.startsWith('/app/pairs'),
            }"
          ></i>
          <div
            v-if="!!userStore.getAllUnreadMessages"
            class="absolute -right-1 -top-2 h-6 min-w-6 px-1 flex items-center justify-center text-xs font-semibold text-neutral-100 rounded-full bg-rose-500 shadow"
            :title="`You have ${userStore.getAllUnreadMessages} unread message${
              userStore.getAllUnreadMessages === 1 ? '' : 's'
            }.`"
          >
            {{
              userStore.getAllUnreadMessages < 100
                ? userStore.getAllUnreadMessages
                : "99+"
            }}
          </div>
        </div>
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
import { useUserStore } from "../../stores/userStore";

const userStore = useUserStore();

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
