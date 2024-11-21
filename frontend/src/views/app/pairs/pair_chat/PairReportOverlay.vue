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
        <h4 class="text-xs font-semibold text-neutral-500">
          We won't tell
          <span v-if="chatStore.pairInfo.name !== 'Anonymous'">{{
            chatStore.pairInfo.name
          }}</span>
          <span v-else>anyone</span>
        </h4>
      </div>
      <div
        class="flex items-center justify-center h-full w-full"
        v-if="store.isLoading"
      >
        <BasicSpinner></BasicSpinner>
      </div>

      <div class="w-full sm:w-4/5 flex flex-col h-full" v-else-if="step < 3">
        <ul
          class="w-full text-sm font-medium bg-neutral-50 dark:bg-neutral-800 rounded-lg"
          v-if="step === 0"
        >
          <li
            class="w-full rounded-t-lg border-[1px] border-neutral-300 dark:border-neutral-700 border-b-0 has-[:checked]:bg-slate-100 dark:has-[:checked]:bg-neutral-700"
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
                  class="text-lg leading-4 mb-1 font-semibold text-neutral-800 dark:text-neutral-300"
                >
                  Fake profile
                </p>
                <p class="text-xs text-neutral-700 dark:text-neutral-400">
                  The user is pretending to be someone else or providing false
                  information.
                </p>
              </div>
            </label>
          </li>
          <li
            class="w-full border-[1px] border-neutral-300 dark:border-neutral-700 border-b-0 has-[:checked]:bg-slate-100 dark:has-[:checked]:bg-neutral-700"
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
                  class="text-lg leading-4 mb-1 font-semibold text-neutral-800 dark:text-neutral-300"
                >
                  Spam
                </p>
                <p class="text-xs text-neutral-700 dark:text-neutral-400">
                  The user is sending unwanted messages, advertisements, or
                  links.
                </p>
              </div>
            </label>
          </li>
          <li
            class="w-full border-[1px] border-neutral-300 dark:border-neutral-700 border-b-0 has-[:checked]:bg-slate-100 dark:has-[:checked]:bg-neutral-700"
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
                  class="text-lg leading-4 mb-1 font-semibold text-neutral-800 dark:text-neutral-300"
                >
                  Offensive content
                </p>
                <p class="text-xs text-neutral-700 dark:text-neutral-400">
                  Messages contain offensive language, hate speech, vulgarity,
                  or insults.
                </p>
              </div>
            </label>
          </li>
          <li
            class="w-full rounded-b-lg border-[1px] border-neutral-300 dark:border-neutral-700 has-[:checked]:bg-slate-100 dark:has-[:checked]:bg-neutral-700"
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
                  class="text-lg leading-4 mb-1 font-semibold text-neutral-800 dark:text-neutral-300"
                >
                  Other
                </p>
                <p class="text-xs text-neutral-700 dark:text-neutral-400">
                  Please provide a detailed explanation of the issue.
                </p>
              </div>
            </label>
          </li>
        </ul>

        <div class="text-sm w-full h-60 font-medium" v-if="step === 1">
          <h3 class="text-xs mb-2 text-neutral-700 dark:text-neutral-400">
            <span v-if="reportType === 'other'"
              >Please provide a detailed explanation of the issue.</span
            >
            <span v-else>
              Optional: Add additional details to help us better understand the
              issue.</span
            >
          </h3>
          <textarea
            id="other-text"
            class="w-full h-full px-5 py-4 text-neutral-700 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 rounded-lg outline-none resize-none"
            autocomplete="off"
            spellcheck="false"
            v-model="message"
            maxlength="200"
          ></textarea>
        </div>

        <div
          class="w-full flex flex-col justify-start h-full mb-6 font-medium text-neutral-700 dark:text-neutral-400"
          v-if="step === 2"
        >
          <h3 class="text-lg w-full font-semibold text-center mb-2 gap-2">
            Summary:
          </h3>

          <div class="flex justify-start gap-2">
            <div class="font-semibold w-[102px] shrink-0">Report type:</div>
            <div>{{ reportTypeMap[reportType] }}</div>
          </div>
          <div class="flex justify-start gap-2">
            <div class="font-semibold w-[102px] shrink-0">Message:</div>
            <div class="line-clamp-6">
              <span v-if="message">{{ message }}</span
              ><span v-else class="text-sm text-neutral-400 select-none"
                >No additional details provided.</span
              >
            </div>
          </div>
          <div class="flex w-full justify-center mt-8 leading-3">
            <div class="flex items-center h-5">
              <input
                id="confirmReport"
                name="confirmReport"
                type="checkbox"
                v-model="isConfirmed"
                class="w-4 h-4"
              />
            </div>
            <div class="ms-2">
              <label
                for="confirmReport"
                class="text-xs font-semibold text-neutral-600"
                >I confirm that the information provided is accurate and
                truthful to the best of my knowledge.</label
              >
            </div>
          </div>
        </div>

        <div
          class="flex items-center flex-col w-full justify-center mb-2 sm:mb-8 mt-auto gap-4"
        >
          <div class="text-xs font-semibold text-center text-neutral-500">
            Your report is anonymous, and the user you reported will not be
            notified about your identity.
          </div>
          <div class="flex items-center w-full justify-center gap-4">
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
                (step === 1 && reportType === 'other' && message.length <= 3) ||
                (step === 2 && !isConfirmed)
                  ? 'bg-red-500/50 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 dark:hover:bg-red-500/80 cursor-pointer',
              ]"
              :disabled="
                reportType === null ||
                (step === 1 && reportType === 'other' && message.length <= 3) ||
                (step === 2 && !isConfirmed)
              "
              @click="nextStep"
              v-if="!isSent"
            >
              {{ step < 2 ? "Next" : "Submit report" }}
            </button>
          </div>
        </div>
      </div>

      <div class="w-full sm:w-4/5 flex flex-col h-full" v-else-if="step === 3">
        <div v-if="!showError">
          <h2
            class="font-bold text-center text-neutral-800 dark:text-neutral-400 mb-6"
          >
            Thank you for helping us maintain a safe and respectful community.
          </h2>

          <p
            class="font-semibold text-center text-neutral-700 dark:text-neutral-500"
          >
            Reference ID:
          </p>
          <p class="font-bold text-2xl text-center text-red-500 mb-6">
            {{ reportReferenceID }}
          </p>

          <h3
            class="font-semibold text-center text-neutral-800 dark:text-neutral-400"
          >
            Your report will be reviewed by our moderation team.<br />If
            necessary, we may take appropriate actions, including account
            restrictions or bans.
          </h3>
        </div>

        <div v-else>
          <h2 class="font-bold text-center text-red-500">
            Something went wrong. Try again later.
          </h2>
        </div>

        <button
          class="mt-auto mb-2 sm:mb-8 w-full rounded-lg px-6 sm:px-10 flex items-center select-none justify-center text-center p-3 font-semibold cursor-pointer text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all"
          v-if="!isSent && step > 0"
          @click="close"
        >
          Close
        </button>
      </div>

      <ol
        id="stepper"
        class="flex items-center justify-between w-full md:w-4/5 text-sm text-center text-gray-400 min-h-8 select-none mb-0"
      >
        <li class="flex items-center text-red-500">
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
        <li class="flex items-center" :class="{ 'text-red-500': step >= 1 }">
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
        <li class="flex items-center" :class="{ 'text-red-500': step >= 2 }">
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
import BasicSpinner from "../../../../components/BasicSpinner.vue";
import axios from "axios";

const emit = defineEmits(["close"]);

const chatStore = useChatStore();
const store = useMainStore();

const message = ref("");
const reportType = ref<"fake" | "spam" | "offensive" | "other">("fake");

const reportTypeMap = {
  fake: "Fake profile",
  spam: "Spam",
  offensive: "Offensive content",
  other: "Other",
};

const showError = ref(false);

const reportReferenceID = ref("231321");

const isConfirmed = ref(false);

const step = ref(0);
const isSent = ref(false);

const nextStep = () => {
  if (reportType.value === null) {
    return;
  } else {
    step.value < 2 ? step.value++ : sendReport();
  }
};

const sendReport = async () => {
  if (isConfirmed.value) {
    store.isLoading = true;
    try {
      const res = await axios.post(`/chat/report-user`, {
        userId: chatStore.pairInfo.id,
        reportType: reportType.value,
        confirmed: isConfirmed.value,
        message: message.value,
      });
      reportReferenceID.value = res.data.reportReferenceId;
    } catch (error) {
      showError.value = true;
      console.log(error);
    } finally {
      store.isLoading = false;
      step.value = 3;
    }
  }
};

const close = () => {
  if (!store.isLoading) emit("close");
};
</script>
