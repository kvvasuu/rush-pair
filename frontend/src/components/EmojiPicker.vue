<template>
  <div
    class="flex flex-col items-start justify-start rounded-xl p-2 bg-slate-100 dark:bg-zinc-900"
    ref="pickerSelectorRef"
  >
    <div class="w-full relative h-8" v-if="!isLoading">
      <input
        type="text"
        :placeholder="t('general.searchForEmoji')"
        class="w-full p-1 pl-8 rounded-lg outline-none bg-neutral-50 dark:bg-neutral-800/80 text-neutral-600 placeholder-neutral-300 dark:text-neutral-400 dark:placeholder-neutral-700"
        v-model="searchValue"
        @keyup="search"
      />
      <i
        class="fa-solid fa-magnifying-glass absolute h-8 top-0 left-2 flex items-center text-neutral-300 dark:text-neutral-600"
      ></i>
    </div>
    <div
      class="w-full h-full flex items-center justify-center"
      v-if="isLoading"
    >
      <BasicSpinner></BasicSpinner>
    </div>
    <div
      class="mt-1 w-full h-52 overflow-y-auto overflow-x-hidden"
      :class="{ 'h-[15.75rem]': searchResult?.length > 0 }"
      ref="emojiListRef"
      v-else
    >
      <div
        class="w-full flex flex-col"
        v-if="searchResult?.length === 0 && searchValue.length < 2"
      >
        <div
          class="w-full flex flex-col mt-1"
          v-for="(group, key, index) in emojiList"
          :key="key"
          ref="categoriesRef"
          :id="`emoji-picker-category-${index}`"
        >
          <span
            class="px-1 mb-0.5 text-xs w-full select-none text-neutral-500"
            >{{ t("general.emojiCategories." + key) }}</span
          >
          <div class="w-full grid grid-cols-9 auto-rows-min">
            <button
              class="w-8 h-8 select-none text-xl cursor-pointer flex items-center justify-center m-0 p-0.5 shrink-0 grow-0 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg"
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
          class="w-8 h-8 select-none text-xl cursor-pointer flex items-center justify-center m-0 p-0.5 shrink-0 grow-0 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg"
          v-for="emoji in searchResult"
          @click="selectEmoji"
          :value="emoji.emoji"
          :title="emoji.name"
        >
          {{ emoji.emoji }}
        </button>
      </div>
    </div>
    <div
      class="w-full h-8 mt-2 grid grid-cols-9 text-lg"
      v-if="!isLoading && searchResult?.length === 0 && searchValue.length < 2"
      ref="categoriesButtonsRef"
    >
      <button
        v-for="(category, index) in categoriesList"
        class="select-none text-xl cursor-pointer flex items-center justify-center m-0 p-0.5 shrink-0 grow-0 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg"
        :class="[
          activeCategory === index
            ? 'text-blue-500 dark:text-blue-600'
            : 'text-neutral-500 dark:text-neutral-600',
        ]"
        @click="scrollToCategory(index)"
        :title="t('general.emojiCategories.' + category.name)"
      >
        <i :class="category.icon"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import BasicSpinner from "./BasicSpinner.vue";
import type { Emoji } from "../types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["selectEmoji", "close"]);

const isLoading = ref(true);

let emojis: Record<string, Emoji[]> = {};

const emojiList = ref<Record<string, Emoji[]>>({});

const pickerSelectorRef = ref<HTMLElement | null>(null);

const categoriesRef = ref<HTMLElement[] | null>(null);
const categoriesButtonsRef = ref<HTMLElement[] | null>(null);
const activeCategory = ref(0);
const categoriesList = [
  {
    name: "smileysAndEmotion",
    icon: "fa-solid fa-face-smile-beam",
  },
  {
    name: "peopleAndBody",
    icon: "fa-solid fa-child",
  },
  {
    name: "animalsAndNature",
    icon: "fa-solid fa-horse",
  },
  {
    name: "foodAndDrink",
    icon: "fa-solid fa-utensils",
  },
  {
    name: "travelAndPlaces",
    icon: "fa-solid fa-earth-americas",
  },
  {
    name: "activities",
    icon: "fa-solid fa-basketball",
  },
  {
    name: "objects",
    icon: "fa-solid fa-lightbulb",
  },
  {
    name: "symbols",
    icon: "fa-solid fa-question",
  },
  {
    name: "flags",
    icon: "fa-solid fa-flag",
  },
];
const scrollToCategory = (categoryIndex: number) => {
  if (categoriesRef.value) {
    categoriesRef.value[categoryIndex].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

const emojiListRef = ref<HTMLElement | null>(null);
const observeElement = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      activeCategory.value = parseInt(
        entry.target.id.replace("emoji-picker-category-", "")
      );
    }
  });
};
let observer: IntersectionObserver | null = null;

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

  initializeObserver();
});

const initializeObserver = () => {
  if (emojiListRef.value && categoriesRef.value) {
    observer = new IntersectionObserver(observeElement, {
      root: emojiListRef.value,
      threshold: 0.01,
    });
    categoriesRef.value.forEach((div) => observer?.observe(div));
  }
};

const cleanupObserver = () => {
  observer?.disconnect();
  observer = null;
};

watch(categoriesButtonsRef, (newVal) => {
  if (newVal) {
    initializeObserver();
  } else {
    cleanupObserver();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  cleanupObserver();
});
</script>

<style scoped>
::-webkit-scrollbar-track {
  background: #ececec11;
  border-radius: 4px;
}

::-webkit-scrollbar-track:hover {
  background: #d1d1d122;
}
</style>
