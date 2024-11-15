<template>
  <div
    class="absolute top-16 flex items-center justify-center w-full h-[calc(100%-8rem)] md:h-[calc(100%-4rem)]"
    v-if="isLoading"
  >
    <BasicSpinner></BasicSpinner>
  </div>
  <div
    class="absolute top-16 flex flex-col gap-4 items-center justify-center w-full h-[calc(100%-8rem)] md:h-[calc(100%-4rem)] px-4"
    v-else-if="cannotGetPair"
  >
    <i
      class="fa-solid fa-triangle-exclamation text-neutral-400 dark:text-neutral-500 select-none text-5xl"
    ></i>
    <p class="text-neutral-400 dark:text-neutral-500 select-none text-center">
      Something went wrong. Try again later...
    </p>
  </div>
  <div
    class="absolute top-16 flex flex-col lg:flex-row items-center justify-start w-full h-[calc(100%-8rem)] md:h-[calc(100%-4rem)]"
    v-else
  >
    <Transition name="expand">
      <div
        class="w-full h-full sm:h-80 absolute top-0 flex flex-col sm:flex-row overflow-hidden sm:relative box-border bg-slate-300 dark:bg-neutral-800/20 lg:hidden"
        v-if="props.isProfileExpanded"
      >
        <PairAvatar
          :pair="chatStore.pairInfo"
          :square="true"
          class="h-full aspect-square z-10"
        ></PairAvatar>
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
              title="Pair settings"
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
                    !isEditingNickname ? `Edit nickname` : `Save nickname`
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
              class="text-slate-400 dark:text-neutral-500 group self-center mt-auto mb-0"
              @click="toggleChatSettings"
            >
              <i
                class="fa-solid fa-xmark text-2xl flex items-center justify-center h-12 w-12 rounded-full group-hover:bg-neutral-400/10 dark:group-hover:text-neutral-400 transition-all"
              ></i>
            </button>
          </div>
        </Transition>
      </div>
    </Transition>

    <Transition name="slide-from-bottom">
      <div
        class="flex-1 lg:h-full w-full flex flex-col lg:flex-col justify-end"
        v-if="!isProfileExpandedMobile"
      >
        <div
          class="w-full flex-1 overflow-y-auto flex items-center justify-center"
        >
          Chat
        </div>
        <div class="w-full h-16 relative">
          <input
            name="message"
            id="message"
            v-model="message"
            type="text"
            class="w-full h-full m-0 outline-none p-2 pl-4 pr-14 text-2xl bg-neutral-50 hover:bg-neutral-100/90 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 text-neutral-600 dark:text-neutral-400 transition-all shadow z-30"
            placeholder="Type a message"
            autocomplete="off"
          /><button
            class="w-20 h-full absolute right-0 text-rose-500 hover:text-rose-600 transition-all duration-300 text-2xl hover:text-3xl"
            :title="message ? `Send message` : `Send heart`"
          >
            <Transition name="pop-up-fast" mode="out-in">
              <i class="fa-solid fa-paper-plane" v-if="message"></i>
              <i class="fa-solid fa-heart" v-else></i>
            </Transition>
          </button>
        </div>
      </div>
    </Transition>
    <div
      class="hidden lg:flex flex-col items-center justify-start w-2/5 max-w-[25rem] h-full overflow-hidden relative box-border bg-slate-300 dark:bg-neutral-800/20"
    >
      <PairAvatar
        :pair="chatStore.pairInfo"
        :square="true"
        class="z-10"
      ></PairAvatar>
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
            title="Pair settings"
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
                :title="!isEditingNickname ? `Edit nickname` : `Save nickname`"
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
            class="text-slate-400 dark:text-neutral-500 group self-center mt-auto mb-0"
            @click="toggleChatSettings"
          >
            <i
              class="fa-solid fa-xmark text-2xl flex items-center justify-center h-12 w-12 rounded-full group-hover:bg-neutral-400/10 dark:group-hover:text-neutral-400 transition-all"
            ></i>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import PairAvatar from "../../../components/PairAvatar.vue";
import { useChatStore } from "../../../stores/chatStore";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import BasicSpinner from "../../../components/BasicSpinner.vue";

const props = defineProps(["isProfileExpanded"]);
const route = useRoute();
const chatStore = useChatStore();

const message = ref("");

const isLoading = ref(true);

const cannotGetPair = ref(false);

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

const windowWidth = ref(0);
const checkWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

const isProfileExpandedMobile = computed(() => {
  return props.isProfileExpanded && windowWidth.value <= 640;
});

onBeforeMount(async () => {
  const success = await chatStore.openChat(route.params.id as string);
  success ? (cannotGetPair.value = false) : (cannotGetPair.value = true);
  isLoading.value = false;
  checkWindowWidth();
  window.addEventListener("resize", checkWindowWidth);
});

onBeforeRouteLeave(() => {
  setTimeout(() => {
    chatStore.closeChat();
  }, 500);
});
</script>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s;
}

.expand-enter-from {
  transform: translateY(-100%);
}
.expand-leave-to {
  transform: translateY(-100%);
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
