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
      @load="onLoad"
      v-show="isLoaded"
    />
    <div
      class="w-full h-full aspect-square rounded-full bg-stone-100 dark:bg-neutral-800/60 animate-pulse"
      v-if="!isLoaded"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/userStore";
import { useAvatar } from "../composables/avatar";
import { ref } from "vue";

const isLoaded = ref(false);

const onLoad = () => {
  isLoaded.value = true;
};

const userStore = useUserStore();

const { setDefaultAvatar, avatarSrc } = useAvatar(userStore.imageUrl);
</script>
