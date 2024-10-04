<template>
  <main class="flex flex-col items-center justify-center">
    <div
      class="logo hover:scale-105 transition-all drop-shadow cursor-pointer duration-500"
    >
      <a href="https://kwasu.pl" target="_blank"
        ><img src="/logo.png" alt="Rush Pair" width="200px"
      /></a>
    </div>

    <section
      id="controls"
      class="flex flex-col items-center pt-16"
      :class="{ expanded: store.userId }"
    >
      <div
        id="controls-delayed"
        class="flex flex-col items-center justify-center gap-6"
      >
        <button
          class="px-8 py-4 font-bold text-lg bg-yellow-400 hover:bg-amber-400 hover:-translate-y-1 rounded-2xl transition-all duration-300"
          @click="chooseMode('user')"
        >
          Join session
        </button>
        <button
          class="px-4 py-2 font-bold text-sm hover:bg-gray-100/50 hover:-translate-y-1 rounded-lg transition-all duration-300"
          @click="chooseMode('admin')"
        >
          Host session
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useMainStore } from "../stores";
import { useRouter } from "vue-router";

const store = useMainStore();
const router = useRouter();

const chooseMode = (mode: "admin" | "user") => {
  store.setGameMode(mode);
  mode === "admin" ? router.push("/host") : router.push("/join");
};
</script>

<style scoped>
#controls {
  max-height: 0;
  overflow: hidden;
  transition: all 1s ease;
  opacity: 0;
}

#controls.expanded {
  max-height: 200px;
  opacity: 1;
}

#controls-delayed {
  opacity: 0;
  transition: all 1s ease;
}

#controls.expanded #controls-delayed {
  opacity: 1;
  transition-delay: 1s;
}
</style>
