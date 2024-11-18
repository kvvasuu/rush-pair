<template>
  <BasicModal @close="closeModal">
    <div class="w-full h-full flex flex-col items-center pb-6">
      <header class="flex flex-col items-center mb-6">
        <img src="/logo_sygnet.png" alt="Rush Pair" width="52px" />
        <h1 class="text-3xl font-bold text-center mt-6">Login</h1>
        <p class="min-h-6 mt-2 text-center text-red-500 font-semibold">
          <span v-if="generalError">{{ generalError }}</span>
        </p>
      </header>

      <div
        class="flex items-center justify-center absolute h-full top-0"
        v-if="isLoading"
      >
        <BasicSpinner></BasicSpinner>
      </div>
      <form
        class="w-full h-full flex flex-col items-center justify-center"
        @submit.prevent="login"
        v-else
      >
        <div
          class="mb-3 w-full flex flex-col items-center relative mt-3"
          :class="{ 'mb-0': showEmailError }"
        >
          <input
            id="email"
            placeholder="Email"
            type="email"
            v-model="email"
            @click="showEmailError = false"
            class="w-full p-4 pl-12 rounded-xl border-2"
            :class="{ 'border-red-500': showEmailError }"
          />

          <i
            class="fa-regular fa-envelope h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
          <span
            v-if="showEmailError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >Please provide correct email.</span
          >
        </div>
        <div
          class="mb-3 w-full flex flex-col items-center relative"
          :class="{ 'mb-0': showPasswordError }"
        >
          <input
            id="password"
            placeholder="Password"
            type="password"
            v-model="password"
            @click="showPasswordError = false"
            class="w-full p-4 pl-12 rounded-xl border-2"
            :class="{ 'border-red-500': showPasswordError }"
          />

          <i
            class="fa-solid fa-lock h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>

          <span
            v-if="showPasswordError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >Password must be at least 6 characters long.</span
          >
        </div>
        <button
          class="px-8 py-3 w-full md:w-auto font-bold text-lg bg-main-gradient hover:bg-main-gradient-dark text-slate-50 rounded-full transition-all drop-shadow-sm mt-auto"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicModal from "../../components/containers/BasicModal.vue";
import BasicSpinner from "../../components/BasicSpinner.vue";
import axios from "axios";

import { useUserStore } from "../../stores/userStore";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const store = useUserStore();

const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};

//Email validation
const email = ref("");
const showEmailError = ref(false);

//Password validation
const password = ref("");
const showPasswordError = ref(false);

//UI state
const isLoading = ref(false);
const generalError = ref("");

const login = async () => {
  generalError.value = "";
  if (email.value && password.value) {
    isLoading.value = true;
    await axios
      .post(
        `${SERVER_URL}/auth/login`,
        {
          email: email.value,
          password: password.value,
        },
        { timeout: 10000 }
      )
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
        isLoading.value = false;
      })
      .finally(() => {
        password.value = "";
      });
  }
};
</script>
