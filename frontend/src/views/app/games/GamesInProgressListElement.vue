<template>
  <li
    class="w-full h-16 pl-6 pr-4 py-2 flex items-center justify-start cursor-pointer hover:bg-slate-100/50 dark:hover:bg-neutral-800/75 transition-all relative group"
    @click="emits('onClick', game)"
  >
    <div class="relative">
      <!-- <PairAvatar
        :pair="pair"
        :key="pair.imageUrl"
        :is-active="pair.isActive"
        class="min-w-[72px] max-w-[72px]"
      ></PairAvatar> -->
    </div>

    <div class="h-full flex flex-col items-start justify-center min-w-0">
      <p
        class="text-lg font-semibold text-slate-700 dark:text-neutral-300 select-none w-full truncate min-w-0 relative capitalize"
      >
        {{ game.gameName }}
      </p>

      <p class="text-sm text-slate-600 dark:text-neutral-500 select-none">
        {{ createdAt }}
      </p>
    </div>
    <button
      class="px-8 py-2 font-semibold bg-main-gradient ml-auto mr-0 text-neutral-100 shadow-md rounded-xl justify-center transition-all"
    >
      <i class="fa-solid fa-play mr-2" v-if="status !== 'finished'"></i>
      {{
        t(
          `games.${
            status === "pending"
              ? "play"
              : status === "inProgress"
              ? "resume"
              : "summary"
          }`
        )
      }}
    </button>
  </li>
</template>

<script setup lang="ts">
import type { Game } from "../../../types";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../../../stores/userStore";

const { t } = useI18n();
const userStore = useUserStore();

const props = defineProps<{
  game: Game;
}>();

const emits = defineEmits(["onClick"]);

const status = props.game.players.find(
  (player) => player.player === userStore.id
)?.status;

const createdAt = computed(() => {
  const date = new Date(Date.parse(props.game.createdAt.toString()));
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
});
</script>
