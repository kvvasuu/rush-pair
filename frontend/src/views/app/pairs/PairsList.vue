<template>
  <div
    class="absolute top-16 flex flex-col items-center justify-start max-w-[666px] w-full h-[calc(100%-8rem)] md:h-[calc(100%-4rem)] pt-4 overflow-y-auto"
  >
    <div
      class="flex w-full h-full items-center justify-center flex-col gap-8 text-neutral-500 select-none"
      v-if="userStore.pairs?.length <= 0"
    >
      <p class="text-xl">You have no pairs yet.</p>
      <i class="fa-solid fa-handshake-simple text-5xl"></i>
      <p class="text-xl">Start pairing!</p>
    </div>
    <div class="relative w-[calc(100%-3rem)] flex justify-center" v-else>
      <input
        id="search-input"
        type="text"
        class="text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 pl-14 bg-neutral-50 hover:bg-neutral-100/90 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-xl placeholder:text-neutral-600 rounded-lg"
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
        <PairListElement
          v-for="pair in userStore.pairs"
          :pair="pair"
          :currently-edited-nickname-id="currentlyEditedNicknameId"
          @edited-nickname-id="(id: string) => currentlyEditedNicknameId = id"
        ></PairListElement>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../../../stores/userStore";
import { ref } from "vue";
import PairListElement from "./PairListElement.vue";

const userStore = useUserStore();

const searchValue = ref("");

const currentlyEditedNicknameId = ref("");
</script>
