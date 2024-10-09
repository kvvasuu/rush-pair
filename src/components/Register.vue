<template>
  <BasicModal @close="closeModal">
    <div class="w-full h-full"></div>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicModal from "./containers/BasicModal.vue";
import axios from "axios";

const emit = defineEmits(["close"]);
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

const generalError = ref("Something went wrong. Try again later.");
const showGeneralError = ref(false);

//Methods
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
  showGeneralError.value = false;
  isLoading.value = true;
  if (
    emailCorrect.value &&
    passwordCorrect.value &&
    passwordConfirmCorrect.value &&
    checkbox.value
  ) {
    await axios
      .post("http://localhost:3000/auth/register", {
        name: "Łukasz Kwas",
        email: "robak1111@gmail.com",
        password: "dupa1111",
      })
      .then((res) => {
        registerComplete.value = true;
        console.log(res);
      })
      .catch((error) => {
        if (error.error === "email-taken") {
          generalError.value =
            "The provided email address is already registered in our system. If you forgot your password, please use the password recovery option.";
        } else {
          generalError.value = "Something went wrong. Try again later.";
        }
        if (error.error === "email-taken") {
          showGeneralError.value = true;
        }
        console.log(error);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
};
</script>
