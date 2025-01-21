<template>
  <main
    class="flex flex-col items-center justify-center w-full h-full relative"
  >
    <div
      class="logo h-40 drop-shadow select-none"
      :class="
        showUi
          ? 'hover:scale-105 transition-all cursor-pointer duration-500 opacity-95'
          : 'pointer-events-none'
      "
    >
      <a href="https://github.com/kvvasuu/rush-pair" target="_blank"
        ><img src="/logo.png" alt="Rush Pair" width="200px"
      /></a>
    </div>

    <section
      id="controls"
      class="flex flex-col items-center py-32 md:py-16 w-full"
      :class="{ show: showUi }"
    >
      <div
        id="controls-delayed"
        class="flex flex-col items-center justify-center gap-6 px-10 w-full"
      >
        <button
          class="px-8 py-3 w-full mx-10 md:w-auto font-bold text-lg bg-yellow-400 hover:bg-amber-400 rounded-full transition-all drop-shadow-sm"
          @click="toggleAuthModal('register')"
        >
          {{ t("welcomeScreen.createAccount") }}
        </button>
        <button
          class="text-slate-50 md:text-inherit px-8 py-3 w-full mx-10 md:w-auto font-bold text-md bg-transparent hover:bg-slate-200/10 border-[2px] border-slate-200 rounded-full transition-all drop-shadow-sm md:hidden"
          @click="toggleAuthModal('login')"
        >
          {{ t("welcomeScreen.login") }}
        </button>
      </div>
    </section>
    <div
      id="login-button"
      :class="{ show: showUi }"
      class="absolute top-8 right-8 hidden md:block"
    >
      <button
        class="px-6 py-2 font-bold text-md bg-slate-50 hover:bg-slate-200 border-[1px] border-slate-200 rounded-full transition-all drop-shadow-sm"
        @click="toggleAuthModal('login')"
      >
        {{ t("welcomeScreen.login") }}
      </button>
    </div>
    <div
      id="language-button"
      :class="{ show: showUi }"
      class="absolute top-8 left-8 block"
    >
      <button
        class="flex items-center gap-2 px-4 py-2 font-bold text-md hover:bg-slate-200 border-[1px] rounded-full transition-all drop-shadow-sm"
        @click="toggleLanguageSelector"
        :class="showLanguageSelector ? 'bg-slate-200' : 'bg-slate-50'"
      >
        <img
          :src="`/flag-${language.toUpperCase()}.png`"
          alt="flag"
          width="20px"
          class="border-[1px] box-content rounded-sm border-neutral-500"
        /><span>{{ t("general.language") }}</span>
      </button>
      <Transition name="slide-from-left">
        <LanguageSelector
          v-if="showLanguageSelector"
          @close-selector="toggleLanguageSelector"
          @change-language="changeLanguage"
          class="-bottom-[5.3rem] left-2 absolute font-bold"
        >
        </LanguageSelector>
      </Transition>
    </div>
    <Transition name="fade">
      <Teleport to="body">
        <CreateAccount
          v-if="registerModal"
          @close="toggleAuthModal('register')"
          @go-to-login="toggleAuthModal('login')"
        ></CreateAccount>
        <Login v-else-if="loginModal" @close="toggleAuthModal('login')"></Login>
      </Teleport>
    </Transition>
    <footer
      class="absolute bottom-0 left-0 w-full select-none text-[0.5rem] md:text-xs text-neutral-900/50 font-semibold text-center md:text-right px-2"
    >
      <p>{{ t("welcomeScreen.allRightsReserved") }}</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import CreateAccount from "./CreateAccount.vue";
import Login from "./Login.vue";
import LanguageSelector from "../../components/LanguageSelector.vue";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { availableLanguages } from "../../types";
import { changeLocale } from "../../locales/i18n";

const { t } = useI18n();

const showUi = ref(false);

const registerModal = ref(false);
const loginModal = ref(false);

const language = ref<availableLanguages>("en");

if (localStorage.getItem("locale") === "pl") {
  language.value = "pl";
  changeLocale(language.value);
}

const changeLanguage = (lang: availableLanguages) => {
  language.value = lang;
  localStorage.setItem("locale", lang);
  changeLocale(lang);
};

const showLanguageSelector = ref(false);

const toggleLanguageSelector = () => {
  showLanguageSelector.value = !showLanguageSelector.value;
};

const toggleAuthModal = (modalType: string) => {
  switch (modalType) {
    case "register":
      registerModal.value = !registerModal.value;
      break;

    case "login":
      loginModal.value = !loginModal.value;
      break;
  }
};

onMounted(() => {
  setTimeout(() => {
    showUi.value = true;
  }, 1500);
});
</script>

<style scoped>
#controls {
  max-height: 0;
  overflow: hidden;
  transition: all 1s ease;
  opacity: 0;
}

#controls.show {
  max-height: 200px;
  opacity: 1;
}

#controls-delayed,
#login-button,
#language-button {
  opacity: 0;
  transition: all 1s ease;
  pointer-events: none;
}

#controls.show #controls-delayed,
#login-button.show,
#language-button.show {
  opacity: 1;
  transition-delay: 1s;
  pointer-events: auto;
}

.slide-from-left-enter-active {
  transition: all 0.2s ease-out;
}

.slide-from-left-leave-active {
  transition: all 0.2s ease-in;
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  transform: translateX(-200%);
}
</style>
