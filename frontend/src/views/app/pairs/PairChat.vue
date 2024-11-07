<template>
  <div
    class="absolute top-16 flex flex-col items-center justify-start w-full h-[calc(100%-8rem)] overflow-y-auto"
  >
    <Transition name="expand">
      <div
        class="w-full h-60 flex overflow-hidden relative box-border bg-neutral-800/20 lg:hidden"
        v-if="props.isProfileExpanded"
      ></div>
    </Transition>
    <div><p>Chat</p></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "../../../stores/userStore";

const props = defineProps(["isProfileExpanded"]);

const router = useRouter();
const userStore = useUserStore();
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
    height: 15rem;
  }
}
</style>
