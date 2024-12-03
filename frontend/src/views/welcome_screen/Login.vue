<template>
  <BasicModal :prevent-close="isLoading" @close="closeModal">
    <div
      class="w-full h-full flex flex-col items-center pb-6"
      v-if="isLoginShown"
    >
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
      <section
        class="w-full h-full flex flex-col items-center justify-center"
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
            @keyup.enter="login"
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
            @keyup.enter="login"
            class="w-full p-4 pl-12 rounded-xl border-2"
            :class="{ 'border-red-500': showPasswordError }"
          />

          <i
            class="fa-solid fa-lock h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>

          <span
            v-if="showPasswordError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >Please enter password.</span
          >
        </div>

        <p class="w-full flex justify-end">
          <button
            class="font-bold text-sm text-rose-500 bg-transparent border-none"
            @click="toggleIsLoginShown"
          >
            Forgot password?
          </button>
        </p>

        <button
          class="px-8 py-3 w-full md:w-auto font-bold text-lg bg-main-gradient hover:bg-main-gradient-dark text-slate-50 rounded-full transition-all drop-shadow-sm mt-auto"
          @click="login"
        >
          Login
        </button>
      </section>
    </div>

    <div class="w-full h-full flex flex-col items-center pb-6" v-else>
      <header class="flex flex-col items-center mb-6">
        <img src="/logo_sygnet.png" alt="Rush Pair" width="52px" />
        <h1 class="text-3xl font-bold text-center mt-6">Reset password</h1>
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
      <section
        class="w-full h-full flex flex-col items-center justify-center"
        v-else-if="!passwordResetRequestSent"
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
        <p class="font-semibold text-sm w-full text-center">
          A link to reset your password will be sent to the provided email
          address.
        </p>
        <div class="flex items-center w-full justify-center gap-4 mt-auto">
          <button
            class="px-8 py-3 font-bold text-lg bg-white hover:bg-slate-200 border-[1px] border-slate-200 rounded-full transition-all drop-shadow-sm"
            @click="toggleIsLoginShown"
          >
            Back
          </button>
          <button
            class="px-8 py-3 w-full md:w-auto font-bold text-lg bg-main-gradient hover:bg-main-gradient-dark text-slate-50 rounded-full transition-all drop-shadow-sm"
            @click="resetPassword"
          >
            Reset password
          </button>
        </div>
      </section>
      <div
        class="w-full h-full flex flex-col items-center justify-center"
        v-else-if="passwordResetRequestSent"
      >
        <i class="fa-solid fa-check text-5xl text-neutral-700 mt-10 mb-10"></i>
        <p class="text-md font-semibold text-center">
          A link to reset your password has been sent to the provided email
          address. Please check your inbox.
        </p>
        <button
          class="px-8 py-3 font-bold text-lg mt-auto bg-white hover:bg-slate-200 border-[1px] border-slate-200 rounded-full transition-all drop-shadow-sm"
          @click="toggleIsLoginShown"
        >
          Back
        </button>
      </div>
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

const isLoginShown = ref(true);
const toggleIsLoginShown = () => {
  showEmailError.value = false;
  showPasswordError.value = false;
  generalError.value = "";
  isLoginShown.value = !isLoginShown.value;
  passwordResetRequestSent.value = false;
};

const passwordResetRequestSent = ref(false);

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

const validateInputs = () => {
  if (email.value.length == 0) {
    showEmailError.value = false;
  }
  if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email.value)) {
    showEmailError.value = false;
  } else {
    showEmailError.value = true;
  }
  if (password.value.length == 0) {
    showPasswordError.value = true;
  } else {
    showPasswordError.value = false;
  }
};

const login = async () => {
  generalError.value = "";
  validateInputs();
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

const resetPassword = async () => {
  generalError.value = "";
  validateInputs();
  if (email.value) {
    isLoading.value = true;
    await axios
      .post(`${SERVER_URL}/auth/request-reset-password`, {
        email: email.value,
      })
      .then((res) => {
        console.log(res);
        passwordResetRequestSent.value = true;
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
        isLoading.value = false;
      });
  }
};
</script>
