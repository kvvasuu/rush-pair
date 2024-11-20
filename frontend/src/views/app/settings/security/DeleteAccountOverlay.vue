<template>
  <BasicOverlay @close="close" :no-close-button="true">
    <div
      class="flex flex-col items-center justify-start w-full h-full px-12 py-20"
    >
      <div
        class="flex flex-col items-center justify-center text-2xl font-semibold text-red-500 mb-8 gap-3"
      >
        <i class="fa-solid fa-trash-can text-5xl text-red-500"></i>
        <h2>Account Deletion</h2>
      </div>
      <Transition name="fade" mode="out-in">
        <div
          class="flex flex-col items-center justify-center w-full h-full sm:h-auto"
          v-if="!isAccountDeleted"
        >
          <h3
            class="text-slate-700 dark:text-neutral-300 text-center text-sm mb-4"
          >
            Are you sure you want to permanently delete your account?<br />
            This action cannot be undone.
            <p>Please enter your password to confirm.</p>
          </h3>

          <div class="min-h-6 w-4/5 text-center text-red-500">
            {{ errorMessage }}
          </div>

          <div class="my-3 w-full sm:w-4/5 flex flex-col items-center relative">
            <input
              id="password"
              placeholder="Password"
              type="password"
              v-model="password"
              @click="errorMessage = ''"
              class="w-full p-4 pl-12 text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-base placeholder:text-neutral-600 rounded-lg"
            />

            <i
              class="fa-solid fa-lock h-full flex items-center absolute text-xl left-4 text-neutral-700"
            ></i>
          </div>
          <div
            class="w-full sm:w-4/5 flex flex-col sm:flex-row items-center justify-center mt-auto mb-0 sm:mt-8 gap-6 sm:gap-8 transition-all"
            :class="{ 'opacity-50': store.isLoading }"
          >
            <button
              class="mt-auto rounded-lg overflow-hidden w-full sm:w-4/5 flex items-center select-none justify-center text-center p-3 font-semibold cursor-pointer text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all"
              @click="close"
              :class="{
                'hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-default':
                  store.isLoading,
              }"
              :disabled="store.isLoading"
            >
              Keep account
            </button>
            <button
              class="mt-auto rounded-lg overflow-hidden w-full sm:w-4/5 flex items-center select-none justify-center text-center p-3 font-semibold cursor-pointer text-neutral-50 dark:text-inherit bg-red-500 hover:bg-red-600 dark:hover:bg-red-500/80 transition-all"
              @click="deleteAccount"
              :class="{ 'hover:bg-red-500 cursor-default': store.isLoading }"
              :disabled="store.isLoading"
            >
              Delete
            </button>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center w-full" v-else>
          <h3
            class="text-slate-700 dark:text-neutral-300 text-center text-sm mb-4"
          >
            Your account has been successfully deleted.<br />
            You will be logged out shortly.
          </h3>

          <div class="flex items-center justify-center mt-4">
            <BasicSpinner></BasicSpinner>
          </div>

          <div class="w-full sm:w-4/5 flex items-center justify-center mt-6">
            <button
              class="mt-auto rounded-lg overflow-hidden w-4/5 flex items-center justify-center text-center p-3 font-semibold cursor-pointer text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all select-none"
              @click="userStore.logout"
            >
              Log out
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </BasicOverlay>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../../../../stores/userStore";
import { useMainStore } from "../../../../stores";
import BasicOverlay from "../../../../components/containers/BasicOverlay.vue";
import BasicSpinner from "../../../../components/BasicSpinner.vue";
import axios, { isAxiosError } from "axios";

const emit = defineEmits(["close"]);

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const store = useMainStore();
const userStore = useUserStore();

const password = ref("");
const errorMessage = ref("");

const isAccountDeleted = ref(false);

const deleteAccount = async () => {
  try {
    store.isLoading = true;
    const res = await axios.post(`${SERVER_URL}/auth/delete-account`, {
      email: userStore.email,
      password: password.value,
    });
    console.log(res);
    isAccountDeleted.value = true;
    setTimeout(() => {
      userStore.logout();
    }, 5000);
  } catch (error) {
    if (isAxiosError(error)) {
      errorMessage.value = error.response?.data.msg;
    }
    console.log(error);
    store.isLoading = false;
  }
};

const close = () => {
  if (!store.isLoading) emit("close");
};
</script>
