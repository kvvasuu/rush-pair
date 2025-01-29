<template>
  <div
    class="fixed bottom-0 w-full h-16 md:hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center z-50"
  >
    <Transition name="fade" mode="out-in">
      <Teleport to="body">
        <InformationModal
          v-if="showRushCoinModal"
          @close="showRushCoinModal = false"
        >
          <template #title>
            <img
              src="/RushCoin.svg"
              alt="RushCoin"
              draggable="false"
              class="aspect-square w-24 select-none my-2 absolute -top-12"
            />
            <h2
              class="mt-12 text-center font-bold text-xl text-neutral-600 dark:text-neutral-300"
            >
              {{ t("general.rushCoinsCurrency") }}
            </h2>
          </template>
          <template #content>
            <ul
              class="flex mx-0 sm:mx-8 flex-col items-start justify-center gap-4 text-neutral-600 dark:text-neutral-300 mb-4"
            >
              <li class="ml-8 list-disc">
                <h3 class="font-bold text-lg mb-1">
                  {{ t("general.whatAreRushCoins") }}
                </h3>
                <p class="pl-1 sm:pl-5 font-semibold text-sm">
                  {{ t("general.whatAreRushCoinsDescription") }}
                </p>
              </li>
              <li class="ml-8 list-disc">
                <h3 class="font-bold text-lg mb-1">
                  {{ t("general.howToEarnRushCoins") }}
                </h3>
                <p class="pl-1 sm:pl-5 font-semibold text-sm">
                  {{ t("general.byLogging") }}
                </p>
                <p class="pl-1 sm:pl-5 font-semibold text-sm">
                  {{ t("general.byPlaying") }}
                </p>
              </li>
              <li class="ml-8 list-disc">
                <h3 class="font-bold text-lg mb-1">
                  {{ t("general.howToSpentRushCoins") }}
                </h3>
                <p class="pl-1 sm:pl-5 font-semibold text-sm">
                  {{ t("general.revealRequest") }}
                </p>
              </li>
            </ul>
          </template>
        </InformationModal>
      </Teleport>
    </Transition>
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
      <button
        class="max-w-28 relative w-full h-full flex items-center justify-center mx-2 cursor-pointer"
        @click="showRushCoinModal = true"
      >
        <img
          src="/RushCoinBlank.svg"
          alt="RushCoin"
          draggable="false"
          class="aspect-square h-[72px] select-none my-2 block xl:hidden"
        />
        <div
          class="absolute w-full flex items-center justify-center h-full font-semibold xl:hidden text-3xl text-center select-none text-neutral-100"
        >
          {{ userStore.rushCoins }}
        </div>
      </button>
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
            :title="
              userStore.getAllUnreadMessages
                ? t('general.unreadMessages', {
                    count: userStore.getAllUnreadMessages,
                  })
                : t('general.pairs')
            "
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
import { computed, ref } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useI18n } from "vue-i18n";
import InformationModal from "../../components/containers/InformationModal.vue";

const { t } = useI18n();

const userStore = useUserStore();

const route = useRoute();

const showRushCoinModal = ref(false);

const isRouteActive = computed(() => {
  return (
    route.path.startsWith("/app") &&
    !route.path.startsWith("/app/pairs") &&
    !route.path.startsWith("/app/stars") &&
    !route.path.startsWith("/app/settings")
  );
});
</script>
