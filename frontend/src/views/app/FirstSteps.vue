<template>
  <BasicModal @close="closeModal" :prevent-close="true" :no-close-button="true">
    <div class="w-full h-full flex flex-col items-center">
      <header class="flex flex-col items-center mb-4">
        <img src="/logo_sygnet.png" alt="Rush Pair" width="52px" />
        <h1 class="text-3xl font-bold text-center mt-6">First steps</h1>
        <p class="mt-2 text-center font-semibold" v-if="step === 0">
          You need to provide some personal information.
        </p>
        <p class="mt-2 text-center font-semibold" v-else-if="step === 1">
          Additional information.<br />
        </p>
        <p class="mt-2 text-center font-semibold" v-else-if="step === 2">
          Summary<br />
        </p>
        <p class="text-xs" v-if="step === 1">Not required.</p>
      </header>
      <form
        class="w-full h-full flex flex-col items-center"
        id="step-0"
        @submit.stop.prevent
        v-if="step === 0"
      >
        <div class="mb-3 w-full flex flex-col items-center relative mt-3">
          <input
            id="name"
            placeholder="Name"
            type="text"
            v-model="name"
            @click="showNameError = false"
            class="w-full p-4 pl-12 rounded-xl border-2 placeholder-gray-400"
            :class="{ 'border-red-500': showNameError }"
            required
          />

          <i
            class="fa-regular fa-user h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
          <span
            v-if="showNameError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >Please enter your name.</span
          >
        </div>
        <div class="mb-3 w-full flex flex-col items-center relative">
          <input
            id="birthdate"
            type="date"
            class="w-full p-4 pl-12 rounded-xl border-2 placeholder-gray-400"
            :class="{ 'border-red-500': showAgeError }"
            required
            autocomplete="off"
            v-model="birthdate"
            min="1920-01-01"
            max="2008-01-01"
            ref="birthdateInputRef"
            @click="showAgeError = false"
            @focus="birthdateInputRef.showPicker()"
          />
          <label
            for="birthdate"
            class="absolute left-5 h-full flex items-center top-0 text-neutral-400 text-xl"
            >Birthdate</label
          >
          <input
            id="age"
            placeholder="Age"
            type="number"
            min="16"
            max="99"
            @click="showAgeError = false"
            v-model="birthdate"
            class="w-full p-4 pl-12 rounded-xl border-2 placeholder-gray-400"
            :class="{ 'border-red-500': showAgeError }"
            required
          />

          <i
            class="fa-solid fa-calendar-days h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
          <span
            v-if="showAgeError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >Please enter your age.</span
          >
        </div>
        <div class="mb-3 w-full flex flex-col items-center relative">
          <select
            name="gender"
            id="gender-select"
            v-model="gender"
            @click="showGenderError = false"
            class="w-full p-4 pl-11 rounded-xl border-2"
            :class="{ 'border-red-500': showGenderError }"
            required
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
          <i
            class="fa-solid fa-mars-and-venus h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
          <span
            class="absolute left-12 h-[60px] flex items-center pointer-events-none text-gray-400"
            v-if="!gender"
            >Gender</span
          >
          <span
            v-if="showGenderError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >Please choose your gender.</span
          >
        </div>
      </form>
      <form
        class="w-full h-full flex flex-col items-center"
        id="step-1"
        @submit.stop.prevent
        v-else-if="step === 1"
      >
        <div class="mb-3 w-full flex flex-col items-center relative mt-3">
          <input
            id="country"
            placeholder="Country"
            type="text"
            v-model="country"
            class="w-full p-4 pl-12 rounded-xl border-2 placeholder-gray-400"
          />

          <i
            class="fa-solid fa-earth-americas h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
        </div>
        <div class="mb-3 w-full flex flex-col items-center relative">
          <input
            id="city"
            placeholder="City"
            type="text"
            v-model="city"
            class="w-full p-4 pl-12 rounded-xl border-2 placeholder-gray-400"
          />

          <i
            class="fa-solid fa-city h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
        </div>
        <div class="mb-3 w-full flex flex-col items-center relative">
          <input
            id="phone-number"
            placeholder="Phone number"
            type="text"
            v-model="phoneNumber"
            @click="showPhoneNumberError = false"
            class="w-full p-4 pl-12 rounded-xl border-2 placeholder-gray-400"
            :class="{ 'border-red-500': showPhoneNumberError }"
          />

          <i
            class="fa-solid fa-phone h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>
          <span
            v-if="showPhoneNumberError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >Incorrect phone number.</span
          >
        </div>
      </form>

      <ol
        class="h-full flex flex-col items-center gap-1"
        id="step-2"
        v-if="step === 2"
      >
        <li class="w-full">
          <i class="fa-regular fa-user text-xl text-neutral-700 mr-4 w-6"></i
          >{{ name }}
        </li>
        <li class="w-full">
          <i
            class="fa-solid fa-calendar-days text-xl text-neutral-700 mr-4 w-6"
          ></i
          >{{ birthdate }}
        </li>
        <li class="w-full capitalize">
          <i
            class="fa-solid fa-mars-and-venus text-xl text-neutral-700 mr-4 w-6"
          ></i
          >{{ gender }}
        </li>
        <li class="w-full" v-if="country">
          <i
            class="fa-solid fa-earth-americas text-xl text-neutral-700 mr-4 w-6"
          ></i
          >{{ country }}
        </li>
        <li class="w-full" v-if="city">
          <i class="fa-solid fa-city text-xl text-neutral-700 mr-4 w-6"></i
          >{{ city }}
        </li>
        <li class="w-full" v-if="phoneNumber">
          <i class="fa-solid fa-phone text-xl text-neutral-700 mr-4 w-6"></i
          >{{ phoneNumber }}
        </li>
      </ol>

      <p
        class="min-h-6 mt-2 mb-8 text-center text-red-500 font-semibold"
        v-if="generalError"
      >
        {{ generalError }}
      </p>

      <div class="flex items-center w-full justify-center mb-8 gap-4">
        <button
          class="px-8 py-3 font-bold text-lg bg-white hover:bg-slate-200 border-[1px] border-slate-200 rounded-full transition-all drop-shadow-sm"
          @click="step--"
          v-if="!isSent && step > 0"
        >
          Back
        </button>
        <button
          class="px-8 py-3 w-full md:w-4/5 font-bold text-lg bg-main-gradient hover:bg-main-gradient-dark text-slate-50 rounded-full transition-all drop-shadow-sm"
          @click="nextStep"
          v-if="!isSent"
        >
          {{ step < 2 ? "Next" : "Finish" }}
        </button>
      </div>

      <div
        role="status"
        class="flex items-center justify-center absolute h-full top-0"
        v-if="isSent"
      >
        <svg
          aria-hidden="true"
          class="w-8 h-8 text-gray-200 animate-spin fill-gray-500"
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
      <ol
        id="stepper"
        class="flex items-center justify-between w-full md:w-4/5 text-sm text-center text-gray-400 min-h-8 select-none -mb-6 mt-auto"
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
import BasicModal from "../../components/containers/BasicModal.vue";

import { useAuthStore } from "../../stores/authStore";

const authStore = useAuthStore();

const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};

//Personal data
const name = ref("");
const showNameError = ref(false);

const birthdate = ref("");
const birthdateInputRef = ref();
const showAgeError = ref(false);

const gender = ref<"female" | "male" | "other">();
const showGenderError = ref(false);

//Additional data
const country = ref("");

const city = ref("");

const phoneNumber = ref("");
const showPhoneNumberError = ref(false);

//UI state
const step = ref(0);
const isSent = ref(false);
const generalError = ref("");

const goToStep = (clickedStep: number) => {
  if (clickedStep < step.value) {
    step.value = clickedStep;
  }
};

const nextStep = () => {
  validateName();
  validateAge();
  validateGender();
  validatePhoneNumber();
  if (
    showNameError.value ||
    showAgeError.value ||
    showPhoneNumberError.value ||
    showGenderError.value
  ) {
    return;
  } else {
    step.value < 2 ? step.value++ : finish();
  }
};

const validateName = () => {
  if (name.value.length < 1) showNameError.value = true;
};

const validateAge = () => {
  if (birthdate.value === null) showAgeError.value = true;
};

const validateGender = () => {
  if (!gender.value) showGenderError.value = true;
};

const validatePhoneNumber = () => {
  if (phoneNumber.value) {
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/gi.test(
      phoneNumber.value
    )
      ? (showPhoneNumberError.value = false)
      : (showPhoneNumberError.value = true);
  } else {
    showPhoneNumberError.value = false;
  }
};

const finish = async () => {
  step.value = 3;
  isSent.value = true;

  const userData = {
    name: name.value,
    birthdate: birthdate.value,
    gender: gender.value,
    country: country.value,
    city: city.value,
    phoneNumber: phoneNumber.value,
  };

  await authStore
    .initializeUser(userData)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      generalError.value = error;
      step.value = 2;
      isSent.value = false;
    });
};
</script>
