<template>
  <main class="flex flex-col items-center justify-center">
    <h1 class="text-2xl">Join</h1>

    <div class="flex flex-col items-center justify-center" v-if="!isConnected">
      <input
        class="m-4 rounded-lg p-2"
        type="text"
        v-model="roomId"
        placeholder="room"
      />
      <input
        class="m-4 rounded-lg p-2"
        type="text"
        v-model="userName"
        placeholder="name"
      /><button
        class="px-8 py-4 font-bold text-lg bg-yellow-400 hover:bg-amber-400 border-[1px] border-amber-300 hover:-translate-y-1 rounded-2xl transition-all duration-300 drop-shadow-md"
        @click="joinRoom"
      >
        Join session
      </button>
    </div>
    <div class="flex flex-col items-center justify-center" v-else>
      <input
        class="m-4 rounded-lg p-2"
        type="text"
        v-model="message"
        placeholder="message"
      />
      <button
        class="px-8 py-4 font-bold text-lg bg-yellow-400 hover:bg-amber-400 border-[1px] border-amber-300 hover:-translate-y-1 rounded-2xl transition-all duration-300 drop-shadow-md"
        @click="sendMessage"
      >
        Send message
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { io, Socket } from "socket.io-client";
import { ref, onMounted, watch } from "vue";
import { useMainStore } from "../stores";

const store = useMainStore();

const usersSocket = ref<Socket | null>(null);
const isConnected = ref<boolean>(false);

const roomId = ref<string>("");
const userName = ref<string>("");

const joinRoom = () => {
  if (roomId.value && usersSocket.value) {
    usersSocket.value.emit("joinRoom", roomId.value, userName.value);
  }
};

const message = ref<string>("");
const messages = ref<string[]>([]);

const sendMessage = () => {
  if (roomId.value && message.value && usersSocket.value) {
    usersSocket.value.emit("sendMessageToRoom", {
      roomName: roomId.value,
      message: message.value,
    });
    message.value = "";
  }
};

watch(messages.value, () => {
  console.log(messages.value);
});

onMounted(() => {
  const userId = store.userId;

  usersSocket.value = io("http://localhost:3000/users", {
    query: { userId },
  });

  usersSocket.value.on("message", (msg) => {
    console.log(msg);
    messages.value.push(msg);
  });

  usersSocket.value.on("noRoom", (msg) => {
    console.log(msg);
  });
  usersSocket.value.on("roomJoined", (msg) => {
    console.log(msg);
    isConnected.value = true;
  });

  usersSocket.value.on("roomLeft", (msg) => {
    console.log(msg);
    isConnected.value = false;
  });

  usersSocket.value.on("roomClosed", (msg) => {
    console.log(msg);
    isConnected.value = false;
  });
});
</script>

<style scoped></style>
