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
  </main>
</template>

<script setup lang="ts">
import { useAdminStore } from "../stores/adminStore";
import { io, Socket } from "socket.io-client";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Player } from "../types";

const store = useAdminStore();

const socketAdmin = ref<Socket | null>(null);
const isConnected = ref<boolean>(false);

const roomId = ref<string>("");

const players = computed(() => store.getPlayersInRoom);

const createRoom = () => {
  if (roomId.value && socketAdmin.value) {
    socketAdmin.value.emit("createRoom", roomId.value);
  }
};

const closeRoom = () => {
  if (roomId.value && socketAdmin.value) {
    socketAdmin.value.emit("closeRoom", roomId.value);
  }
};

const addPlayer = (player: Player) => {
  store.addPlayer(player);
};

onMounted(() => {
  socketAdmin.value = io("http://localhost:3000/admin");

  socketAdmin.value.on("message", (msg) => {
    console.log(msg);
  });

  socketAdmin.value.on("roomExists", (msg) => {
    console.log(msg);
  });

  socketAdmin.value.on("roomCreated", (msg) => {
    console.log(msg);
    isConnected.value = true;
  });

  socketAdmin.value.on("roomClosed", (msg) => {
    console.log(msg);
    isConnected.value = false;
  });

  socketAdmin.value.on("userJoined", (player) => {
    console.log(player);
    addPlayer(player);
  });
});

onBeforeUnmount(() => {
  closeRoom();
});
</script>

<style scoped></style>
