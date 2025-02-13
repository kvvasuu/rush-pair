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
          !chatStore.pairInfo.isBlocked &&
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
          !chatStore.pairInfo.isBlocked &&
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
          !chatStore.pairInfo.isBlocked &&
          !chatStore.pairInfo.isVisible &&
          chatStore.pairInfo.askedForReveal
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
          <div
            class="flex items-center justify-start w-full"
            v-if="chatStore.pairInfo.isBlocked"
          >
            <p
              class="text-slate-700 dark:text-neutral-300 font-semibold text-2xl w-4/5 truncate"
            >
              {{ chatStore.pairInfo.name || t("pairs.anonymous") }}
            </p>
          </div>
          <div class="flex items-center justify-start w-full" v-else>
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
          v-if="!chatStore.pairInfo.isBlocked"
          class="rounded-lg transition-all font-semibold px-6 py-2 text-xl mt-auto mb-6"
          :class="
            chatStore.pairInfo.isFavourite
              ? 'text-yellow-400 dark:text-yellow-500 bg-slate-500 dark:bg-neutral-800 hover:bg-slate-400 dark:hover:bg-neutral-700'
              : 'text-slate-400 dark:text-neutral-600 hover:bg-neutral-400/10'
          "
          @click="toggleFavourite"
          :title="
            chatStore.pairInfo.isFavourite
              ? t('pairs.deleteFromFavourites')
              : t('pairs.setAsFavourite')
          "
        >
          <i class="fa-solid fa-star mr-2"></i
          ><span>{{ t("pairs.favourites") }}</span>
        </button>
        <div
          class="flex items-center justify-center gap-1 mb-4 self-center flex-wrap"
          :class="{ 'mt-auto': chatStore.pairInfo.isBlocked }"
        >
          <button
            class="text-red-500 rounded-lg hover:bg-neutral-400/10 transition-all font-semibold px-6 py-2 text-xl"
            @click="toggleReportOverlay"
            :title="t('report.report')"
          >
            <i class="fa-solid fa-triangle-exclamation mr-2"></i
            ><span>{{ t("report.report") }}</span>
          </button>
          <button
            class="text-red-500 rounded-lg hover:bg-neutral-400/10 transition-all font-semibold px-6 py-2 text-xl"
            @click="toggleBlockModal"
            :title="t('pairs.block')"
            v-if="!chatStore.pairInfo.isBlocked"
          >
            <i class="fa-solid fa-ban mr-2"></i
            ><span>{{ t("pairs.block") }}</span>
          </button>
        </div>

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
        <ConfirmationModal
          @close="isBlockModalVisible = false"
          @confirm="blockUser"
          v-if="isBlockModalVisible"
        >
          <template v-slot:title>{{ t("pairs.blockUser") }}</template>
          <template v-slot:content>
            <div>
              <ul
                class="flex mx-0 sm:mx-8 flex-col items-start justify-center gap-4 text-neutral-600 dark:text-neutral-300 mb-4"
              >
                <h3 class="font-bold text-lg mb-1">
                  {{ t("pairs.onBlock") }}
                </h3>
                <li class="ml-8 list-disc">
                  <p class="pl-1 sm:pl-5 font-semibold text-sm">
                    {{ t("pairs.cannotPairAgain") }}
                  </p>
                </li>
                <li class="ml-8 list-disc">
                  <p class="pl-1 sm:pl-5 font-semibold text-sm">
                    {{ t("pairs.cannotSee") }}
                  </p>
                </li>
              </ul>
            </div>
          </template>
          <template v-slot:confirm-button>
            <i class="fa-solid fa-ban mr-2"></i
            ><span>{{ t("pairs.block") }}</span>
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
                  : chatStore.pairInfo.isVisible
                  ? t("pairs.bothRevealed")
                  : t("pairs.revealRequestSent")
              }}
            </h2>
          </template>
          <template #content>
            <div
              class="flex mx-0 sm:mx-8 flex-col items-center justify-center gap-4 text-neutral-600 dark:text-neutral-300 mb-4"
            >
              <h3 class="font-semibold mt-2 text-center">
                {{
                  notEnoughRushCoins
                    ? ""
                    : chatStore.pairInfo.isVisible
                    ? t("pairs.enjoyConversation")
                    : t("pairs.waitForResponse")
                }}
              </h3>
            </div>
          </template>
        </InformationModal>
      </Teleport>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import PairAvatar from "../../../../components/PairAvatar.vue";
import PairReportOverlay from "./PairReportOverlay.vue";
import { useChatStore } from "../../../../stores/chatStore";
import { useUserStore } from "../../../../stores/userStore";
import ConfirmationModal from "../../../../components/containers/ConfirmationModal.vue";
import InformationModal from "../../../../components/containers/InformationModal.vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

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
  if (userStore.rushCoins < 5) {
    notEnoughRushCoins.value = true;
    toggleInformationModal();
    return;
  }
  isAskModalVisible.value = !isAskModalVisible.value;
};

const askForReveal = async () => {
  const response = await chatStore.askForReveal();
  response === "notEnoughRushCoins"
    ? (notEnoughRushCoins.value = true)
    : (notEnoughRushCoins.value = false);

  setTimeout(() => {
    if (!chatStore.pairInfo.isVisible) isInformationModalVisible.value = true;
  }, 300);
};

const isInformationModalVisible = ref(false);
const toggleInformationModal = () => {
  isInformationModalVisible.value = !isInformationModalVisible.value;
};

const isBlockModalVisible = ref(false);
const toggleBlockModal = () => {
  isBlockModalVisible.value = !isBlockModalVisible.value;
};

const blockUser = async () => {
  try {
    await axios.post(`/chat/block-user`, {
      userId: userStore.id,
      pairId: chatStore.pairInfo.id,
    });
  } catch (error) {
    console.log(error);
  } finally {
    toggleBlockModal();
  }
};

const notEnoughRushCoins = ref(false);

const toggleFavourite = async () => {
  try {
    await axios.post(`/chat/toggle-favourite`, {
      userId: userStore.id,
      pairId: chatStore.pairInfo.id,
    });

    chatStore.pairInfo.isFavourite = !chatStore.pairInfo.isFavourite;
    const pair = userStore.pairs.find(
      (pair) => pair.id === chatStore.pairInfo.id
    );
    if (pair) pair.isFavourite = chatStore.pairInfo.isFavourite;
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => chatStore.pairInfo.isVisible,
  (newValue) => {
    if (newValue) {
      isInformationModalVisible.value = newValue;
    }
  },
  { deep: true }
);
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
