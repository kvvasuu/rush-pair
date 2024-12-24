<template>
  <Transition name="expand">
    <div
      class="w-full h-full sm:h-80 absolute top-0 z-10 flex flex-col items-center sm:flex-row overflow-hidden sm:relative box-border bg-slate-300 dark:bg-neutral-800/20 lg:hidden"
      v-if="props.isProfileExpanded"
    >
      <div
        class="hidden sm:flex h-full aspect-square justify-center bg-slate-300 dark:bg-neutral-900"
      >
        <div class="h-full aspect-square relative group z-10">
          <PairAvatar
            :pair="chatStore.pairInfo"
            :square="true"
            :key="chatStore.pairInfo.imageUrl"
            class="z-10"
          ></PairAvatar>
          <div
            class="h-full aspect-square flex flex-col justify-center items-center gap-4 absolute top-0 bg-black/40 backdrop-blur cursor-pointer"
            v-if="
              !chatStore.pairInfo.isVisible &&
              !chatStore.pairInfo.askedForReveal &&
              !chatStore.pairInfo.hasBeenAskedForReveal
            "
            @click="toggleAskModal"
          >
            <i
              class="fa-solid fa-masks-theater text-5xl text-neutral-200 animate-pulse"
            ></i>
            <p class="font-bold text-3xl text-neutral-200 animate-pulse">
              Ask for reveal?
            </p>
          </div>
          <div
            class="h-full aspect-square flex flex-col justify-center items-center gap-4 absolute top-0 bg-black/40 backdrop-blur text-center"
            v-else-if="
              !chatStore.pairInfo.isVisible &&
              !chatStore.pairInfo.askedForReveal &&
              chatStore.pairInfo.hasBeenAskedForReveal
            "
          >
            <p class="font-bold text-xl text-neutral-200 animate-pulse">
              Waiting for response...
            </p>
            <i
              class="fa-solid fa-masks-theater text-5xl text-neutral-200 animate-pulse"
            ></i>
          </div>
          <div
            class="h-full aspect-square flex flex-col justify-center items-center gap-4 absolute top-0 bg-black/40 backdrop-blur cursor-pointer text-center"
            v-else-if="
              !chatStore.pairInfo.isVisible && chatStore.pairInfo.askedForReveal
            "
            @click="toggleAskModal"
          >
            <p class="font-bold text-xl text-neutral-200 animate-pulse">
              Identity reveal requested!
            </p>
            <i
              class="fa-regular fa-eye text-5xl text-neutral-200 animate-pulse"
            ></i>
            <p class="font-bold text-3xl text-neutral-200 animate-pulse">
              Reveal too?
            </p>
          </div>
        </div>
      </div>

      <div
        class="sm:hidden h-full w-full relative flex justify-center bg-slate-300 dark:bg-neutral-900 overflow-hidden"
      >
        <div
          class="h-full w-full flex justify-center aspect-square absolute group"
        >
          <PairAvatar
            :pair="chatStore.pairInfo"
            :square="true"
            :key="chatStore.pairInfo.imageUrl + '_under'"
            class="w-full aspect-square absolute z-20 blur-md"
          ></PairAvatar>
          <PairAvatar
            :pair="chatStore.pairInfo"
            :square="true"
            :key="chatStore.pairInfo.imageUrl"
            class="h-full aspect-square absolute z-30"
          ></PairAvatar>
          <div
            class="w-full h-full flex flex-col z-40 justify-center items-center gap-4 absolute backdrop-blur top-0 bg-black/40 text-center cursor-pointer"
            v-if="
              !chatStore.pairInfo.isVisible &&
              !chatStore.pairInfo.askedForReveal &&
              !chatStore.pairInfo.hasBeenAskedForReveal
            "
            @click="toggleAskModal"
          >
            <i
              class="fa-solid fa-masks-theater text-5xl text-neutral-200 animate-pulse"
            ></i>
            <p class="font-bold text-3xl text-neutral-200 animate-pulse">
              Ask for reveal?
            </p>
          </div>
          <div
            class="w-full h-full flex flex-col z-40 justify-center items-center gap-4 absolute backdrop-blur top-0 bg-black/40 text-center"
            v-else-if="
              !chatStore.pairInfo.isVisible &&
              !chatStore.pairInfo.askedForReveal &&
              chatStore.pairInfo.hasBeenAskedForReveal
            "
          >
            <p class="font-bold text-xl text-neutral-200 animate-pulse">
              Waiting for response...
            </p>
            <i
              class="fa-solid fa-masks-theater text-5xl text-neutral-200 animate-pulse"
            ></i>
          </div>
          <div
            class="w-full h-full flex flex-col z-40 justify-center items-center gap-4 absolute backdrop-blur top-0 bg-black/40 text-center cursor-pointer"
            v-else-if="
              !chatStore.pairInfo.isVisible && chatStore.pairInfo.askedForReveal
            "
            @click="toggleAskModal"
          >
            <p class="font-bold text-xl text-neutral-200 animate-pulse">
              Identity reveal requested!
            </p>
            <i
              class="fa-regular fa-eye text-5xl text-neutral-200 animate-pulse"
            ></i>
            <p class="font-bold text-3xl text-neutral-200 animate-pulse">
              Reveal too?
            </p>
          </div>
        </div>
      </div>

      <Transition name="slide" mode="out-in">
        <div
          class="flex flex-col w-full h-full py-6 px-8 relative overflow-y-auto"
          v-if="!isSettingsVisible"
        >
          <div
            class="flex justify-start text-slate-700 dark:text-neutral-300 font-semibold text-2xl w-full"
          >
            <span class="truncate max-w-72" :title="chatStore.pairInfo.name"
              >{{ chatStore.pairInfo.name || "Anonymous" }}
            </span>

            <span class="ml-2 font-normal" v-if="chatStore.pairInfo.age">{{
              chatStore.pairInfo.age
            }}</span>
          </div>
          <p class="text-slate-600 dark:text-neutral-500 text-sm">
            <i class="fa-solid fa-location-dot mr-1 text-xs w-3"></i>
            <span>{{ chatStore.pairInfo.city || "Unknown location" }}</span>
          </p>
          <p class="text-slate-600 dark:text-neutral-500 text-sm">
            <i
              class="fa-solid fa-mars mr-1 text-xs w-3"
              v-if="chatStore.pairInfo.gender === 'male'"
            ></i>
            <i
              class="fa-solid fa-venus mr-1 text-xs w-3"
              v-else-if="chatStore.pairInfo.gender === 'female'"
            >
            </i>
            <span class="capitalize">{{ chatStore.pairInfo.gender }}</span>
          </p>
          <p
            class="text-slate-600 dark:text-neutral-500 text-base text-justify mt-3 mb-3 leading-5"
            v-if="chatStore.pairInfo.description"
            v-html="formatDescription(chatStore.pairInfo.description)"
          ></p>
          <button
            class="text-slate-400 dark:text-neutral-500 group self-center mt-auto mb-0"
            @click="toggleChatSettings"
            title="Open pair settings"
          >
            <i
              class="fa-solid fa-ellipsis text-2xl flex items-center justify-center h-12 w-12 rounded-full group-hover:bg-neutral-400/10 dark:group-hover:text-neutral-400 transition-all"
            ></i>
          </button>
        </div>

        <div class="w-full h-full py-6 px-8 flex flex-col" v-else>
          <div class="flex items-center flex-col justify-start">
            <span
              class="w-full text-start text-sm text-slate-600 dark:text-neutral-500 select-none"
              >Nickname:</span
            >
            <div class="flex items-center justify-start w-full">
              <p
                class="text-slate-700 dark:text-neutral-300 font-semibold text-2xl w-4/5 truncate"
                v-if="!isEditingNickname"
              >
                {{ chatStore.pairInfo.name || "Anonymous" }}
              </p>
              <input
                type="text"
                maxlength="60"
                v-model="chatStore.pairInfo.name"
                class="text-2xl w-4/5 font-semibold text-slate-700 dark:text-neutral-300 select-none bg-transparent border-b-[1px] border-neutral-400 dark:border-neutral-500 outline-none"
                v-else
              />
              <button
                class="ml-auto mr-0 text-slate-400 dark:text-neutral-500 group"
                :title="
                  !isEditingNickname
                    ? `Edit nickname`
                    : chatStore.pairInfo.name.length <= 0 ||
                      chatStore.pairInfo.name === tempNickname
                    ? `Discard nickname`
                    : `Save nickname`
                "
                @click.stop="
                  () => (isEditingNickname ? saveNickname() : editNickname())
                "
              >
                <i
                  class="fa-solid fa-pencil flex items-center justify-center h-8 w-8 rounded-full group-hover:bg-neutral-400/10 dark:group-hover:text-neutral-400 transition-all"
                  v-if="!isEditingNickname"
                ></i>
                <i
                  class="fa-solid fa-xmark flex text-rose-500 items-center justify-center h-8 w-8 rounded-full bg-neutral-400/10"
                  v-else-if="
                    chatStore.pairInfo.name.length <= 0 ||
                    chatStore.pairInfo.name === tempNickname
                  "
                ></i>
                <i
                  class="fa-solid fa-check flex text-blue-500 items-center justify-center h-8 w-8 rounded-full group-hover:bg-neutral-400/10 dark:group-hover:text-neutral-400 transition-all"
                  v-else
                ></i>
              </button>
            </div>
          </div>
          <button
            class="text-red-500 rounded-lg hover:bg-neutral-400/10 transition-all font-semibold px-6 py-2 text-xl self-center mt-auto mb-4"
            @click="toggleReportOverlay"
            title="Report"
          >
            <i class="fa-solid fa-triangle-exclamation mr-2"></i
            ><span>Report</span>
          </button>
          <button
            class="text-slate-400 dark:text-neutral-500 group self-center mb-0"
            @click="toggleChatSettings"
            title="Close pair settings"
          >
            <i
              class="fa-solid fa-xmark text-2xl flex items-center justify-center h-12 w-12 rounded-full group-hover:bg-neutral-400/10 dark:group-hover:text-neutral-400 transition-all"
            ></i>
          </button>
        </div>
      </Transition>
      <Transition name="fade" mode="out-in">
        <Teleport to="body">
          <PairReportOverlay
            v-if="isReportOverlayVisible"
            @close="toggleReportOverlay"
          ></PairReportOverlay>
        </Teleport>
      </Transition>
      <Transition name="fade" mode="out-in">
        <Teleport to="body">
          <ConfirmationModal
            @close="isAskModalVisible = false"
            @confirm="askForReveal"
            v-if="isAskModalVisible"
          >
            <template v-slot:title>Reveal?</template>
            <template v-slot:content
              ><div
                v-if="
                  !chatStore.pairInfo.isVisible &&
                  !chatStore.pairInfo.askedForReveal &&
                  !chatStore.pairInfo.hasBeenAskedForReveal
                "
              >
                <p>Curious who you're chatting with?</p>
                <p>
                  Send a request to reveal their identity and wait for their
                  response!
                </p>
              </div>
              <div v-else>
                <p>Someone's curious about who you are!</p>
                <p>Do you want to reveal your identity to them?</p>
              </div>
            </template>
          </ConfirmationModal>
        </Teleport>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PairAvatar from "../../../../components/PairAvatar.vue";
import PairReportOverlay from "./PairReportOverlay.vue";
import { useChatStore } from "../../../../stores/chatStore";
import ConfirmationModal from "../../../../components/containers/ConfirmationModal.vue";

const props = defineProps(["isProfileExpanded"]);

const chatStore = useChatStore();

let tempNickname = "";

const isSettingsVisible = ref(false);

const isEditingNickname = ref(false);

const toggleChatSettings = () => {
  if (isEditingNickname.value) {
    chatStore.pairInfo.name = tempNickname;
    isEditingNickname.value = false;
  }
  isSettingsVisible.value = !isSettingsVisible.value;
};

const editNickname = () => {
  tempNickname = chatStore.pairInfo.name;
  isEditingNickname.value = true;
};

const saveNickname = async () => {
  if (
    chatStore.pairInfo.name.length <= 0 ||
    chatStore.pairInfo.name === tempNickname
  ) {
    isEditingNickname.value = false;
    chatStore.pairInfo.name = tempNickname;
    return;
  }
  const isChanged = await chatStore.changePairNickname();
  if (isChanged) isEditingNickname.value = false;
};

const formatDescription = (text: string) => {
  return text.replace(/\n/g, "<br>");
};

const isReportOverlayVisible = ref(false);

const toggleReportOverlay = () => {
  isReportOverlayVisible.value = !isReportOverlayVisible.value;
};

const isAskModalVisible = ref(false);
const toggleAskModal = () => {
  isAskModalVisible.value = !isAskModalVisible.value;
};

const askForReveal = () => {
  chatStore.askForReveal();
};
</script>

<style scoped>
input {
  border-radius: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter-from {
  transform: translateY(100%);
}
.slide-leave-to {
  transform: translateY(-100%);
}
</style>
