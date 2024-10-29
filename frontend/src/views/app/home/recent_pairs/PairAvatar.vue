<template>
  <div
    class="aspect-square rounded-full cursor-pointer pair w-1/5 min-w-[72px] select-none"
  >
    <img
      :src="avatarSrc"
      alt="Pair image"
      class="w-full h-full rounded-full border-slate-200 dark:border-neutral-900 border-[2px]"
      draggable="false"
      @error="setDefaultAvatar"
    />
  </div>
</template>

<script setup lang="ts">
import { useAvatar } from "../../../../composables/avatar.ts";
const props = defineProps(["pair"]);

const { setDefaultAvatar, avatarSrc } = useAvatar(props.pair);
</script>
