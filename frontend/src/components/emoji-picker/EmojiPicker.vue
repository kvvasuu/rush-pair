<template>
  <div class="flex items-center justify-center rounded-xl p-2">
    <div
      class="w-full h-full flex flex-wrap items-center justify-center overflow-y-auto"
    >
      <button
        class="w-8 h-8 select-none text-lg cursor-pointer flex items-center justify-center p-0.5 hover:bg-slate-200 rounded-lg"
        v-for="emoji in emojiList"
        @click="selectEmoji"
        :value="emoji"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import emojiList from "./emojiList.json";
const emit = defineEmits(["selectEmoji"]);

const selectEmoji = (event: MouseEvent) => {
  const emojiButton = event.target as HTMLButtonElement;
  emit("selectEmoji", emojiButton.value);
};
</script>

<style scoped></style>
