<template>
  <div
    class="absolute top-0 pt-24 pb-12 flex flex-col items-center justify-start w-full px-8 h-[calc(100%-4rem)] md:h-full overflow-y-auto overflow-x-hidden"
  >
    <div
      class="w-full max-w-[666px] gap-8 sm:gap-16 flex flex-wrap items-start justify-center"
    >
      <GamesListElement
        name="Quiz"
        :duration="10"
        :prize="1"
      ></GamesListElement>
    </div>
    <p
      class="select-none mt-8 font-semibold text-neutral-400 dark:text-neutral-600"
    >
      {{ t("games.moreGamesSoon") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import GamesListElement from "./GamesListElement.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
