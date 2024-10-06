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
      <div class="mb-4">
        <ul>
          <li v-for="player in players">
            <span>{{ player.name || "user" }}{{ player.userId }}</span>
          </li>
        </ul>
      </div>
      <button
        class="px-8 py-4 font-bold text-lg bg-yellow-400 hover:bg-amber-400 border-[1px] border-amber-300 hover:-translate-y-1 rounded-2xl transition-all duration-300 drop-shadow-md"
        @click="closeRoom"
      >
        Close room
      </button>
      Room {{ roomId }} created
    </div>
    <button class="absolute bottom-8 left-8" @click="goBack">
      <i
        class="fa-solid fa-circle-arrow-left text-5xl text-gray-100/50 hover:text-gray-100/75 hover:scale-110 transition-all duration-300 drop-shadow-xl"
      ></i>
    </button>
  </main>
</template>

<script setup lang="ts">
import { useAdminStore } from "../stores/adminStore";
import { useMainStore } from "../stores";
import { io, Socket } from "socket.io-client";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const adminStore = useAdminStore();
const store = useMainStore();
const router = useRouter();

const socketAdmin = ref<Socket | null>(null);
const isConnected = ref<boolean>(false);

const goBack = () => {
  router.replace("/");
};

const roomId = ref<string>("");

const players = computed(() => adminStore.getPlayersInRoom);

const createRoom = () => {
  if (roomId.value && socketAdmin.value) {
    socketAdmin.value.emit("createRoom", roomId.value);
  }
};

const closeRoom = () => {
  if (roomId.value && socketAdmin.value) {
    socketAdmin.value.emit("closeRoom", roomId.value);
  }
  adminStore.closeRoom();
};
onMounted(() => {
  const userId = store.userId;

  socketAdmin.value = io("http://localhost:3000/admin", {
    query: { userId },
  });

  socketAdmin.value.on("message", (msg) => {
    console.log(msg);
  });

  socketAdmin.value.on("rooms", (payload) => {
    switch (payload.action) {
      case "exists":
        console.log(payload.message);
        break;
      case "created":
        console.log(payload.message);
        isConnected.value = true;
        break;
      case "closed":
        console.log(payload.message);
        isConnected.value = false;
        break;
    }
  });

  socketAdmin.value.on("users", (payload) => {
    switch (payload.action) {
      case "joined":
        console.log(payload.message);
        adminStore.addPlayer(payload.user);
        break;
      case "left":
        console.log(payload.message);
        adminStore.removePlayer(payload.user.userId);
        break;
    }
  });
});

onBeforeUnmount(() => {
  closeRoom();
});
</script>

<style scoped></style>
