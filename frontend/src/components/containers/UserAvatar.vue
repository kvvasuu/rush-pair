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
import avatar from "../../assets/images/avatar-placeholder.png";
import { computed, ref } from "vue";
import { useAuthStore } from "../../stores/authStore";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const authStore = useAuthStore();

const isError = ref(false);

const setDefaultAvatar = () => {
  isError.value = true;
};

const avatarSrc = computed(() => {
  return isError.value
    ? avatar
    : `${SERVER_URL}/uploads/${authStore.imageUrl}?token=${
        authStore.token
      }&time=${Date.now()}` || avatar;
});
</script>
