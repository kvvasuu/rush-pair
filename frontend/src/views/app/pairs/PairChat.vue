<template>
  <div
    class="absolute top-16 flex flex-col items-center justify-start max-w-[666px] w-full h-[calc(100%-8rem)] py-12 overflow-y-auto"
  >
    <div><p>Chat</p></div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "../../../stores/userStore";

const router = useRouter();
const userStore = useUserStore();
</script>
