<template>
  <div
    class="absolute top-0 pt-20 pb-12 flex flex-col items-center justify-start w-full h-[calc(100%-4rem)] md:h-full overflow-y-auto overflow-x-hidden"
  >
    <div class="flex flex-col items-center justify-center max-w-[666px]">
      <div class="h-24"><UserAvatar></UserAvatar></div>

      <p
        class="text-slate-700 dark:text-neutral-300 font-semibold text-2xl mt-6 select-none"
      >
        {{ userStore.name }}
      </p>
      <p class="text-slate-600 dark:text-neutral-500 text-sm select-none">
        {{ userStore.email }}
      </p>
    </div>
    <ol class="mt-8 mb-6 rounded-lg w-4/5 max-w-[666px]">
      <li>
        <RouterLink
          to="/app/settings/profile"
          class="flex items-center text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative rounded-t-lg"
          ><i class="fa-solid fa-user w-10 text-center"></i>
          <span class="px-1 select-none">{{ t("general.profile") }}</span>

          <i
            class="fa-solid fa-angle-right ml-auto mr-3 text-neutral-600 dark:text-neutral-500"
          ></i>
          <div
            class="bottom-0 right-0 w-[calc(100%-54px)] h-[1px] bg-neutral-200 dark:bg-neutral-700 absolute"
          ></div>
        </RouterLink>
      </li>
      <div class="relative">
        <div
          class="flex items-center text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative cursor-pointer"
          @click="toggleLanguageSelector"
          :class="{ 'bg-neutral-100/50': showLanguageSelector }"
        >
          <i class="fa-solid fa-language w-10 text-center"></i>
          <span class="px-1 select-none">{{ t("general.language") }}</span>

          <i
            class="fa-solid fa-angle-right ml-auto mr-3 text-neutral-600 dark:text-neutral-500 transition-all"
            :class="{ 'rotate-90': showLanguageSelector }"
          ></i>
          <div
            class="bottom-0 right-0 w-[calc(100%-54px)] h-[1px] bg-neutral-200 dark:bg-neutral-700 absolute"
          ></div>
        </div>
        <Transition name="slide-from-right">
          <LanguageSelector
            v-if="showLanguageSelector"
            @close-selector="toggleLanguageSelector"
            @change-language="changeLanguage"
            class="-bottom-[5.3rem] right-1 absolute text-neutral-600 dark:text-neutral-400 font-semibold"
          ></LanguageSelector>
        </Transition>
      </div>

      <label
        class="flex items-center text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative cursor-pointer"
      >
        <i class="fa-solid fa-eye w-10 text-center"></i>
        <span class="px-1 select-none">{{ t("general.theme") }}</span>

        <input
          type="checkbox"
          value=""
          class="sr-only peer"
          v-model="theme"
          @change="changeTheme"
          true-value="dark"
          false-value="light"
          id="theme-toggle"
        />
        <div
          class="absolute right-4 w-11 h-6 bg-neutral-300 dark:bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-yellow-600 peer-checked:after:bg-yellow-500 after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-neutral-100 dark:after:bg-yellow-500/80 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"
        ></div>

        <div
          class="bottom-0 right-0 w-[calc(100%-54px)] h-[1px] bg-neutral-200 dark:bg-neutral-700 absolute"
        ></div>
      </label>
      <li>
        <RouterLink
          to="/app/settings/security"
          class="flex items-center text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative rounded-b-lg"
          ><i class="fa-solid fa-lock w-10 text-center"></i>
          <span class="px-1 select-none">{{ t("general.security") }}</span>
          <i
            class="fa-solid fa-angle-right ml-auto mr-3 text-neutral-600 dark:text-neutral-500"
          ></i>
        </RouterLink>
      </li>
    </ol>
    <button
      class="mt-auto rounded-lg overflow-hidden min-h-[52px] w-4/5 max-w-[666px] flex items-center justify-center text-center p-3 text-red-500 font-semibold cursor-pointer bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all"
      @click="logout"
    >
      <div class="relative">
        <i
          class="fa-solid fa-arrow-right-from-bracket rotate-180 absolute h-full flex items-center -left-6 top-0"
        ></i>
        <span>{{ t("general.logout") }}</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserAvatar from "../../../components/UserAvatar.vue";
import { useUserStore } from "../../../stores/userStore";
import { useI18n } from "vue-i18n";
import LanguageSelector from "../../../components/LanguageSelector.vue";
import { availableLanguages } from "../../../types";
import { changeLocale } from "../../../locales/i18n";

const { t } = useI18n();

const userStore = useUserStore();

const showLanguageSelector = ref(false);

const toggleLanguageSelector = () => {
  showLanguageSelector.value = !showLanguageSelector.value;
};

const changeLanguage = async (lang: availableLanguages) => {
  try {
    if (lang === userStore.settings.language) return;
    changeLocale(lang);
    await userStore.changeSettings({
      language: lang,
    });
  } catch {}
};

const theme = ref(userStore.settings.theme);

const changeTheme = async () => {
  try {
    document.documentElement.setAttribute("data-theme", theme.value);
    await userStore.changeSettings({
      theme: theme.value,
    });
  } catch {}
};

const logout = () => {
  userStore.logout();
};
</script>
