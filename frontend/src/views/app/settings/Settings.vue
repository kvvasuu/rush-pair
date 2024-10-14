<template>
  <div
    class="absolute top-16 flex flex-col items-center justify-start max-w-[666px] w-full h-[calc(100%-4rem)] py-12"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="h-24"><UserAvatar></UserAvatar></div>

      <p class="text-neutral-300 font-semibold text-2xl mt-6 select-none">
        {{ authStore.name }}
      </p>
      <p class="text-neutral-500 text-sm select-none">
        {{ authStore.email }}
      </p>
    </div>
    <ol>
      <li class="w-full p-4">
        <RouterLink
          to="/app/settings/profile"
          class="text-neutral-500 hover:text-neutral-300 transition-all"
        >
          Profile
        </RouterLink>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from "../../../components/containers/UserAvatar.vue";
import { useAuthStore } from "../../../stores/authStore";
const authStore = useAuthStore();
</script>
