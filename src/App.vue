<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useMainStore } from "./stores";
import axios from "axios";

const store = useMainStore();

const connectToServer = async () => {
  let res;
  try {
    res = await axios.get("http://localhost:3000/get-user-id");
    return res.data.userId;
  } catch (error) {
    store.setConnectionState(false);
    console.error(error);
  }
};

const checkServerConnection = async () => {
  try {
    const response = await axios.get("http://localhost:3000/status");
    if (response.status === 200) {
      store.setConnectionState(true);
    }
  } catch (error) {
    store.setConnectionState(false);
    console.error("Unable to connect:", error);
  }
};

onMounted(async () => {
  await checkServerConnection();

  let storedUserID = localStorage.getItem("userID");

  if (!storedUserID) {
    storedUserID = await connectToServer();
  }

  if (storedUserID && store.isConnected) {
    store.setUserId(storedUserID);
    localStorage.setItem("userID", storedUserID);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
