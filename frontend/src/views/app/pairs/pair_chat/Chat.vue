<template>
  <div class="flex-1 lg:h-full w-full flex flex-col lg:flex-col justify-end">
    <div class="w-full flex-1 overflow-y-auto flex items-center justify-center">
      Chat
    </div>
    <div class="w-full h-16 relative">
      <input
        name="message"
        id="message"
        v-model="message"
        type="text"
        class="w-full h-full m-0 outline-none p-2 pl-4 pr-14 text-2xl bg-neutral-50 hover:bg-neutral-100/90 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/50 text-neutral-600 placeholder-neutral-300 dark:text-neutral-400 dark:placeholder-neutral-700 transition-all shadow z-30"
        placeholder="Type a message"
        autocomplete="off"
        spellcheck="false"
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
import { ref } from "vue";
import { useChatStore } from "../../../../stores/chatStore";
import { useUserStore } from "../../../../stores/userStore";
import { io, Socket } from "socket.io-client";
import { Message } from "../../../../types";

const chatStore = useChatStore();
const userStore = useUserStore();

const message = ref("");
const userMessages = ref<Message[] | []>([]);
const pairMessages = ref<Message[] | []>([]);

const roomId = ref("");

const chatSocket = ref<Socket>(io("http://localhost:3000/chat"));

chatSocket.value.emit("joinRoom", {
  userId: userStore.id,
  contactId: chatStore.pairInfo.id,
});

chatSocket.value.on("roomJoined", (room) => {
  if (room) {
    roomId.value = room;
  }
});

chatSocket.value.on("getMessage", (message) => {
  if (message) {
    console.log(message);
  }
});

const sendMessage = () => {
  let messageToSend = "";

  !message.value
    ? (messageToSend = "\u2764\uFE0F")
    : (messageToSend = message.value);

  chatSocket.value.emit("sendMessage", {
    roomId: roomId.value,
    message: messageToSend,
    sender: userStore.id,
  });
  message.value = "";
};
</script>
