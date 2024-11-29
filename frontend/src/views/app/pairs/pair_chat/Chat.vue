<template>
  <div
    class="flex-1 h-full w-full flex flex-col lg:flex-col justify-end relative"
  >
    <div
      class="w-full h-full flex items-center justify-center"
      v-if="isLoading && !chatStore.roomId"
    >
      <BasicSpinner></BasicSpinner>
    </div>
    <div
      class="absolute bottom-16 w-full h-[calc(100%-4rem)] overflow-y-auto overflow-x-hidden flex flex-col-reverse px-1 md:px-4 pb-4 pt-6 gap-1"
      ref="messagesContainer"
      v-else
    >
      <TransitionGroup name="list">
        <div
          v-for="message in chatStore.messages"
          class="max-w-[85%] flex items-end justify-start"
          :key="message.date"
          :class="[message.sender === userStore.id ? 'self-end' : 'self-start']"
        >
          <PairAvatar
            :pair="chatStore.pairInfo"
            class="w-8 h-8 mr-2 shrink-0"
            :title="chatStore.pairInfo.name"
            v-if="message.sender !== userStore.id"
          ></PairAvatar>
          <div
            class="rounded-3xl shadow-sm py-2 px-4 dark:text-neutral-200"
            :class="[
              message.sender === userStore.id
                ? 'bg-rose-300 dark:bg-rose-500/20'
                : 'bg-blue-200 dark:bg-blue-600/20',
            ]"
            :title="formatDate(new Date(message.date))"
          >
            {{ message.content }}
          </div>
        </div>
      </TransitionGroup>
    </div>
    <Transition name="fade">
      <button
        class="absolute bottom-20 left-[calc(50%-2rem)] w-16 h-16 flex items-center justify-center text-rose-500/60 hover:text-rose-500 transition-all drop-shadow-2xl"
        v-if="showScrollButton"
        @click="scrollToBottom"
      >
        <p v-if="!!newMessagesCount" class="absolute -top-6 w-96 font-semibold">
          You have {{ newMessagesCount }} new messages
        </p>
        <i class="fa-solid fa-circle-chevron-down text-[3rem]"></i>
      </button>
    </Transition>

    <div class="w-full h-16 absolute">
      <input
        name="message"
        id="message"
        v-model="message"
        type="text"
        class="w-full h-full m-0 outline-none p-2 pl-4 pr-14 text-2xl bg-neutral-50 hover:bg-neutral-100/90 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/50 text-neutral-600 placeholder-neutral-300 dark:text-neutral-400 dark:placeholder-neutral-700 transition-all shadow z-30"
        placeholder="Type a message"
        autocomplete="off"
        spellcheck="false"
        @keydown.enter="sendMessage"
      /><button
        class="w-20 h-full absolute right-0 text-rose-500 hover:text-rose-600 transition-all duration-300 text-2xl hover:text-3xl"
        :title="message ? `Send message` : `Send heart`"
        @click="sendMessage"
      >
        <Transition name="pop-up-fast" mode="out-in">
          <i class="fa-solid fa-paper-plane" v-if="message"></i>
          <i class="fa-solid fa-heart" v-else></i>
        </Transition>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasicSpinner from "../../../../components/BasicSpinner.vue";
import {
  ref,
  onBeforeUnmount,
  onBeforeMount,
  onMounted,
  watch,
  nextTick,
} from "vue";
import { useChatStore } from "../../../../stores/chatStore";
import { useUserStore } from "../../../../stores/userStore";
import PairAvatar from "../../../../components/PairAvatar.vue";

const chatStore = useChatStore();
const userStore = useUserStore();

const isLoading = ref(true);

const message = ref("");
const messagesContainer = ref<HTMLDivElement | null>(null);

const sendMessage = async () => {
  await chatStore.sendMessage(message.value);
  message.value = "";
};

const formatDate = (date: Date) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const showScrollButton = ref(false);
const newMessagesCount = ref(0);

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};

const onScroll = async () => {
  if (messagesContainer.value && !chatStore.isLoading) {
    if (
      Math.abs(messagesContainer.value.scrollTop) +
        messagesContainer.value.clientHeight >=
      messagesContainer.value.scrollHeight - 30
    ) {
      const oldScrollHeight = messagesContainer.value.scrollTop;
      const result = await chatStore.loadMessages();

      nextTick(() => {
        if (messagesContainer.value && result) {
          messagesContainer.value.scrollTop = oldScrollHeight;
        }
      });
    }

    if (Math.abs(messagesContainer.value.scrollTop) < 50)
      newMessagesCount.value = 0;

    Math.abs(messagesContainer.value.scrollTop) > 100
      ? (showScrollButton.value = true)
      : (showScrollButton.value = false);
  }
};

watch(
  () => chatStore.newMessage,
  (newMessage) => {
    if (messagesContainer.value) {
      if (newMessage?.sender === userStore.id) {
        messagesContainer.value.scrollTop =
          messagesContainer.value.scrollHeight + 50;
      } else {
        newMessagesCount.value++;
      }
    }
  },
  { deep: true }
);

onBeforeMount(async () => {
  if (!chatStore.connected) {
    chatStore.connectToSocket();
  }
  isLoading.value = false;
});

onMounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener("scroll", onScroll);
  }
}),
  onBeforeUnmount(() => {
    chatStore.disconnectFromSocket();
    messagesContainer.value?.removeEventListener("scroll", onScroll);
  });
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
