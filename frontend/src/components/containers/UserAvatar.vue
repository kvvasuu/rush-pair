<template>
  <div class="w-full h-full overflow-hidden select-none rounded-full">
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

const authStore = useAuthStore();

const passPhotoUrl = computed(() => authStore.imageUrl || avatar);
</script>
