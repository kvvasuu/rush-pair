<template>
  <div
    class="flex flex-col items-start justify-center rounded-xl p-2"
    ref="pickerSelector"
  >
    <div
      class="w-full h-full flex items-center justify-center"
      v-if="isLoading"
    >
      <BasicSpinner></BasicSpinner>
    </div>
    <div class="w-full relative h-8" v-else>
      <input
        type="text"
        placeholder="Search for emoji"
        class="w-full p-1 pl-8 rounded-lg outline-none bg-neutral-50 dark:bg-neutral-800/80 text-neutral-600 placeholder-neutral-300 dark:text-neutral-400 dark:placeholder-neutral-700"
      />
      <i
        class="fa-solid fa-magnifying-glass absolute h-8 top-0 left-2 flex items-center text-neutral-300"
      ></i>
    </div>
    <div
      class="mt-1 w-full h-full flex flex-wrap items-center justify-center overflow-y-auto"
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
import { onMounted, onBeforeUnmount, ref } from "vue";
import BasicSpinner from "../BasicSpinner.vue";

const emit = defineEmits(["selectEmoji", "close"]);

const isLoading = ref(true);

const emojiList = ref([]);

const pickerSelector = ref<HTMLElement | null>(null);

const selectEmoji = (event: MouseEvent) => {
  const emojiButton = event.target as HTMLButtonElement;
  emit("selectEmoji", emojiButton.value);
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    pickerSelector.value &&
    !pickerSelector.value.contains(event.target as Node)
  ) {
    emit("close");
  }
};

onMounted(async () => {
  await fetch("/emojiList.json")
    .then((response) => response.json())
    .then((data) => {
      isLoading.value = false;
      emojiList.value = data;
    });
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
::-webkit-scrollbar-track {
  background: #ececec;
  border-radius: 4px;
}

::-webkit-scrollbar-track:hover {
  background: #d1d1d1;
}
</style>
