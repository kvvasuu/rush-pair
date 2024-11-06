<template>
  <div
    class="absolute top-16 flex flex-col items-center justify-start max-w-[666px] w-full h-[calc(100%-8rem)] pt-4 overflow-y-auto"
  >
    <div class="relative w-[calc(100%-3rem)] flex justify-center">
      <input
        id="search-input"
        type="text"
        class="text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 pl-14 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-xl placeholder:text-neutral-600 rounded-lg"
        autocomplete="off"
        v-model="searchValue"
        placeholder="Search..."
      />
      <label
        for="search-input"
        class="absolute left-5 h-full flex items-center top-0 text-neutral-500 dark:text-neutral-400 text-xl"
        ><i class="fa-solid fa-magnifying-glass"></i
      ></label>
    </div>
    <div class="w-full h-full mt-2">
      <ul class="w-full">
        <li
          class="w-full h-24 px-6 py-3 flex items-center justify-start cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all"
          v-for="pair in userStore.pairs"
          @click="goToPair(pair.id)"
        >
          <PairAvatar :pair="pair"></PairAvatar>
          <div class="w-full h-full flex flex-col items-start justify-center">
            <p
              class="w-full px-6 text-lg font-semibold text-slate-700 dark:text-neutral-300 select-none"
            >
              {{ pair.name || "Anonymous user" }}
            </p>
            <p
              class="w-full px-6 text-sm text-slate-600 dark:text-neutral-500 select-none"
            >
              {{ pairedAt(pair.pairedAt) }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "../../../stores/userStore";
import { computed, ref } from "vue";
import PairAvatar from "../../../components/PairAvatar.vue";

const router = useRouter();
const userStore = useUserStore();

const searchValue = ref("");

const goToPair = (id: string) => {
  router.push(`/app/pairs/${id}`);
};

const pairedAt = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
</script>
