<template>
  <BasicOverlay @close="close">
    <div
      class="flex flex-col items-center justify-start w-full h-full px-12 py-20"
    >
      <div
        class="flex flex-col items-center justify-center text-2xl font-semibold mb-8 gap-3 text-neutral-600 dark:text-neutral-300"
      >
        <i class="fa-solid fa-lock text-5xl"></i>
        <h2>Password Change</h2>
      </div>
      <Transition name="fade" mode="out-in">
        <div
          class="flex flex-col items-center justify-center w-full h-full sm:h-auto"
          v-if="!isPasswordChanged"
        >
          <h3
            class="text-slate-700 dark:text-neutral-300 text-center text-sm mb-4 w-4/5"
          >
            To update your password, please enter your current password and then
            choose a new password.
          </h3>

          <div class="min-h-6 w-4/5 text-center text-red-500">
            {{ errorMessage }}
          </div>

          <div class="my-3 w-full sm:w-4/5 flex flex-col items-center relative">
            <input
              id="password"
              placeholder="Old password"
              type="password"
              v-model="password"
              @click="errorMessage = ''"
              class="w-full p-4 pl-12 text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-base placeholder:text-neutral-600 rounded-lg"
            />

            <i
              class="fa-solid fa-lock h-full flex items-center absolute text-xl left-4 text-neutral-500"
            ></i>
          </div>
          <div class="my-3 w-full sm:w-4/5 flex flex-col items-center relative">
            <input
              id="new-password"
              placeholder="New password"
              type="password"
              v-model="newPassword"
              @click="errorMessage = ''"
              class="w-full p-4 pl-12 text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-base placeholder:text-neutral-600 rounded-lg"
            />

            <i
              class="fa-solid fa-lock h-full flex items-center absolute text-xl left-4 text-neutral-500"
            ></i>
          </div>
          <div
            class="w-full sm:w-4/5 flex flex-col sm:flex-row items-center justify-center mt-auto mb-0 sm:mt-8 gap-6 sm:gap-8 transition-all"
            :class="{ 'opacity-50': store.isLoading }"
          >
            <button
              class="mt-auto rounded-lg overflow-hidden w-full sm:w-4/5 flex items-center justify-center text-center p-3 font-semibold cursor-pointer text-neutral-50 dark:text-neutral-300 bg-blue-600 hover:bg-blue-500 dark:bg-blue-800 dark:hover:bg-blue-700 transition-all select-none"
              @click="changePassword"
              :class="{
                'hover:bg-blue-600 dark:hover:bg-blue-800 cursor-default':
                  store.isLoading,
              }"
              :disabled="store.isLoading"
            >
              Change password
            </button>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center w-full" v-else>
          <h3
            class="text-slate-700 dark:text-neutral-300 text-center text-sm mb-4"
          >
            Your password has been successfully changed.<br />
          </h3>

          <div class="w-full sm:w-4/5 flex items-center justify-center mt-4">
            <button
              class="mt-auto rounded-lg overflow-hidden w-4/5 flex items-center justify-center text-center p-3 font-semibold cursor-pointer text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all"
              @click="close"
            >
              Close
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </BasicOverlay>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../../../stores/authStore";
import { useMainStore } from "../../../../stores";
import BasicOverlay from "../../../../components/containers/BasicOverlay.vue";
import axios, { isAxiosError } from "axios";

const emit = defineEmits(["close"]);

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const store = useMainStore();
const authStore = useAuthStore();

const password = ref("");
const newPassword = ref("");
const errorMessage = ref("");

const isPasswordValid = ref(false);
const validatePassword = () => {
  if (newPassword.value.length < 6) {
    isPasswordValid.value = false;
    errorMessage.value = "Password must be at least 6 characters long.";
  } else if (newPassword.value === password.value) {
    isPasswordValid.value = false;
    errorMessage.value = "Passwords are the same.";
  } else {
    isPasswordValid.value = true;
    errorMessage.value = "";
  }
};

const isPasswordChanged = ref(false);

const changePassword = async () => {
  validatePassword();

  if (isPasswordValid.value) {
    store.isLoading = true;
    try {
      const res = await axios.post(
        `${SERVER_URL}/auth/change-password`,
        {
          email: authStore.email,
          oldPassword: password.value,
          newPassword: newPassword.value,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
      console.log(res);
      isPasswordChanged.value = true;
    } catch (error) {
      if (isAxiosError(error)) {
        errorMessage.value = error.response?.data.msg;
      }
      console.log(error);
    } finally {
      store.isLoading = false;
    }
  }
};

const close = () => {
  if (!store.isLoading) emit("close");
};
</script>
