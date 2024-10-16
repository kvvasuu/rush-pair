<template>
  <BasicModal :prevent-close="preventModalClose" @close="closeModal">
    <div
      class="w-full h-full flex flex-col items-center pb-6"
      v-if="!registerComplete"
    >
      <header class="flex flex-col items-center mb-6">
        <img src="/logo_sygnet.png" alt="Rush Pair" width="52px" />
        <h1 class="text-3xl font-bold text-center mt-6">Create account</h1>
        <p class="min-h-6 mt-2 text-center text-red-500 font-semibold">
          <span v-if="generalError">{{ generalError }}</span>
        </p>
      </header>
      <div
        role="status"
        class="flex items-center justify-center absolute h-full top-0"
        v-if="isLoading"
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
      <form
        class="w-full h-full flex flex-col items-center justify-center"
        @submit.prevent="register"
        v-else
      >
        <div
          class="mb-3 w-full flex flex-col items-center relative"
          :class="{ 'mb-0': showEmailError }"
        >
          <input
            id="email"
            placeholder="Email"
            type="email"
            v-model="email"
            @blur="validateEmail"
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
            @blur="
              () => {
                validatePasswordConfirm;
                validatePassword;
              }
            "
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
        <div
          class="mb-3 w-full flex flex-col items-center relative"
          :class="{ 'mb-0': showPasswordError }"
        >
          <input
            id="password-confirm"
            placeholder="Confirm password"
            type="password"
            v-model="passwordConfirm"
            @blur="
              () => {
                validatePasswordConfirm;
                validatePassword;
              }
            "
            @click="showPasswordConfirmError = false"
            class="w-full p-4 pl-12 rounded-xl border-2"
            :class="{ 'border-red-500': showPasswordConfirmError }"
          />

          <i
            class="fa-solid fa-lock h-[60px] flex items-center absolute text-xl left-4 text-neutral-700"
          ></i>

          <span
            v-if="showPasswordConfirmError"
            class="text-red-500 font-semibold text-xs w-full text-left pl-4 pt-1"
            >Passwords are not the same.</span
          >
        </div>
        <div class="flex min-h-10 w-full justify-center mt-2">
          <div class="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              value="terms"
              v-model="checkbox"
              @change="validateTerms"
              class="w-4 h-4"
            />
          </div>
          <div class="ms-2">
            <label for="terms" class="text-gray-900"
              >I agree to the terms and conditions</label
            >
            <p
              class="text-xs font-semibold text-red-500"
              v-if="showCheckboxError"
            >
              You must agree with terms and conditions
            </p>
          </div>
        </div>
        <button
          class="px-8 py-3 w-full md:w-auto font-bold text-lg bg-main-gradient hover:bg-main-gradient-dark text-slate-50 rounded-full transition-all drop-shadow-sm mt-auto"
          type="submit"
        >
          Create account
        </button>
      </form>
    </div>
    <div
      class="w-full h-full flex flex-col items-center justify-between pb-6"
      v-else
    >
      <header class="flex flex-col items-center mb-6">
        <img src="/logo_sygnet.png" alt="Rush Pair" width="52px" />
        <h1 class="text-2xl font-bold text-center mt-32 md:mt-20">
          <p>Registration successful!</p>
          <p>Welcome aboard.</p>
        </h1>
        <i class="fa-solid fa-check text-5xl text-neutral-700 mt-20"></i>
      </header>

      <div class="flex flex-col">
        <button
          class="px-8 py-3 w-full md:w-auto font-bold text-lg bg-main-gradient hover:bg-main-gradient-dark text-slate-50 rounded-full transition-all drop-shadow-sm"
          @click="
            () => {
              emit('goToLogin');
              emit('close');
            }
          "
        >
          Login
        </button>
        <button
          class="px-2 py-1 mt-6 text-xs font-semibold"
          @click="() => (registerComplete = false)"
        >
          Back
        </button>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import BasicModal from "../../components/containers/BasicModal.vue";
import axios from "axios";

const URL = import.meta.env.VITE_SERVER_URL;

const emit = defineEmits(["close", "goToLogin"]);
const closeModal = () => {
  emit("close");
};

//Email validation
const email = ref("");
const emailCorrect = ref(false);
const showEmailError = ref(false);

//Password validation
const password = ref("");
const passwordCorrect = ref(false);
const showPasswordError = ref(false);

const passwordConfirm = ref("");
const passwordConfirmCorrect = ref(false);
const showPasswordConfirmError = ref(false);

//Terms and conditions validation
const checkbox = ref(false);
const showCheckboxError = ref(false);

//UI state
const isLoading = ref(false);
const registerComplete = ref(false);

const generalError = ref("");

const preventModalClose = computed(() => {
  return !!email.value || !!password.value || !!passwordConfirm.value;
});

//Methods
const resetForm = () => {
  email.value = "";
  password.value = "";
  passwordConfirm.value = "";
  checkbox.value = false;
  isLoading.value = false;
};

const validateEmail = () => {
  if (email.value.length == 0) {
    showEmailError.value = false;
  }
  if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email.value)) {
    emailCorrect.value = true;
    showEmailError.value = false;
  } else {
    emailCorrect.value = false;
    showEmailError.value = true;
  }
};
const validatePassword = () => {
  if (password.value.length == 0) {
    showPasswordError.value = false;
  }
  if (password.value.length >= 6) {
    passwordCorrect.value = true;
    showPasswordError.value = false;
  } else {
    passwordCorrect.value = false;
    showPasswordError.value = true;
  }
};
const validatePasswordConfirm = () => {
  if (passwordConfirm.value.length == 0) {
    showPasswordConfirmError.value = false;
  }
  if (password.value === passwordConfirm.value) {
    passwordConfirmCorrect.value = true;
    showPasswordConfirmError.value = false;
  } else {
    passwordConfirmCorrect.value = false;
    showPasswordConfirmError.value = true;
  }
};
const validateTerms = () => {
  checkbox.value
    ? (showCheckboxError.value = false)
    : (showCheckboxError.value = true);
};
const register = async () => {
  validateEmail();
  validatePassword();
  validatePasswordConfirm();
  validateTerms();
  generalError.value = "";
  if (
    emailCorrect.value &&
    passwordCorrect.value &&
    passwordConfirmCorrect.value &&
    checkbox.value
  ) {
    isLoading.value = true;
    await axios
      .post(`${URL}/auth/register`, {
        email: email.value,
        password: password.value,
      })
      .then(() => {
        registerComplete.value = true;
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
        resetForm();
      });
  }
};
</script>
