<template>
  <div
    class="absolute top-16 pb-8 flex flex-col md:flex-row-reverse w-full h-[calc(100%-6rem)] md:h-[calc(100%-2rem)]"
  >
    <div
      class="flex flex-col items-center shrink-0 justify-start w-full md:w-2/5 md:max-w-[25rem] md:h-full h-1/2"
    >
      <GamesInProgressList
        :gamesList="games"
        :isLoading="isLoading"
      ></GamesInProgressList>
    </div>
    <div
      class="flex flex-col items-center justify-start flex-0 md:flex-1 md:h-full px-8 pt-12 pb-12 overflow-y-auto overflow-x-hidden"
    >
      <div
        class="w-full max-w-[666px] gap-8 sm:gap-16 flex flex-wrap items-start justify-center"
      >
        <GamesListElement
          name="quiz"
          :duration="10"
          :prize="1"
          :gamesList="games"
        ></GamesListElement>
      </div>
      <p
        class="select-none mt-8 font-semibold text-neutral-400 dark:text-neutral-600"
      >
        {{ t("games.moreGamesSoon") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import GamesListElement from "./GamesListElement.vue";
import { useI18n } from "vue-i18n";
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import type { Game } from "../../../types";
import { useUserStore } from "../../../stores/userStore";
import GamesInProgressList from "./GamesInProgressList.vue";

const { t } = useI18n();

const userStore = useUserStore();

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const isLoading = ref(true);
const games = ref<Game[]>([]);

const getGames = async () => {
  try {
    const gamesData = await axios.get(`${SERVER_URL}/games/${userStore.id}`);
    games.value = gamesData.data.sort((a: Game, b: Game) => {
      const statusSort =
        Number(a.status === "finished") - Number(b.status === "finished");
      if (statusSort !== 0) return statusSort;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

onBeforeMount(async () => {
  await getGames();
});
</script>
