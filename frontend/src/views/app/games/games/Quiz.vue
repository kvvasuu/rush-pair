<template>
  <div
    class="absolute top-0 pt-24 pb-12 flex flex-col items-center justify-start w-full px-8 h-[calc(100%-4rem)] md:h-full overflow-y-auto overflow-x-hidden"
  >
    <ul>
      <li
        v-for="question in gameStore.gameData.questions"
        class="font-semibold text-xl"
      >
        <p>{{ question.question }}:</p>
        <ul class="flex flex-col items-center">
          <li
            v-for="option in question.options"
            class="font-normal text-sm cursor-pointer"
            @click="setAnswer(option, question.question)"
          >
            {{ option }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useGameStore } from "../../../../stores/gameStore";
import { useRoute } from "vue-router";
import axios from "axios";
import { useUserStore } from "../../../../stores/userStore";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const gameStore = useGameStore();
const userStore = useUserStore();
const route = useRoute();

const isLoading = ref(true);

const setAnswer = async (answer: string, question: string) => {
  const updatedAnswer = await axios.patch(`${SERVER_URL}/games/quiz/answer`, {
    gameId: gameStore.gameId,
    playerId: userStore.id,
    question,
    answer,
  });
  gameStore.gameData.questions
    .find((q: any) => q.question === question)
    .answers.push({ answer: updatedAnswer.data.answer, player: userStore.id });
};

onBeforeMount(async () => {
  isLoading.value = await gameStore.getGameData(
    route.params.id as string,
    "quiz",
    userStore.id
  );
});

onBeforeUnmount(() => {
  gameStore.gameData = {};
});
</script>
