<template>
  <BasicModal :prevent-close="isLoading" @close="closeModal">
    <div
      class="w-full h-full flex flex-col items-center pb-6"
      v-if="!registerComplete"
    >
      <header class="flex flex-col items-center mb-6">
        <img src="/logo_sygnet.png" alt="Rush Pair" width="52px" />
        <h1 class="text-3xl font-bold text-center mt-6">
          {{ t("welcomeScreen.createAccount") }}
        </h1>
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
            >{{ t("welcomeScreen.provideCorrectEmail") }}</span
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
            >{{ t("welcomeScreen.passwordMustBeLong") }}</span
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
            >{{ t("welcomeScreen.passwordsNotTheSame") }}</span
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
            <label for="terms" class="text-sm"
              >{{ t("welcomeScreen.iAgree") }}
              <a
                href="/terms"
                target="_blank"
                class="font-bold text-rose-500 underline-offset-2 underline"
                >{{ t("welcomeScreen.terms") }}</a
              ></label
            >
            <p
              class="text-xs font-semibold text-red-500"
              v-if="showCheckboxError"
            >
              {{ t("welcomeScreen.agreeTerms") }}
            </p>
          </div>
        </div>
        <button
          class="px-8 py-3 w-full md:w-auto font-bold text-lg bg-main-gradient hover:bg-main-gradient-dark text-slate-50 rounded-full transition-all drop-shadow-sm mt-auto"
          type="submit"
        >
          {{ t("welcomeScreen.createAccount") }}
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
          <p>{{ t("welcomeScreen.success") }}</p>
          <p>
            {{ t("welcomeScreen.welcomeAboard") }}
          </p>
        </h1>

        <i class="fa-solid fa-check text-5xl text-neutral-700 mt-10 mb-10"></i>
        <p class="text-md font-semibold text-center">
          {{ t("welcomeScreen.checkEmail") }}
        </p>
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
          {{ t("welcomeScreen.login") }}
        </button>
        <button
          class="px-2 py-1 mt-6 text-xs font-semibold"
          @click="() => (registerComplete = false)"
        >
          {{ t("general.back") }}
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
      .post(
        `${SERVER_URL}/auth/register`,
        {
          email: email.value,
          password: password.value,
        },
        { timeout: 10000 }
      )
      .then(() => {
        registerComplete.value = true;
      })
      .catch((error) => {
        if (error.response && error.response.data.msg) {
          generalError.value = t("serverMessages." + error.response.data.msg);
        } else {
          generalError.value = t("general.somethingWentWrong");
        }
        console.log(error);
      })
      .finally(() => {
        resetForm();
      });
  }
};
</script>
