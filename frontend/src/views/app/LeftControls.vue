<template>
  <div
    class="fixed left-0 top-0 w-16 xl:w-56 h-full hidden md:flex bg-neutral-100 dark:bg-neutral-800 flex-col items-center justify-start border-r border-neutral-300 dark:border-neutral-750"
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
      <RouterLink to="/app" class="menu-link flex flex-row">
        <div class="w-12 flex justify-center items-center">
          <i
            class="fa-solid fa-house text-3xl transition-all duration-150"
            :class="{ 'text-pink-600': isRouteActive }"
          ></i>
        </div>

        <p
          class="font-semibold hidden xl:block transition-all duration-150"
          :class="{ 'text-pink-600': isRouteActive }"
        >
          {{ t("general.home") }}
        </p>
      </RouterLink>
      <RouterLink to="/app/games" class="menu-link flex flex-row">
        <div class="w-12 flex justify-center items-center">
          <i
            class="fa-solid fa-gamepad text-3xl transition-all duration-150"
            :class="{
              'text-pink-600': route.path.startsWith('/app/games'),
            }"
          ></i>
        </div>
        <p
          class="font-semibold hidden xl:block transition-all duration-150"
          :class="{
            'text-pink-600': route.path.startsWith('/app/games'),
          }"
        >
          {{ t("general.games") }}
        </p>
      </RouterLink>
      <RouterLink
        to="/app/pairs"
        class="menu-link flex flex-row"
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
              'text-pink-600': route.path.startsWith('/app/pairs'),
            }"
          ></i>
          <div
            v-if="!!userStore.getAllUnreadMessages"
            class="absolute -right-1 -top-2 h-6 min-w-6 px-1 flex items-center justify-center text-xs font-semibold text-neutral-100 rounded-full bg-pink-600 shadow"
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
            'text-pink-600': route.path.startsWith('/app/pairs'),
          }"
        >
          {{ t("general.pairs") }}
        </p>
      </RouterLink>
      <button
        class="mt-auto w-full justify-self-end pl-0 xl:pl-4 cursor-pointer menu-link flex flex-row"
        @click="showRushCoinModal = true"
      >
        <div class="w-12 relative flex justify-center items-center">
          <img
            src="/RushCoin.svg"
            alt="RushCoin"
            draggable="false"
            class="aspect-square w-4/5 select-none my-2 hidden xl:block"
          />
          <img
            src="/RushCoinBlank.svg"
            alt="RushCoin"
            draggable="false"
            class="aspect-square w-4/5 select-none my-2 block xl:hidden"
          />
          <div
            class="absolute w-full flex items-center justify-center h-full font-bold xl:hidden text-center transition-all duration-150 select-none text-neutral-100"
            :class="userStore.rushCoins > 9 ? 'text-md' : 'text-lg'"
          >
            {{ userStore.rushCoins }}
          </div>
        </div>
        <p
          class="font-semibold hidden xl:block text-center transition-all duration-150 select-none"
        >
          {{ t("general.rushCoins", userStore.rushCoins) }}
        </p>
      </button>
      <RouterLink to="/app/settings" class="menu-link flex flex-row">
        <div class="w-12 flex justify-center items-center">
          <i
            class="fa-solid fa-bars text-3xl transition-all duration-150"
            :class="{
              'text-pink-600': route.path.startsWith('/app/settings'),
            }"
          ></i>
        </div>
        <p
          class="font-semibold hidden xl:block transition-all duration-150"
          :class="{
            'text-pink-600': route.path.startsWith('/app/settings'),
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
    !route.path.startsWith("/app/games") &&
    !route.path.startsWith("/app/settings")
  );
});
</script>
