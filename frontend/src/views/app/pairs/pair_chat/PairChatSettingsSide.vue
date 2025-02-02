<template>
  <div
    class="hidden lg:flex flex-col items-center justify-start w-2/5 max-w-[25rem] h-full overflow-hidden relative box-border bg-slate-300 dark:bg-neutral-800/20"
  >
    <div class="w-full aspect-square relative group z-10">
      <PairAvatar
        :pair="chatStore.pairInfo"
        :square="true"
        :key="chatStore.pairInfo.imageUrl"
        class="z-10"
      ></PairAvatar>
      <div
        class="w-full aspect-square flex flex-col justify-center items-center gap-4 absolute top-0 bg-black/40 backdrop-blur opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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
        <p
          class="font-bold text-3xl text-center text-neutral-200 animate-pulse"
        >
          {{ t("pairs.askForReveal") }}?
        </p>
      </div>
      <div
        class="w-full aspect-square flex flex-col justify-center items-center gap-4 absolute top-0 bg-black/40 backdrop-blur transition-all"
        v-else-if="
          !chatStore.pairInfo.isVisible &&
          !chatStore.pairInfo.askedForReveal &&
          chatStore.pairInfo.hasBeenAskedForReveal
        "
      >
        <p class="font-bold text-xl text-neutral-200 animate-pulse">
          {{ t("pairs.waitingForResponse") }}...
        </p>
        <i
          class="fa-solid fa-masks-theater text-5xl text-neutral-200 animate-pulse"
        ></i>
      </div>
      <div
        class="w-full aspect-square flex flex-col justify-center items-center gap-4 absolute top-0 bg-black/40 backdrop-blur cursor-pointer"
        v-else-if="
          !chatStore.pairInfo.isVisible && chatStore.pairInfo.askedForReveal
        "
        @click="toggleAskModal"
      >
        <p class="font-bold text-xl text-neutral-200 animate-pulse">
          {{ t("pairs.revealRequested") }}!
        </p>
        <i
          class="fa-regular fa-eye text-5xl text-neutral-200 animate-pulse"
        ></i>
        <p class="font-bold text-3xl text-neutral-200 animate-pulse">
          {{ t("pairs.revealToo") }}?
        </p>
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
            >{{ chatStore.pairInfo.name || t("pairs.anonymous") }}
          </span>

          <span class="ml-2 font-normal" v-if="chatStore.pairInfo.age">{{
            chatStore.pairInfo.age
          }}</span>
        </div>
        <p class="text-slate-600 dark:text-neutral-500 text-sm">
          <i class="fa-solid fa-location-dot mr-1 text-xs w-3"></i>
          <span>{{
            chatStore.pairInfo.city || t("pairs.unknownLocation")
          }}</span>
        </p>
        <p
          class="text-slate-600 dark:text-neutral-500 text-sm"
          v-if="!!chatStore.pairInfo.gender"
        >
          <i
            class="fa-solid fa-mars mr-1 text-xs w-3"
            v-if="chatStore.pairInfo.gender === 'male'"
          ></i>
          <i
            class="fa-solid fa-venus mr-1 text-xs w-3"
            v-else-if="chatStore.pairInfo.gender === 'female'"
          >
          </i>
          <span class="capitalize">{{
            t("general." + chatStore.pairInfo.gender)
          }}</span>
        </p>
        <p
          class="text-slate-600 dark:text-neutral-500 text-base text-justify mt-3 mb-8 leading-5"
          v-if="chatStore.pairInfo.description"
          v-html="formatDescription(chatStore.pairInfo.description)"
        ></p>
        <button
          class="text-slate-400 dark:text-neutral-500 group self-center mt-auto mb-0"
          @click="toggleChatSettings"
          :title="t('pairs.openPairSettings')"
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
            >{{ t("pairs.nickname") }}:</span
          >
          <div class="flex items-center justify-start w-full">
            <p
              class="text-slate-700 dark:text-neutral-300 font-semibold text-2xl w-4/5 truncate"
              v-if="!isEditingNickname"
            >
              {{ chatStore.pairInfo.name || t("pairs.anonymous") }}
            </p>
            <input
              type="text"
              maxlength="60"
              v-model="chatStore.pairInfo.name"
              class="text-2xl w-4/5 font-semibold text-slate-700 dark:text-neutral-300 select-none bg-transparent border-b-[1px] border-neutral-400 dark:border-neutral-500 outline-none"
              @keyup.enter="saveNickname"
              v-else
            />
            <button
              class="ml-auto mr-0 text-slate-400 dark:text-neutral-500 group"
              :title="
                !isEditingNickname
                  ? t('pairs.editNickname')
                  : chatStore.pairInfo.name.length <= 0
                  ? t('pairs.discardNickname')
                  : t('pairs.saveNickname')
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
                v-else-if="chatStore.pairInfo.name.length <= 0"
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
          :title="t('report.report')"
        >
          <i class="fa-solid fa-triangle-exclamation mr-2"></i
          ><span>{{ t("report.report") }}</span>
        </button>
        <button
          class="text-slate-400 dark:text-neutral-500 group self-center mb-0"
          @click="toggleChatSettings"
          :title="t('pairs.closePairSettings')"
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
          <template v-slot:title>{{ t("pairs.reveal") }}?</template>
          <template v-slot:content
            ><div
              v-if="
                !chatStore.pairInfo.isVisible &&
                !chatStore.pairInfo.askedForReveal &&
                !chatStore.pairInfo.hasBeenAskedForReveal
              "
            >
              <p>{{ t("pairs.curious") }}</p>
              <p>
                {{ t("pairs.sendARequest") }}
              </p>
            </div>
            <div v-else>
              <p>{{ t("pairs.someoneIsCurious") }}</p>
              <p>{{ t("pairs.wantToReveal") }}</p>
            </div>
          </template>
        </ConfirmationModal>
      </Teleport>
    </Transition>
    <Transition name="fade" mode="out-in">
      <Teleport to="body">
        <InformationModal
          @close="isInformationModalVisible = false"
          v-if="isInformationModalVisible"
        >
          <template #title>
            <img
              src="/RushCoin.svg"
              alt="RushCoin"
              draggable="false"
              class="aspect-square w-24 select-none my-2 absolute -top-12"
            />
            <h2
              class="mt-12 text-center font-bold text-xl text-neutral-600 dark:text-neutral-300"
            >
              {{
                notEnoughRushCoins
                  ? t("pairs.notEnoughRushCoins")
                  : t("pairs.revealRequestSent")
              }}
            </h2>
          </template>
          <template #content>
            <div
              class="flex mx-0 sm:mx-8 flex-col items-center justify-center gap-4 text-neutral-600 dark:text-neutral-300 mb-4"
            >
              <h3 class="font-semibold mt-2 text-center">
                {{ !notEnoughRushCoins ? t("pairs.waitForResponse") : "" }}
              </h3>
            </div>
          </template>
        </InformationModal>
      </Teleport>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PairAvatar from "../../../../components/PairAvatar.vue";
import PairReportOverlay from "./PairReportOverlay.vue";
import { useChatStore } from "../../../../stores/chatStore";
import { useUserStore } from "../../../../stores/userStore";
import ConfirmationModal from "../../../../components/containers/ConfirmationModal.vue";
import InformationModal from "../../../../components/containers/InformationModal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const chatStore = useChatStore();
const userStore = useUserStore();

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
  if (userStore.rushCoins < 2) {
    notEnoughRushCoins.value = true;
    toggleInformationModal();
    return;
  }
  isAskModalVisible.value = !isAskModalVisible.value;
};

const isInformationModalVisible = ref(false);
const toggleInformationModal = () => {
  isInformationModalVisible.value = !isInformationModalVisible.value;
};

const notEnoughRushCoins = ref(false);

const askForReveal = async () => {
  const response = await chatStore.askForReveal();
  response === "notEnoughRushCoins"
    ? (notEnoughRushCoins.value = true)
    : (notEnoughRushCoins.value = false);

  toggleInformationModal();
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
