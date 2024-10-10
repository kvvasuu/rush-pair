<template>
  <BasicModal @close="closeModal">
    <div class="w-full h-full flex flex-col items-center pb-6">
      <header class="flex flex-col items-center mb-6">
        <img src="/logo_sygnet.png" alt="Rush Pair" width="52px" />
        <h1 class="text-3xl font-bold text-center mt-6">First steps</h1>
        <p class="min-h-6 mt-2 text-center text-red-500 font-semibold">
          <span v-if="generalError">{{ generalError }}</span>
        </p>
      </header>
      <form class="w-full h-full flex flex-col items-center justify-center">
        <div
          class="mb-3 w-full flex flex-col items-center relative mt-3"
          :class="{ 'mb-0': showNameError }"
        >
          <input
            id="name"
            placeholder="Name"
            type="text"
            v-model="name"
            @click="showNameError = false"
            class="w-full p-4 pl-12 rounded-xl border-2"
            :class="{ 'border-red-500': showNameError }"
          />

          <i
            class="fa-regular fa-envelope h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
          <span
            v-if="showNameError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >You must enter your name.</span
          >
        </div>
        <div class="mb-3 w-full flex flex-col items-center relative">
          <input
            id="age"
            placeholder="Age"
            type="number"
            min="16"
            max="99"
            v-model="age"
            class="w-full p-4 pl-12 rounded-xl border-2"
          />

          <i
            class="fa-solid fa-lock h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
        </div>
        <button
          class="px-8 py-3 w-full sm:w-auto font-bold text-lg bg-main-gradient hover:bg-main-gradient-dark text-slate-50 rounded-full transition-all drop-shadow-sm mt-auto"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
    <ol
      class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base"
    >
      <li
        class="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
      >
        <span
          class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
        >
          <svg
            class="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
            />
          </svg>
          Personal <span class="hidden sm:inline-flex sm:ms-2">Info</span>
        </span>
      </li>
      <li
        class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
      >
        <span
          class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
        >
          <span class="me-2">2</span>
          Account <span class="hidden sm:inline-flex sm:ms-2">Info</span>
        </span>
      </li>
      <li class="flex items-center">
        <span class="me-2">3</span>
        Confirmation
      </li>
    </ol>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicModal from "./containers/BasicModal.vue";
import axios from "axios";

import { useAuthStore } from "../stores/authStore";

const store = useAuthStore();

const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};

//Email validation
const name = ref("");
const showNameError = ref(false);

//Password validation
const age = ref<number>();

//UI state
const step = ref(0);
const generalError = ref("");

/* const login = async () => {
  generalError.value = "";
  if (email.value && password.value) {
    isLoading.value = true;
    await axios
      .post("http://localhost:3000/auth/login", {
        email: email.value,
        password: password.value,
      })
      .then((res) => {
        const token = res.data.token;
        store.setToken(token);

        store.login();
      })
      .catch((error) => {
        if (error.response && error.response.data.msg) {
          generalError.value = error.response.data.msg;
        } else {
          generalError.value = "Something went wrong. Try again later.";
        }
        console.log(error);
      })
      .finally(() => {
        password.value = "";
        isLoading.value = false;
      });
  }
}; */
</script>
