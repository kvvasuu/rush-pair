<template>
  <div class="w-full h-full flex flex-col bg-slate-300 dark:bg-neutral-800/20">
    <div
      class="w-full py-2 flex items-center justify-center font-semibold text-neutral-500 select-none"
    >
      <p>{{ t("games.gamesInProgress") }}</p>
    </div>
    <div class="flex-1 w-full flex justify-center">
      <div
        class="h-full w-full flex items-center justify-center"
        v-if="isLoading"
      >
        <BasicSpinner></BasicSpinner>
      </div>
      <ul class="w-full" v-else-if="gamesList.length > 0">
        <GamesInProgressListElement
          v-for="game in gamesList"
          :key="game.gameId"
          :game="game"
          @onClick="onClick"
        ></GamesInProgressListElement>
      </ul>
      <div
        class="flex w-full h-full items-center justify-center flex-col gap-6 text-neutral-500 select-none max-w-[666px]"
        v-else
      >
        <p class="text-lg">{{ t("games.noGamesYet") }}</p>
        <i class="fa-solid fa-gamepad text-4xl"></i>
        <p class="text-lg">{{ t("games.startPlaying") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Game } from "../../../types";
import BasicSpinner from "../../../components/BasicSpinner.vue";
import GamesInProgressListElement from "./GamesInProgressListElement.vue";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

defineProps<{
  gamesList: Game[];
  isLoading: boolean;
}>();

const onClick = (game: Game) => {
  router.push(`/app/games/${game.gameName.toLowerCase()}/${game.gameId}`);
};
</script>
