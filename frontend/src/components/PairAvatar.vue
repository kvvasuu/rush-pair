<template>
  <div class="rounded-full pair select-none">
    <img
      :src="avatarSrc"
      alt="pair-avatar"
      class="aspect-square w-full rounded-full"
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
