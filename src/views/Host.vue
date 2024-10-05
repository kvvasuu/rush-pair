<template>
  <main class="flex flex-col items-center justify-center">
    <h1 class="text-2xl">Host</h1>

    <div class="flex flex-col items-center justify-center" v-if="!isConnected">
      <input
        class="m-4 rounded-lg p-2"
        type="text"
        v-model="roomId"
        placeholder="room"
      /><button
        class="px-8 py-4 font-bold text-lg bg-yellow-400 hover:bg-amber-400 border-[1px] border-amber-300 hover:-translate-y-1 rounded-2xl transition-all duration-300 drop-shadow-md"
        @click="createRoom"
      >
        Create room
      </button>
    </div>
    <div class="flex flex-col items-center justify-center" v-else>
      <button
        class="px-8 py-4 font-bold text-lg bg-yellow-400 hover:bg-amber-400 border-[1px] border-amber-300 hover:-translate-y-1 rounded-2xl transition-all duration-300 drop-shadow-md"
        @click="closeRoom"
      >
        Close room
      </button>
      Room {{ roomId }} created
    </div>
  </main>
</template>

<script setup lang="ts">
import { io, Socket } from "socket.io-client";
import { ref, onMounted, onBeforeUnmount } from "vue";

const socket = ref<Socket | null>(null);
const isConnected = ref<boolean>(false);

const roomId = ref<string>("");

const createRoom = () => {
  if (roomId.value && socket.value) {
    socket.value.emit("createRoom", roomId.value);
  }
};

const closeRoom = () => {
  if (roomId.value && socket.value) {
    socket.value.emit("closeRoom", roomId.value);
  }
};

onMounted(() => {
  socket.value = io("http://localhost:3000");

  socket.value.on("message", (msg) => {
    console.log(msg);
  });

  socket.value.on("roomExists", (msg) => {
    console.log(msg);
  });

  socket.value.on("roomCreated", (msg) => {
    console.log(msg);
    isConnected.value = true;
  });

  socket.value.on("roomClosed", (msg) => {
    console.log(msg);
    isConnected.value = false;
  });
});

onBeforeUnmount(() => {
  closeRoom();
});
</script>

<style scoped></style>
