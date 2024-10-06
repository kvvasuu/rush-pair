<template>
  <main class="flex flex-col items-center justify-center w-full">
    <h1 class="text-2xl">Select room</h1>

    <section>
      <ul>
        <li v-for="room in availableRooms" :key="room.roomName">
          {{ room.roomName }} {{ room.users }}
        </li>
      </ul>
    </section>

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
      <button
        class="px-8 py-4 font-bold text-lg bg-yellow-400 hover:bg-amber-400 border-[1px] border-amber-300 hover:-translate-y-1 rounded-2xl transition-all duration-300 drop-shadow-md"
        @click="leaveRoom"
      >
        Leave room
      </button>
    </div>

    <button class="absolute bottom-8 left-8" @click="goBack">
      <i
        class="fa-solid fa-circle-arrow-left text-5xl text-gray-100/50 hover:text-gray-100/75 hover:scale-110 transition-all duration-300 drop-shadow-xl"
      ></i>
    </button>
  </main>
</template>

<script setup lang="ts">
import { io, Socket } from "socket.io-client";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useMainStore } from "../stores";
import { useRouter } from "vue-router";

const store = useMainStore();
const router = useRouter();

const usersSocket = ref<Socket | null>(null);
const isConnected = ref<boolean>(false);

const availableRooms = ref<{ roomName: string; users: number }[]>([]);

const roomId = ref<string>("");
const userName = ref<string>("");

let refreshInterval: number;

const goBack = () => {
  router.replace("/");
};

const joinRoom = () => {
  if (roomId.value && usersSocket.value) {
    usersSocket.value.emit("joinRoom", roomId.value, userName.value);
    clearInterval(refreshInterval);
  }
};

const leaveRoom = () => {
  if (roomId.value && usersSocket.value) {
    usersSocket.value.emit("leaveRoom", roomId.value);
  }
};

onBeforeUnmount(() => {
  leaveRoom();
});

onMounted(() => {
  const userId = store.userId;

  usersSocket.value = io("http://localhost:3000/users", {
    query: { userId },
  });

  usersSocket.value.on("rooms", (payload) => {
    switch (payload.action) {
      case "joined":
        console.log(payload.message);
        isConnected.value = true;
        break;

      case "left":
        console.log(payload.message);
        isConnected.value = false;
        break;

      case "closed":
        console.log(payload.message);
        isConnected.value = false;
        break;
    }
  });
  usersSocket.value.emit("getAvailableRooms");

  refreshInterval = window.setInterval(() => {
    if (usersSocket.value) usersSocket.value.emit("getAvailableRooms");
  }, 5000);

  usersSocket.value.on("getAvailableRooms", (rooms) => {
    availableRooms.value = rooms;
    console.log(availableRooms.value);
  });
});
</script>

<style scoped></style>
