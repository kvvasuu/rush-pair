<template>
  <div
    class="fixed left-0 top-0 w-16 xl:w-56 h-full hidden md:flex bg-neutral-100 dark:bg-neutral-800 flex-col items-center justify-start border-r-[1px] border-neutral-300 dark:border-neutral-750"
  >
    <RouterLink to="/app" class="w-full px-3 py-5 max-w-20"
      ><img
        src="/logo_sygnet.png"
        alt="RushPair"
        class="w-full h-full"
        draggable="false"
    /></RouterLink>

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
          {{ t("general.home") }}
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
          {{ t("general.stars") }}
        </p>
      </RouterLink>
      <RouterLink
        to="/app/pairs"
        class="menu-link"
        :title="
          userStore.getAllUnreadMessages
            ? t('general.unreadMessages', {
                count: userStore.getAllUnreadMessages,
              })
            : t('general.pairs')
        "
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
          >
            {{
              userStore.getAllUnreadMessages < 100
                ? userStore.getAllUnreadMessages
                : "99+"
            }}
          </div>
        </div>
        <p
          class="font-semibold hidden xl:block transition-all duration-150"
          :class="{
            'text-rose-500': route.path.startsWith('/app/pairs'),
          }"
        >
          {{ t("general.pairs") }}
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
          {{ t("general.settings") }}
        </p>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
import { computed } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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

<style lang="postcss" scoped>
.menu-link {
  @apply h-10 w-full flex items-center justify-center xl:justify-start xl:pl-4 md:h-14 gap-6 text-neutral-400 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-slate-50/5;
  transition: background-color 150ms;
}
</style>
