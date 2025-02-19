<template>
  <div
    class="flex items-center justify-center w-60 h-60 rounded-3xl shadow transition-all duration-300 border-4 border-neutral-100 dark:border-neutral-800 overflow-hidden relative bg-neutral-100 dark:bg-neutral-800 select-none"
    :class="{ 'cursor-pointer hover:scale-105': isLoaded }"
    @click="toggleOverlay"
  >
    <img
      :src="imgUrl"
      :alt="name"
      draggable="false"
      @load="onLoad"
      class="object-cover h-full w-full absolute z-10"
      v-show="isLoaded"
    />
    <div
      class="w-full h-full bg-slate-300 dark:bg-neutral-800/60 animate-pulse absolute flex items-center justify-center font-semibold text-lg text-neutral-400 dark:text-neutral-600 select-none"
      v-if="!isLoaded"
    >
      {{ t(`games.${name}.name`) }}
    </div>
    <Transition name="fade" mode="out-in">
      <Teleport to="body">
        <BasicOverlay v-if="isOverlayVisible" @close="toggleOverlay">
          <Transition name="fade" mode="out-in">
            <div
              class="w-full h-full flex flex-col gap-6 items-center justify-center relative overflow-y-hidden"
              v-if="isLoading"
            >
              <BasicSpinner></BasicSpinner>
              <p class="text-xl text-neutral-500 select-none">
                {{ t("games.startingNewGame") }}
              </p>
            </div>
            <div
              class="w-full h-full flex flex-col justify-end relative overflow-y-hidden"
              v-else-if="!choosingOpponent"
            >
              <img
                :src="imgUrl"
                :alt="name"
                draggable="false"
                class="object-cover h-3/5 w-full absolute top-0 img"
              />

              <div
                class="w-full h-3/5 pt-10 flex flex-col items-start justify-start z-10 overflow-y-auto"
              >
                <div
                  class="w-full px-6 flex flex-col items-start justify-start gap-5"
                >
                  <h1 class="text-4xl font-bold text-neutral-100 drop-shadow">
                    {{ t(`games.${name}.name`) }}
                  </h1>

                  <button
                    class="px-10 py-3 w-full md:w-auto font-semibold bg-main-gradient hover:bg-main-gradient-dark text-neutral-100 shadow-md rounded-xl justify-center transition-all drop-shadow-sm"
                    @click="choosingOpponent = true"
                  >
                    <i class="fa-solid fa-play mr-2"></i> {{ t("games.play") }}
                  </button>
                </div>

                <div
                  class="flex flex-col overflow-y-auto mt-4 sm:mt-10 px-6 pb-6 gap-4"
                >
                  <div class="flex h-6 gap-4">
                    <div class="relative">
                      <img
                        src="/RushCoinBlank.svg"
                        alt="RushCoin"
                        draggable="false"
                        class="aspect-square h-full select-none"
                      />
                      <div
                        class="absolute w-full h-full top-0 flex text-sm items-center justify-center text-center select-none text-neutral-100"
                      >
                        {{ prize }}
                      </div>
                    </div>
                    <div
                      class="h-full flex items-center text-center select-none text-neutral-500 dark:text-neutral-100"
                    >
                      {{ duration }} min.
                    </div>
                  </div>
                  <p
                    class="text-sm font-semibold text-neutral-500 dark:text-neutral-400"
                  >
                    {{ t(`games.${name}.description`) }}
                  </p>
                  <p
                    class="text-sm font-semibold text-neutral-500 dark:text-neutral-400"
                  >
                    {{ t(`games.${name}.winCondition`) }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="w-full h-full flex flex-col items-center justify-start py-6 text-neutral-600 dark:text-neutral-300 gap-8 overflow-y-hidden"
              v-else
            >
              <h1 class="text-3xl font-bold w-4/5 text-center">
                {{ t("games.chooseOpponent") }}
              </h1>
              <div class="w-full flex-1 overflow-y-auto px-6">
                <div
                  class="flex w-full h-full items-center justify-center text-neutral-500 select-none max-w-[666px]"
                  v-if="userStore.pairs?.length <= 0"
                >
                  <p class="text-xl">{{ t("pairs.noPairsYet") }}</p>
                </div>
                <ul class="w-full h-full" v-else>
                  <PairListElement
                    v-for="pair in pairs"
                    :key="pair.id"
                    :pair="pair"
                    :small="true"
                    @on-click="selectOpponent"
                    :class="{ 'bg-slate-100': pair.id === selectedOpponent }"
                  ></PairListElement>
                </ul>
              </div>
              <div class="flex justify-center w-full mt-auto mb-0 gap-4 px-6">
                <button
                  class="px-10 py-2 font-semibold bg-neutral-50 hover:bg-neutral-100 shadow rounded-xl transition-all"
                  @click="
                    () => {
                      choosingOpponent = false;
                      selectedOpponent = '';
                    }
                  "
                >
                  {{ t("general.back") }}
                </button>
                <button
                  class="px-10 py-3 w-3/5 font-semibold bg-main-gradient text-neutral-100 shadow rounded-xl justify-center transition-all"
                  :class="
                    !selectedOpponent
                      ? 'opacity-45'
                      : 'hover:bg-main-gradient-dark'
                  "
                  @click="startGame"
                  :disabled="!selectedOpponent"
                >
                  {{ t("games.play") }}
                </button>
              </div>
            </div>
          </Transition>
        </BasicOverlay>
      </Teleport>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BasicOverlay from "../../../components/containers/BasicOverlay.vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../../../stores/userStore";
import PairListElement from "../pairs/PairListElement.vue";
import { useRouter } from "vue-router";
import BasicSpinner from "../../../components/BasicSpinner.vue";
import axios from "axios";
import { Game } from "../../../types";

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();

const props = defineProps<{
  name: string;
  duration: number;
  prize: number;
  gamesList: Game[];
}>();

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const isLoaded = ref(false);

const onLoad = () => {
  isLoaded.value = true;
};

const imgUrl = new URL(
  `../../../assets/images/${props.name}.webp`,
  import.meta.url
).href;

const isOverlayVisible = ref(false);
const toggleOverlay = () => {
  isOverlayVisible.value = !isOverlayVisible.value;
  choosingOpponent.value = false;
  selectedOpponent.value = "";
};

const choosingOpponent = ref(false);

const selectedOpponent = ref("");
const selectOpponent = (id: string) => {
  selectedOpponent.value === id
    ? (selectedOpponent.value = "")
    : (selectedOpponent.value = id);
};

const pairs = computed(() => {
  const gamesInProgress = props.gamesList
    .map((game) => {
      return game.players.filter(
        (player) =>
          player !== userStore.id &&
          game.gameName.toLowerCase() === props.name.toLowerCase() &&
          game.status !== "finished"
      );
    })
    .flat();

  return [...userStore.pairs]
    .filter((pair) => !pair?.isBlocked && !gamesInProgress.includes(pair.id))
    .sort(
      (a, b) =>
        Number(b.isFavourite) - Number(a.isFavourite) || b.pairedAt - a.pairedAt
    );
});

const isLoading = ref(false);

const startGame = async () => {
  isLoading.value = true;
  try {
    const gameId = await axios.post(`${SERVER_URL}/games`, {
      userId: userStore.id,
      pairId: selectedOpponent.value,
      gameName: props.name?.toLowerCase(),
    });
    if (gameId.data) {
      router.push(`/app/games/${props.name?.toLowerCase()}/${gameId.data}`);
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.img {
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 70%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>
