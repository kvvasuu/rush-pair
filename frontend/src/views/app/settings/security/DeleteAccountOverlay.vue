<template>
  <BasicOverlay @close="close" :no-close-button="true">
    <div
      class="flex flex-col items-center justify-start w-full h-full px-12 py-20"
    >
      <div
        class="flex flex-col items-center justify-center text-2xl font-semibold text-red-500 dark:text-red-500 mb-8 gap-3"
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
              class="w-full p-4 pl-12 text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none cursor-pointer placeholder:text-base placeholder:text-neutral-600 rounded-lg"
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
              class="mt-auto rounded-lg overflow-hidden w-full sm:w-4/5 flex items-center justify-center text-center p-3 font-semibold cursor-pointer text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all"
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
              class="mt-auto rounded-lg overflow-hidden w-full sm:w-4/5 flex items-center opaci justify-center text-center p-3 font-semibold cursor-pointer text-neutral-50 dark:text-inherit bg-red-500 hover:bg-red-500/75 transition-all"
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

          <div role="status" class="flex items-center justify-center mt-4">
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-slate-200 dark:text-neutral-900 animate-spin fill-neutral-400 du"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>

          <div
            class="w-full sm:w-4/5 flex flex-col sm:flex-row items-center justify-center mt-auto mb-0 sm:mt-8 gap-6 sm:gap-8 transition-all"
          >
            <button
              class="mt-auto rounded-lg overflow-hidden w-4/5 flex items-center justify-center text-center p-3 font-semibold cursor-pointer text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all"
              @click="authStore.logout"
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
import { useAuthStore } from "../../../../stores/authStore";
import { useMainStore } from "../../../../stores";
import BasicOverlay from "../../../../components/containers/BasicOverlay.vue";
import axios, { isAxiosError } from "axios";

const emit = defineEmits(["close"]);

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const store = useMainStore();
const authStore = useAuthStore();

const password = ref("");
const errorMessage = ref("");

const isAccountDeleted = ref(false);

const deleteAccount = async () => {
  try {
    store.isLoading = true;
    const res = await axios.post(
      `${SERVER_URL}/auth/delete-account`,
      {
        email: authStore.email,
        password: password.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );
    console.log(res);
    isAccountDeleted.value = true;
    setTimeout(() => {
      authStore.logout();
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
