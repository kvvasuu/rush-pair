<template>
  <BasicModal @close="closeModal" :prevent-close="true" :no-close-button="true">
    <div class="w-full h-full flex flex-col items-center">
      <header class="flex flex-col items-center mb-6">
        <img src="/logo_sygnet.png" alt="Rush Pair" width="52px" />
        <h1 class="text-3xl font-bold text-center mt-6">First steps</h1>
        <p class="min-h-6 mt-2 text-center text-red-500 font-semibold">
          <span v-if="generalError">{{ generalError }}</span>
        </p>
      </header>
      <form
        class="w-full h-full flex flex-col items-center justify-center pb-6"
        id="step-1"
        @submit.stop.prevent
        v-if="step === 0"
      >
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
            class="fa-regular fa-user h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
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
            class="fa-solid fa-calendar-days h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
        </div>
        <button
          class="px-8 py-3 w-full sm:w-auto font-bold text-lg bg-main-gradient hover:bg-main-gradient-dark text-slate-50 rounded-full transition-all drop-shadow-sm mt-auto"
          @click="nextStep"
        >
          {{ step < 3 ? "Next" : "Finish" }}
        </button>
      </form>
      <form
        class="w-full h-full flex flex-col items-center justify-center pb-6"
        id="step-1"
        @submit.stop.prevent
        v-else-if="step === 1"
      >
        <div
          class="mb-3 w-full flex flex-col items-center relative mt-3"
          :class="{ 'mb-0': showNameError }"
        >
          <input
            id="country"
            placeholder="Country"
            type="text"
            v-model="country"
            @click="showCountryError = false"
            class="w-full p-4 pl-12 rounded-xl border-2"
            :class="{ 'border-red-500': showCountryError }"
          />

          <i
            class="fa-solid fa-earth-americas h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
          <span
            v-if="showCountryError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >Please enter your country.</span
          >
        </div>
        <div
          class="mb-3 w-full flex flex-col items-center relative"
          :class="{ 'mb-0': showNameError }"
        >
          <input
            id="city"
            placeholder="City"
            type="text"
            v-model="city"
            @click="showCityError = false"
            class="w-full p-4 pl-12 rounded-xl border-2"
            :class="{ 'border-red-500': showCityError }"
          />

          <i
            class="fa-solid fa-city h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
          <span
            v-if="showCityError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >Please enter your city.</span
          >
        </div>
        <button
          class="px-8 py-3 w-full sm:w-auto font-bold text-lg bg-main-gradient hover:bg-main-gradient-dark text-slate-50 rounded-full transition-all drop-shadow-sm mt-auto"
          @click="nextStep"
        >
          {{ step < 3 ? "Next" : "Finish" }}
        </button>
      </form>
      <ol
        class="flex items-center justify-between w-full sm:w-4/5 text-sm text-center text-gray-400 min-h-8 select-none -mb-6"
      >
        <li
          class="flex items-center text-blue-500"
          role="button"
          @click="goToStep(0)"
        >
          <i class="fa-solid fa-circle-check text-2xl" v-if="step >= 1"></i>
          <span
            class="rounded-full border-blue-500 border-2 font-bold w-6 h-6 flex items-center justify-center"
            v-else
            >1</span
          >
        </li>
        <li class="flex w-4/5 items-center justify-center">
          <hr
            class="h-[2px] w-4/5"
            :class="{
              'bg-gray-400': step < 1,
              'bg-blue-500': step >= 1,
            }"
          />
        </li>
        <li
          class="flex items-center"
          :class="{ 'text-blue-500': step >= 1 }"
          role="button"
          @click="goToStep(1)"
        >
          <i class="fa-solid fa-circle-check text-2xl" v-if="step >= 2"></i>
          <span
            class="rounded-full border-2 font-bold w-6 h-6 flex items-center justify-center"
            :class="{
              'border-gray-400': step < 1,
              'border-blue-500': step >= 1,
            }"
            v-else
            >2</span
          >
        </li>
        <li class="flex w-4/5 items-center justify-center">
          <hr
            class="h-[2px] w-4/5"
            :class="{
              'bg-gray-400': step < 2,
              'bg-blue-500': step >= 2,
            }"
          />
        </li>
        <li
          class="flex items-center"
          :class="{ 'text-blue-500': step >= 2 }"
          role="button"
          @click="goToStep(2)"
        >
          <i class="fa-solid fa-circle-check text-2xl" v-if="step >= 3"></i>
          <span
            class="rounded-full border-2 font-bold w-6 h-6 flex items-center justify-center"
            :class="{
              'border-gray-400': step < 2,
              'border-blue-500': step >= 2,
            }"
            v-else
            >3</span
          >
        </li>
      </ol>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicModal from "./containers/BasicModal.vue";
/* import axios from "axios";

import { useAuthStore } from "../stores/authStore";

const store = useAuthStore(); */

const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};

//Name validation
const name = ref("");
const showNameError = ref(false);

const age = ref<number>();

//Country validation
const country = ref("");
const showCountryError = ref(false);

const city = ref("");
const showCityError = ref(false);

//UI state
const step = ref(0);
const generalError = ref("");

const goToStep = (clickedStep: number) => {
  if (clickedStep < step.value) {
    step.value = clickedStep;
  }
};

const nextStep = () => {
  step.value < 3 ? step.value++ : finish();
};

const finish = () => {
  console.log("finish");
};

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
