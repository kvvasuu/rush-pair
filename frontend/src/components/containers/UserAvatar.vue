<template>
  <div
    class="w-full h-full overflow-hidden select-none rounded-full flex items-center justify-center"
  >
    <img
      :src="passPhotoUrl"
      alt="User image"
      draggable="false"
      class="object-cover h-full"
    />
  </div>
</template>

<script setup lang="ts">
import avatar from "../../assets/images/avatar-placeholder.png";
import { computed } from "vue";
import { useAuthStore } from "../../stores/authStore";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const authStore = useAuthStore();

const passPhotoUrl = computed(
  () => `${SERVER_URL}/${authStore.imageUrl}.png` || avatar
);
</script>
