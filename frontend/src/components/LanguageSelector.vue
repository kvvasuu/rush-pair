<template>
  <ul
    class="min-w-32 flex flex-col items-left text-md bg-slate-200 dark:bg-neutral-800 border-[1px] border-neutral-200 dark:border-neutral-700 rounded-md drop-shadow-sm z-20 overflow-hidden"
    ref="languageSelectorRef"
  >
    <li
      class="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 cursor-pointer transition-all"
      @click="changeLanguage('en')"
    >
      <img
        src="/flag-EN.png"
        alt="ENG"
        class="border-[1px] box-content rounded-sm border-neutral-500 h-4"
      />
      <span>English</span>
    </li>
    <li
      class="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 cursor-pointer transition-all"
      @click="changeLanguage('pl')"
    >
      <img
        src="/flag-PL.png"
        alt="PL"
        class="border-[1px] box-content rounded-sm border-neutral-500 h-4"
      />
      <span>Polski</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { availableLanguages } from "../types";

const emit = defineEmits(["closeSelector", "changeLanguage"]);

const languageSelectorRef = ref<HTMLUListElement | null>(null);

const changeLanguage = (lang: availableLanguages) => {
  emit("closeSelector");
  emit("changeLanguage", lang);
};

const handleClickOutside = (e: Event) => {
  if (
    languageSelectorRef.value &&
    e.target instanceof Node &&
    !languageSelectorRef.value.contains(e.target)
  ) {
    emit("closeSelector");
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("touch", handleClickOutside);
  }
};

onMounted(() => {
  if (languageSelectorRef.value) {
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
});
</script>
