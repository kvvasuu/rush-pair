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
    res = await axios.get("http://localhost:3000");
    store.setConnectionState(true);
    store.setUserId(res.data.userId);
    console.log(res.data.message);
    return res.data;
  } catch (error) {
    store.setConnectionState(false);
    console.error(error);
  }
};

onMounted(async () => {
  await connectToServer();
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
