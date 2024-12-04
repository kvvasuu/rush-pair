<template>
  <div
    class="flex flex-col items-start justify-center rounded-xl p-2"
    ref="pickerSelectorRef"
  >
    <div class="w-full relative h-8" v-if="!isLoading">
      <input
        type="text"
        placeholder="Search for emoji"
        class="w-full p-1 pl-8 rounded-lg outline-none bg-neutral-50 dark:bg-neutral-800/80 text-neutral-600 placeholder-neutral-300 dark:text-neutral-400 dark:placeholder-neutral-700"
        v-model="searchValue"
        @keyup="search"
      />
      <i
        class="fa-solid fa-magnifying-glass absolute h-8 top-0 left-2 flex items-center text-neutral-300"
      ></i>
    </div>
    <div
      class="w-full h-full flex items-center justify-center"
      v-if="isLoading"
    >
      <BasicSpinner></BasicSpinner>
    </div>
    <div class="mt-1 w-full h-full overflow-y-auto overflow-x-hidden" v-else>
      <div class="w-full flex flex-col" v-if="searchResult?.length === 0">
        <div
          class="w-full flex flex-col mt-1"
          v-for="(group, key) in emojiList"
          ref="categoriesRef"
        >
          <span
            class="px-1 mb-0.5 text-xs w-full select-none text-neutral-500"
            >{{ key }}</span
          >
          <div class="w-full grid grid-cols-9 auto-rows-min">
            <button
              class="w-8 h-8 select-none text-xl cursor-pointer flex items-center justify-center m-0 p-0.5 shrink-0 grow-0 hover:bg-slate-200 rounded-lg"
              v-for="emoji in group"
              @click="selectEmoji"
              :value="emoji.emoji"
              :title="emoji.name"
            >
              {{ emoji.emoji }}
            </button>
          </div>
        </div>
      </div>

      <div
        class="w-full grid grid-cols-9 auto-rows-min"
        v-else
        id="searchResult"
      >
        <button
          class="w-8 h-8 select-none text-xl cursor-pointer flex items-center justify-center m-0 p-0.5 shrink-0 grow-0 hover:bg-slate-200 rounded-lg"
          v-for="emoji in searchResult"
          @click="selectEmoji"
          :value="emoji.emoji"
          :title="emoji.name"
        >
          {{ emoji.emoji }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import BasicSpinner from "./BasicSpinner.vue";
import type { Emoji } from "../types";

const emit = defineEmits(["selectEmoji", "close"]);

const isLoading = ref(true);

let emojis: Record<string, Emoji[]> = {};

const emojiList = ref<Record<string, Emoji[]>>({});

const pickerSelectorRef = ref<HTMLElement | null>(null);
const categoriesRef = ref<HTMLElement | null>(null);

const selectEmoji = (event: MouseEvent) => {
  const emojiButton = event.target as HTMLButtonElement;
  emit("selectEmoji", emojiButton.value);
};

const searchValue = ref("");
const searchResult = ref<Emoji[]>([]);
const search = () => {
  if (searchValue.value.length > 1) {
    const lowerCaseQuery = searchValue.value.toLowerCase();
    if (searchValue.value.length >= 2) {
      searchResult.value = Object.values(emojis)
        .flat()
        .filter((emoji) => emoji.name.toLowerCase().includes(lowerCaseQuery));
    }
  } else {
    searchResult.value = [];
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    pickerSelectorRef.value &&
    !pickerSelectorRef.value.contains(event.target as Node)
  ) {
    emit("close");
  }
};

onMounted(async () => {
  await fetch("/emojiList.json")
    .then((response) => response.json())
    .then((data) => {
      isLoading.value = false;
      emojis = data;
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
