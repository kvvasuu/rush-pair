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
    <PairChatSettingTop
      :is-profile-expanded="props.isProfileExpanded"
    ></PairChatSettingTop>
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
            class="w-full h-full m-0 outline-none p-2 pl-4 pr-14 text-2xl bg-neutral-50 hover:bg-neutral-100/90 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/50 text-neutral-600 dark:text-neutral-400 transition-all shadow z-30"
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
    <PairChatSettingsSide></PairChatSettingsSide>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { useChatStore } from "../../../../stores/chatStore";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import BasicSpinner from "../../../../components/BasicSpinner.vue";
import PairChatSettingsSide from "./PairChatSettingsSide.vue";
import PairChatSettingTop from "./PairChatSettingTop.vue";

const props = defineProps(["isProfileExpanded"]);
const route = useRoute();
const chatStore = useChatStore();

const message = ref("");

const isLoading = ref(true);

const cannotGetPair = ref(false);

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

<style scoped>
input {
  border-radius: 0;
}

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
</style>
