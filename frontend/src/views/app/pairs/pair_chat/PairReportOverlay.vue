<template>
  <BasicOverlay @close="close">
    <div
      class="flex flex-col items-center justify-start w-full h-full px-12 pt-10 pb-6"
    >
      <div class="flex flex-col items-center justify-center mb-8">
        <i
          class="fa-solid fa-triangle-exclamation text-5xl text-red-500 mb-2"
        ></i>
        <h2 class="text-red-500 text-2xl font-semibold">Report</h2>
        <h4
          class="text-xs font-semibold text-neutral-500 dark:text-neutral-500"
          v-if="chatStore.pairInfo.name !== 'Anonymous'"
        >
          We won't tell {{ chatStore.pairInfo.name }}
        </h4>
      </div>

      <div class="flex items-center w-full justify-center mb-8 mt-auto gap-4">
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
          {{ step < 2 ? "Next" : "Send" }}
        </button>
      </div>

      <ol
        id="stepper"
        class="flex items-center justify-between w-full md:w-4/5 text-sm text-center text-gray-400 min-h-8 select-none mb-0 mt-auto"
      >
        <li class="flex items-center text-blue-500" role="button">
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
  </BasicOverlay>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "../../../../stores/chatStore";
import { useMainStore } from "../../../../stores";
import BasicOverlay from "../../../../components/containers/BasicOverlay.vue";
import axios, { isAxiosError } from "axios";

const emit = defineEmits(["close"]);

const chatStore = useChatStore();
const store = useMainStore();

const message = ref("");
const reportType = ref<"fake" | "hate" | "behavior" | "other" | null>(null);

const step = ref(0);
const isSent = ref(false);

const nextStep = () => {
  if (reportType.value !== null) {
    return;
  } else {
    step.value < 2 ? step.value++ : sendReport();
  }
};

const sendReport = () => {
  console.log("report sent");
};

/* const sendReport = async () => {
  
    if (isPasswordValid.value) {
      store.isLoading = true;
      try {
        const res = await axios.post(`/auth/change-password`);
        console.log(res);
      } catch (error) {
        if (isAxiosError(error)) {
          errorMessage.value = error.response?.data.msg;
        }
        console.log(error);
      } finally {
        store.isLoading = false;
      }
    }
  }; */

const close = () => {
  if (!store.isLoading) emit("close");
};
</script>
