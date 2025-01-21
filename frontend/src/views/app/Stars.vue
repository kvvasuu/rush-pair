<template>
  <main
    class="flex flex-col items-center justify-center w-full h-full relative select-none text-neutral-400 dark:text-neutral-600"
  >
    <h1 class="text-4xl font-semibold">{{ t("general.stars") }}</h1>
    <p>{{ t("general.workInProgress") }}</p>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
