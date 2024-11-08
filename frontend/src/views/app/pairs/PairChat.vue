<template>
  <div
    class="absolute top-16 flex flex-col lg:flex-row items-center justify-start w-full h-[calc(100%-8rem)] md:h-[calc(100%-4rem)]"
    v-if="!isLoading"
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
          class="w-20 h-full absolute right-0 text-neutral-600 dark:text-neutral-400 hover:text-rose-500 transition-all"
        >
          <i class="fa-solid fa-paper-plane text-2xl"></i>
        </button>
      </div>
    </div>
    <div
      class="hidden lg:flex flex-col items-center justify-start w-2/5 max-w-[25rem] h-full overflow-hidden relative box-border bg-slate-300 dark:bg-neutral-800/20 overflow-y-auto"
    >
      <PairAvatar :pair="chatStore.pairInfo" :square="true"></PairAvatar>
      <div class="w-full h-full py-6 px-8">
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
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </p>
      </div>
    </div>
  </div>
  <div
    class="absolute top-16 flex items-center justify-center w-full h-[calc(100%-8rem)] md:h-[calc(100%-4rem)]"
    v-else
  >
    <BasicSpinner></BasicSpinner>
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

onBeforeMount(async () => {
  await chatStore.openChat(route.params.id as string).then(() => {
    isLoading.value = false;
  });
});

onBeforeRouteLeave(() => {
  chatStore.closeChat();
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
</style>
