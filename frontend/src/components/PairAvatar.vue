<template>
  <div class="select-none rounded-full" :class="{ pair: isLoaded }">
    <div class="relative">
      <img
        :src="avatarSrc"
        :key="avatarSrc"
        alt="pair-avatar"
        class="aspect-square w-full rounded-full"
        :class="{ 'rounded-none': square }"
        draggable="false"
        @error="setDefaultAvatar"
        @load="onLoad"
        v-show="isLoaded"
      />
      <div
        class="absolute rounded-full border-2 border-slate-200 dark:border-neutral-900 bg-lime-500 w-[30%] h-[30%] bottom-0 right-0"
        v-if="isActive && !square"
      ></div>
      <div
        class="w-full h-full aspect-square bg-stone-100 dark:bg-neutral-800/60 animate-pulse"
        :class="{ 'rounded-full': !square }"
        v-if="!isLoaded"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAvatar } from "../composables/avatar.ts";
import { ref } from "vue";
const props = defineProps(["pair", "square", "isActive"]);

const isLoaded = ref(false);

const onLoad = () => {
  isLoaded.value = true;
};

const { setDefaultAvatar, avatarSrc } = useAvatar(
  props.pair?.imageUrl,
  !props.pair?.isVisible
);
</script>
