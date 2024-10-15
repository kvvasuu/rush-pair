<template>
  <div
    class="absolute top-16 flex flex-col items-center justify-start max-w-[666px] w-full h-[calc(100%-8rem)] py-12"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="h-24 relative cursor-pointer group">
        <UserAvatar></UserAvatar>
        <div
          class="bg-amber-400 rounded-full h-8 w-8 bottom-0 right-0 absolute flex items-center justify-center group-hover:bg-yellow-400 transition-all"
        >
          <i class="fa-solid fa-pencil"></i>
        </div>
      </div>

      <p class="text-neutral-300 font-semibold text-2xl mt-6 select-none">
        {{ authStore.name }}
      </p>
      <p class="text-neutral-500 text-sm select-none">
        {{ authStore.email }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from "../../../components/containers/UserAvatar.vue";
import { useAuthStore } from "../../../stores/authStore";

const authStore = useAuthStore();
</script>
