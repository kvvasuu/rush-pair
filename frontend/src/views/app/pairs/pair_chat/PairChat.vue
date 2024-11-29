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
      <Chat v-if="!isProfileExpandedMobile"></Chat>
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
import Chat from "./Chat.vue";

const props = defineProps(["isProfileExpanded"]);
const route = useRoute();
const chatStore = useChatStore();

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
