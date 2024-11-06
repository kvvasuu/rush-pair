<template>
  <div
    class="w-full aspect-square h-full overflow-hidden select-none rounded-full flex items-center justify-center"
  >
    <img
      :key="avatarSrc"
      :src="avatarSrc"
      alt="User image"
      draggable="false"
      @error="setDefaultAvatar"
      class="object-cover h-full"
    />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/userStore";
import { useAvatar } from "../composables/avatar";

const userStore = useUserStore();

const { setDefaultAvatar, avatarSrc } = useAvatar(userStore.imageUrl);
</script>
