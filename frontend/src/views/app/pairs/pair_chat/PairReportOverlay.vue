<template>
  <BasicOverlay @close="close">
    <div
      class="flex flex-col items-center justify-start w-full h-full px-6 sm:px-12 pt-20 pb-10"
    >
      <div class="flex flex-col items-center justify-center mb-8">
        <i
          class="fa-solid fa-triangle-exclamation text-5xl text-red-500 mb-2"
        ></i>
        <h2 class="text-red-500 text-2xl font-semibold">Report</h2>
        <h4
          class="text-xs font-semibold text-neutral-500 dark:text-neutral-500"
        >
          We won't tell
          <span v-if="chatStore.pairInfo.name !== 'Anonymous'">{{
            chatStore.pairInfo.name
          }}</span>
          <span v-else>anyone</span>
        </h4>
      </div>

      <ul
        class="w-full sm:w-4/5 text-sm font-medium bg-neutral-50 dark:bg-neutral-800 rounded-lg"
        v-if="step === 0"
      >
        <li
          class="w-full rounded-t-lg border-[1px] border-neutral-300 dark:border-neutral-700 border-b-0 has-[:checked]:bg-slate-100"
        >
          <label
            for="list-radio-fake"
            class="w-full h-full py-5 px-5 flex group"
          >
            <input
              id="list-radio-fake"
              type="radio"
              value="fake"
              name="list-radio"
              class="w-5 h-5 mr-3"
              v-model="reportType"
            />
            <div class="flex-col">
              <p
                class="text-lg leading-4 mb-1 font-semibold text-neutral-800 dark:text-gray-300"
              >
                Fake profile
              </p>
              <p class="text-xs text-neutral-700 dark:text-gray-300">
                The user is pretending to be someone else or providing false
                information.
              </p>
            </div>
          </label>
        </li>
        <li
          class="w-full border-[1px] border-neutral-300 dark:border-neutral-700 border-b-0 has-[:checked]:bg-slate-100"
        >
          <label for="list-radio-spam" class="w-full h-full py-5 px-5 flex">
            <input
              id="list-radio-spam"
              type="radio"
              value="spam"
              name="list-radio"
              class="w-5 h-5 mr-3"
              v-model="reportType"
            />
            <div class="flex-col">
              <p
                class="text-lg leading-4 mb-1 font-semibold text-neutral-800 dark:text-gray-300"
              >
                Spam
              </p>
              <p class="text-xs text-neutral-700 dark:text-gray-300">
                The user is sending unwanted messages, advertisements, or links.
              </p>
            </div>
          </label>
        </li>
        <li
          class="w-full border-[1px] border-neutral-300 dark:border-neutral-700 border-b-0 has-[:checked]:bg-slate-100"
        >
          <label
            for="list-radio-offensive"
            class="w-full h-full py-5 px-5 flex"
          >
            <input
              id="list-radio-offensive"
              type="radio"
              value="offensive"
              name="list-radio"
              class="w-5 h-5 mr-3"
              v-model="reportType"
            />
            <div class="flex-col">
              <p
                class="text-lg leading-4 mb-1 font-semibold text-neutral-800 dark:text-gray-300"
              >
                Offensive content
              </p>
              <p class="text-xs text-neutral-700 dark:text-gray-300">
                Messages contain offensive language, hate speech, vulgarity, or
                insults.
              </p>
            </div>
          </label>
        </li>
        <li
          class="w-full rounded-b-lg border-[1px] border-neutral-300 dark:border-neutral-700 has-[:checked]:bg-slate-100"
        >
          <label for="list-radio-other" class="w-full h-full py-5 px-5 flex">
            <input
              id="list-radio-other"
              type="radio"
              value="other"
              name="list-radio"
              class="w-5 h-5 mr-3"
              v-model="reportType"
            />
            <div class="flex-col">
              <p
                class="text-lg leading-4 mb-1 font-semibold text-neutral-800 dark:text-gray-300"
              >
                Other
              </p>
              <p class="text-xs text-neutral-700 dark:text-gray-300">
                Please provide a detailed explanation of the issue.
              </p>
            </div>
          </label>
        </li>
      </ul>

      <div class="flex items-center w-full justify-center mb-8 mt-auto gap-4">
        <button
          class="mt-auto mb-4 rounded-lg px-6 sm:px-10 flex items-center select-none justify-center text-center p-3 font-semibold cursor-pointer text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all"
          @click="step--"
          v-if="!isSent && step > 0"
        >
          Back
        </button>
        <button
          class="mt-auto mb-4 w-full md:w-4/5 rounded-lg sm:w-4/5 flex items-center select-none justify-center text-center p-3 font-semibold text-neutral-50 dark:text-inherit transition-all"
          :class="[
            reportType === null ||
            (step === 1 && reportType === 'other' && !message)
              ? 'bg-red-500/50 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 dark:hover:bg-red-500/80 cursor-pointer',
          ]"
          :disabled="reportType === null"
          @click="nextStep"
          v-if="!isSent"
        >
          {{ step < 2 ? "Next" : "Send" }}
        </button>
      </div>

      <ol
        id="stepper"
        class="flex items-center justify-between w-full md:w-4/5 text-sm text-center text-gray-400 min-h-8 select-none mb-0"
      >
        <li class="flex items-center text-red-500" role="button">
          <i class="fa-solid fa-circle-check text-2xl" v-if="step >= 1"></i>
          <span
            class="rounded-full border-red-500 border-2 font-bold w-6 h-6 flex items-center justify-center"
            v-else
            >1</span
          >
        </li>
        <li class="flex w-4/5 items-center justify-center">
          <hr
            class="h-[2px] w-4/5"
            :class="{
              'bg-gray-400': step < 1,
              'border-red-500': step >= 1,
            }"
          />
        </li>
        <li
          class="flex items-center"
          :class="{ 'text-red-500': step >= 1 }"
          role="button"
        >
          <i class="fa-solid fa-circle-check text-2xl" v-if="step >= 2"></i>
          <span
            class="rounded-full border-2 font-bold w-6 h-6 flex items-center justify-center"
            :class="{
              'border-gray-400': step < 1,
              'border-red-500': step >= 1,
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
              'border-red-500': step >= 2,
            }"
          />
        </li>
        <li
          class="flex items-center"
          :class="{ 'text-red-500': step >= 2 }"
          role="button"
        >
          <i class="fa-solid fa-circle-check text-2xl" v-if="step >= 3"></i>
          <span
            class="rounded-full border-2 font-bold w-6 h-6 flex items-center justify-center"
            :class="{
              'border-gray-400': step < 2,
              'border-red-500': step >= 2,
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
/* import axios, { isAxiosError } from "axios"; */

const emit = defineEmits(["close"]);

const chatStore = useChatStore();
const store = useMainStore();

const message = ref("");
const reportType = ref<"fake" | "spam" | "offensive" | "other" | null>(null);

const step = ref(0);
const isSent = ref(false);

const nextStep = () => {
  if (reportType.value === null) {
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
