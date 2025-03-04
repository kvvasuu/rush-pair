<template>
  <div
    class="absolute top-0 pt-24 pb-12 flex flex-col items-center justify-start w-full px-8 h-[calc(100%-4rem)] md:h-full overflow-y-auto overflow-x-hidden bg-main-gradient dark:bg-main-gradient-dark"
  >
    <Transition name="fade" mode="out-in">
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center h-full w-full"
      >
        <BasicSpinner
          :color="
            userStore.settings.theme === 'dark'
              ? 'fill-neutral-700'
              : 'fill-neutral-100'
          "
        ></BasicSpinner>
      </div>
      <div
        v-else-if="!gameStore.gameData?.questions"
        class="flex flex-col items-center justify-center gap-4 h-full w-full"
      >
        <i
          class="fa-solid fa-triangle-exclamation text-neutral-200 dark:text-neutral-800 select-none text-5xl"
        ></i>
        <p
          class="text-neutral-200 dark:text-neutral-800 select-none text-center"
        >
          {{ t("general.somethingWentWrong") }}
        </p>
      </div>
      <div
        class="flex flex-col items-center h-full w-full"
        v-else-if="
          gameStore.status === 'inProgress' &&
          gameStore.gameData?.questions &&
          answeredQuestionsNumber < 5
        "
        :key="'question' + answeredQuestionsNumber"
      >
        <p
          class="text-neutral-200 dark:text-neutral-800 font-semibold select-none"
        >
          {{ t(`games.quiz.question`) }} {{ answeredQuestionsNumber + 1 }}/5
        </p>
        <div class="p-4 text-[5rem] select-none drop-shadow">
          {{ getEmoji(activeQuestion) }}
        </div>

        <p
          class="text-neutral-100 dark:text-neutral-800 font-bold select-none text-xl text-center"
        >
          {{ t(`games.quiz.questions.${activeQuestion}.question`) }}
        </p>
        <ul class="flex items-center justify-center gap-4 flex-wrap mt-10">
          <button
            v-for="option in gameStore.gameData?.questions[
              answeredQuestionsNumber
            ]?.options"
            class="font-semibold text-xl px-6 py-3 w-full border-slate-100 dark:border-stone-900 border-2 rounded-2xl cursor-pointer bg-neutral-100/70 hover:bg-neutral-300/70 shadow hover:-translate-y-1 transition-all duration-300"
            @click="setAnswer(option, activeQuestion)"
          >
            {{ t(`games.quiz.questions.${activeQuestion}.options.${option}`) }}
          </button>
        </ul>
      </div>
      <div
        class="flex flex-col items-center h-full w-full"
        v-else-if="gameStore.status === 'pending'"
      >
        <button
          class="px-10 py-3 w-3/5 font-semibold bg-main-gradient text-neutral-100 shadow rounded-xl justify-center transition-all"
          @click="startGame"
        >
          {{ t("games.play") }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, computed } from "vue";
import { useGameStore } from "../../../../stores/gameStore";
import { useRoute } from "vue-router";
import axios from "axios";
import { useUserStore } from "../../../../stores/userStore";
import BasicSpinner from "../../../../components/BasicSpinner.vue";
import { useI18n } from "vue-i18n";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const { t } = useI18n();
const gameStore = useGameStore();
const userStore = useUserStore();
const route = useRoute();

const isLoading = ref(true);

const startGame = async () => {
  const startedGame = await axios.patch(`${SERVER_URL}/games/start`, {
    gameId: gameStore.gameId,
    userId: userStore.id,
  });
  if (startedGame) {
    gameStore.status = "inProgress";
  }
};

const answeredQuestionsNumber = ref<number>(0);

const activeQuestion = computed(() => {
  return (
    gameStore.gameData?.questions[answeredQuestionsNumber.value]?.question ||
    "none"
  );
});

const setAnswer = async (answer: string, question: string) => {
  const updatedAnswer = await axios.patch(`${SERVER_URL}/games/quiz/answer`, {
    gameId: gameStore.gameId,
    playerId: userStore.id,
    question,
    answer,
  });
  if (updatedAnswer.data.answer) {
    gameStore.gameData.questions
      .find((q: any) => q.question === question)
      .answers.push({
        answer: updatedAnswer.data.answer,
        player: userStore.id,
      });
    answeredQuestionsNumber.value++;
  }
};

onBeforeMount(async () => {
  isLoading.value = await gameStore.getGameData(
    route.params.id as string,
    "quiz",
    userStore.id
  );
  if (gameStore.gameData?.questions) {
    answeredQuestionsNumber.value =
      gameStore.gameData?.questions?.filter(
        (question: any) => question?.answers.length > 0
      ).length || 0;
  }
});

onBeforeUnmount(() => {
  gameStore.closeGame();
});

const getEmoji = (key: keyof typeof emojiMap): string => {
  return emojiMap[key];
};

const emojiMap = {
  none: "❓",
  idealActivity: "🎮",
  dreamVacation: "🏝️",
  preferredPet: "🐶",
  weekendActivity: "🎉",
  favoriteSeason: "☀️",
  morningRoutine: "☕",
  musicPreference: "🎸",
  dreamJob: "💼",
  movieGenre: "🎬",
  idealSuperpower: "🦸",
  favoriteDessert: "🍰",
  preferredTransport: "🚗",
  socialSituation: "👥",
  howToRelax: "📚",
  houseType: "🏠",
  favoriteDrink: "☕",
  gamingStyle: "🎮",
  hobbyPreference: "🎨",
  bestLearningStyle: "📖",
  communicationStyle: "💬",
};
</script>
