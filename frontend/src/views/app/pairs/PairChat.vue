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
        class="w-full h-80 flex flex-row overflow-hidden relative box-border bg-slate-300 dark:bg-neutral-800/20 lg:hidden"
        v-if="props.isProfileExpanded"
      >
        <div class="p-8"></div>
      </div>
    </Transition>

    <div class="flex-1 lg:h-full w-full flex flex-col lg:flex-col justify-end">
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
          class="w-20 h-full absolute right-0 text-rose-500 hover:text-rose-600 transition-all"
          :title="message ? `Send message` : `Send heart`"
        >
          <i class="fa-solid fa-paper-plane text-2xl" v-if="message"></i>
          <i class="fa-solid fa-heart text-2xl" v-else></i>
        </button>
      </div>
    </div>

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
          class="w-full h-full py-6 px-8 relative flex flex-col overflow-y-auto"
          v-if="!isSettingsVisible"
        >
          <p
            class="text-slate-700 dark:text-neutral-300 font-semibold text-2xl w-full"
          >
            <span>{{ chatStore.pairInfo.name || "Anonymous" }}</span>

            <span class="ml-2 font-normal" v-if="chatStore.pairInfo.age">{{
              chatStore.pairInfo.age
            }}</span>
          </p>
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
            class="text-slate-600 dark:text-neutral-500 text-base text-justify mt-3 leading-5"
            v-if="chatStore.pairInfo.description"
          >
            {{ chatStore.pairInfo.description }}
          </p>
          <button
            class="text-slate-400 dark:text-neutral-500 group self-center mt-auto mb-0"
            @click="toggleChatSettings"
            title="Pair settings"
          >
            <i
              class="fa-solid fa-ellipsis text-2xl flex items-center justify-center h-12 w-12 rounded-full group-hover:bg-neutral-400/10 dark:group-hover:text-neutral-400 transition-all"
            ></i>
          </button>

          <!-- <div class="flex items-center justify-center ">
          <input
            type="text"
            v-model="name"
            class="max-w-40 ml-6 h-8 text-lg font-semibold text-slate-700 dark:text-neutral-300 select-none bg-transparent border-b-[1px] border-neutral-400 dark:border-neutral-500 outline-none"
          />
          <button
            class="ml-2 text-slate-400 dark:text-neutral-500 group"
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
              class="fa-solid fa-xmark flex text-rose-500 items-center justify-center h-8 w-8 rounded-full"
              v-else-if="name.length <= 0"
            ></i>
            <i
              class="fa-solid fa-check flex text-blue-500 items-center justify-center h-8 w-8 rounded-full group-hover:bg-neutral-400/10 dark:group-hover:text-neutral-400 transition-all"
              v-else
            ></i>
          </button>
        </div> -->
        </div>

        <div
          class="w-full h-full py-6 px-8 relative flex flex-col bg-slate-100 dark:bg-neutral-800"
          v-else
        >
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
import { onBeforeMount, ref } from "vue";
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

const name = ref(chatStore.pairInfo.name || "");

const isSettingsVisible = ref(false);

const isEditingNickname = ref(false);

const toggleChatSettings = () => {
  isSettingsVisible.value = !isSettingsVisible.value;
};

const editNickname = () => {
  isEditingNickname.value = true;
};

const saveNickname = () => {
  if (name.value.length <= 0) {
    return;
  }
  isEditingNickname.value = false;
};

onBeforeMount(async () => {
  const success = await chatStore.openChat(route.params.id as string);
  success ? (cannotGetPair.value = false) : (cannotGetPair.value = true);
  isLoading.value = false;
});

onBeforeRouteLeave(() => {
  setTimeout(() => {
    chatStore.closeChat();
  }, 500);
});
</script>

<style>
.expand-enter-active {
  animation: expand 0.5s ease;
}

.expand-leave-active {
  animation: expand 0.5s ease reverse;
}

@keyframes expand {
  0% {
    height: 0;
  }
  100% {
    height: 20rem;
  }
}

.slide-enter-active {
  transition: all 0.3s;
}

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
