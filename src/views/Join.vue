<template>
  <main
    class="flex flex-col items-center justify-center w-full max-w-[640px] m-4"
  >
    <h1 class="text-2xl font-semibold uppercase">Select room</h1>

    <section
      id="roomList"
      class="w-full h-80 rounded-lg shadow-inner bg-gray-200/25 my-8"
      v-if="!isConnected"
    >
      <ul class="w-full h-full snap-y overflow-auto">
        <li
          v-for="room in availableRooms"
          :key="room.roomId"
          class="hover:bg-gray-200/30 cursor-pointer snap-start"
          :class="{
            'bg-gray-100/40': selectedRoom === room.roomId,
          }"
          @click="() => selectRoom(room.roomId)"
        >
          <div class="flex items-center justify-center py-2 px-3">
            <div class="flex grow-0 shrink-0 basis-auto">
              <i
                class="fa-solid fa-users-rectangle text-2xl text-slate-800/90"
              ></i>
            </div>
            <div class="flex grow-0 shrink-0 basis-4/5 ml-4 overflow-hidden">
              <p class="font-semibold uppercase text-sm">{{ room.roomName }}</p>
            </div>
            <div class="flex grow">
              <p class="font-semibold uppercase text-sm text-right w-full">
                {{ room.users }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <div class="flex flex-col items-center justify-center" v-if="!isConnected">
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

const availableRooms = ref<
  { roomId: string; roomName: string; users: number }[]
>([]);
const selectedRoom = ref<string>("");

const userName = ref<string>("");

const selectRoom = (room: string) => {
  selectedRoom.value = room;
};

const joinRoom = () => {
  if (selectedRoom.value && usersSocket.value) {
    usersSocket.value.emit(
      "joinRoom",
      selectedRoom.value,
      userName.value || "Anonym"
    );
    /* clearInterval(refreshInterval); */
  }
};

const leaveRoom = () => {
  if (selectedRoom.value && usersSocket.value) {
    usersSocket.value.emit("leaveRoom", store.roomName);
  }
};

const goBack = () => {
  router.replace("/");
};

let refreshInterval: number;

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
        store.setRoomName(selectedRoom.value);
        break;

      case "left":
        console.log(payload.message);
        isConnected.value = false;
        store.setRoomName("");
        break;

      case "closed":
        console.log(payload.message);
        isConnected.value = false;
        store.setRoomName("");
        break;
    }
  });
  usersSocket.value.emit("getAvailableRooms");

  refreshInterval = window.setInterval(() => {
    if (usersSocket.value) usersSocket.value.emit("getAvailableRooms");
  }, 15000);

  usersSocket.value.on("getAvailableRooms", (rooms) => {
    availableRooms.value = rooms;
    console.log(rooms);
  });
});
</script>
