<template>
  <div
    class="absolute top-16 flex flex-col items-center justify-start w-full h-[calc(100%-8rem)]"
  >
    <Transition name="expand">
      <div
        class="w-full h-80 flex overflow-hidden relative box-border bg-slate-300 dark:bg-neutral-800/20 lg:hidden"
        v-if="props.isProfileExpanded"
      ></div>
    </Transition>
    <div class="flex-1 w-full overflow-y-auto"><p>Chat</p></div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useUserStore } from "../../../stores/userStore";
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps(["isProfileExpanded"]);

const route = useRoute();
const userStore = useUserStore();

const userInfo = ref();

onMounted(async () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  if (userStore.token) {
    try {
      await axios.get(`${SERVER_URL}/user/get-user-info/${route.params.id}`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      });
    } catch (error) {}
  }
});
</script>

<style>
.expand-enter-active {
  animation: expand 0.5s ease;
}

.expand-leave-active {
  animation: expand 0.5s ease reverse;
}

@keyframes expand {
  0% {
    height: 0;
  }
  100% {
    height: 20rem;
  }
}
</style>
