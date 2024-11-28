<template>
  <div
    class="flex-1 h-full w-full flex flex-col lg:flex-col justify-end relative"
  >
    <div
      class="w-full h-full flex items-center justify-center"
      v-if="isLoading"
    >
      <BasicSpinner></BasicSpinner>
    </div>
    <div
      class="absolute bottom-16 w-full h-[calc(100%-4rem)] overflow-y-auto flex flex-col-reverse p-4 gap-1"
      ref="messagesContainer"
    >
      <div
        class="max-w-[80%] rounded-full shadow-sm py-2 px-4"
        :class="[
          message.sender === userStore.id
            ? 'self-end bg-rose-300'
            : 'self-start bg-blue-200',
        ]"
        :title="formatDate(new Date(message.date))"
        v-for="message in messages"
      >
        {{ message.content }}
      </div>
    </div>
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
import { ref, onBeforeUnmount, onBeforeMount } from "vue";
import { useChatStore } from "../../../../stores/chatStore";
import { useUserStore } from "../../../../stores/userStore";
import { io, Socket } from "socket.io-client";
import { Message } from "../../../../types";

import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const chatStore = useChatStore();
const userStore = useUserStore();

const isLoading = ref(true);

const message = ref("");
const messages = ref<Message[]>([]);
const messagesContainer = ref<HTMLDivElement | null>(null);

const currentPage = ref(1);

const roomId = ref("");

const chatSocket = ref<Socket>(io(`${SERVER_URL}/chat`));

chatSocket.value.emit("joinRoom", {
  userId: userStore.id,
  pairId: chatStore.pairInfo.id,
});

chatSocket.value.on("roomJoined", (room) => {
  if (room) {
    roomId.value = room;
  }
});

chatSocket.value.on("getMessage", (message: Message) => {
  if (message) {
    messages.value.unshift(message);
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop =
        messagesContainer.value.scrollHeight + 50;
    }
  }
});

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

const loadMessages = async () => {
  const chatId = [userStore.id, chatStore.pairInfo.id].sort().join("-");
  try {
    const response = await axios.get(
      `${SERVER_URL}/chat/get-messages/${chatId}`,
      {
        headers: { Authorization: `Bearer ${userStore.token}` },
        params: { page: currentPage.value, limit: 30 },
      }
    );

    messages.value = [...response.data, ...messages.value];
    currentPage.value++;
  } catch (error) {
    console.error("Błąd podczas ładowania wiadomości", error);
  }
};

const sendMessage = () => {
  let messageToSend = "";

  !message.value
    ? (messageToSend = "\u2764\uFE0F")
    : (messageToSend = message.value);

  chatSocket.value.emit("sendMessage", {
    roomId: roomId.value,
    content: messageToSend,
    sender: userStore.id,
  });
  message.value = "";
};

onBeforeMount(async () => {
  await loadMessages();
  isLoading.value = false;
});

onBeforeUnmount(() => {
  chatSocket.value.disconnect();
});
</script>
