<template>
  <div class="select-none rounded-full pair">
    <div class="relative">
      <img
        :src="avatarSrc"
        alt="pair-avatar"
        class="aspect-square w-full rounded-full"
        :class="{ 'rounded-none': square }"
        draggable="false"
        @error="setDefaultAvatar"
      />
      <div
        class="absolute rounded-full border-2 border-slate-200 dark:border-neutral-900 bg-lime-500 w-[30%] h-[30%] bottom-0 right-0"
        v-if="isActive && !square"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAvatar } from "../composables/avatar.ts";
const props = defineProps(["pair", "square", "isActive"]);

const { setDefaultAvatar, avatarSrc } = useAvatar(
  props.pair.imageUrl,
  !props.pair.isVisible
);
</script>
