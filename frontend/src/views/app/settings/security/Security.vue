<template>
  <div
    class="absolute top-0 pt-20 pb-12 flex flex-col items-center justify-start w-full h-[calc(100%-4rem)] md:h-full overflow-y-auto"
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
    <button
      class="mt-8 mb-6 rounded-lg w-4/5 max-w-[666px] flex items-center text-xl text-neutral-600 dark:text-neutral-400 transition-all p-3 px-2 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative rounded-t-lg"
      @click="togglePasswordChangeOverlay"
    >
      <i class="fa-solid fa-lock w-10 text-center"></i>
      <span class="px-1 select-none">{{ t("settings.changePassword") }}</span>
      <i
        class="fa-solid fa-angle-right ml-auto mr-3 text-neutral-600 dark:text-neutral-500"
      ></i>
    </button>
    <button
      class="mt-auto rounded-lg overflow-hidden min-h-[52px] max-w-[666px] w-4/5 flex items-center justify-center text-center p-3 text-red-500 font-semibold cursor-pointer bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all"
      @click="toggleDeleteAccountOverlay"
    >
      <div class="relative">
        <span class="select-none">{{ t("settings.deleteAccount") }}</span>
        <i
          class="fa-solid fa-trash-can absolute h-full flex items-center -right-6 top-0"
        ></i>
      </div>
    </button>
    <Transition name="fade" mode="out-in">
      <Teleport to="body">
        <DeleteAccountOverlay
          v-if="deleteAccountOverlay"
          @close="toggleDeleteAccountOverlay"
        ></DeleteAccountOverlay>
      </Teleport>
    </Transition>
    <Transition name="fade" mode="out-in">
      <Teleport to="body">
        <PasswordChangeOverlay
          v-if="passwordChangeOverlay"
          @close="togglePasswordChangeOverlay"
        ></PasswordChangeOverlay>
      </Teleport>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserAvatar from "../../../../components/UserAvatar.vue";
import DeleteAccountOverlay from "./DeleteAccountOverlay.vue";
import PasswordChangeOverlay from "./PasswordChangeOverlay.vue";
import { useUserStore } from "../../../../stores/userStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const userStore = useUserStore();

const passwordChangeOverlay = ref(false);
const togglePasswordChangeOverlay = () => {
  passwordChangeOverlay.value = !passwordChangeOverlay.value;
};

const deleteAccountOverlay = ref(false);
const toggleDeleteAccountOverlay = () => {
  deleteAccountOverlay.value = !deleteAccountOverlay.value;
};
</script>
