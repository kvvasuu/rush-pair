<template>
  <div class="rounded-full cursor-pointer pair select-none">
    <img
      :src="avatarSrc"
      alt="pair-avatar"
      class="aspect-square min-w-[72px] max-w-[72px] rounded-full border-slate-200 dark:border-neutral-900 border-[2px]"
      draggable="false"
      @error="setDefaultAvatar"
    />
  </div>
</template>

<script setup lang="ts">
import { useAvatar } from "../composables/avatar.ts";
const props = defineProps(["pair"]);

const { setDefaultAvatar, avatarSrc } = useAvatar(props.pair?.imageUrl || "");
</script>
