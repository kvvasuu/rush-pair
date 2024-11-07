<template>
  <div
    class="absolute top-16 flex flex-col lg:flex-row items-center justify-start w-full h-[calc(100%-8rem)] md:h-[calc(100%-4rem)]"
  >
    <Transition name="expand">
      <div
        class="w-full h-80 flex overflow-hidden relative box-border bg-slate-300 dark:bg-neutral-800/20 lg:hidden"
        v-if="props.isProfileExpanded"
      ></div>
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
        /><button
          class="w-20 h-full absolute right-0 text-neutral-600 dark:text-neutral-400 hover:text-rose-500 transition-all"
        >
          <i class="fa-solid fa-paper-plane text-2xl"></i>
        </button>
      </div>
    </div>
    <div
      class="hidden lg:flex flex-col items-center justify-start w-2/5 max-w-[25rem] h-full overflow-hidden relative box-border bg-slate-300 dark:bg-neutral-800/20"
    >
      <PairAvatar :pair="chatStore.pairInfo" :square="true"></PairAvatar>
      <div class="p-8"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import PairAvatar from "../../../components/PairAvatar.vue";
import { useChatStore } from "../../../stores/chatStore";
import { onBeforeRouteLeave, useRoute } from "vue-router";

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
