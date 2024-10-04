<template>
  <main class="flex flex-col items-center justify-center">
    <div class="logo hover:scale-105 transition-all drop-shadow cursor-pointer">
      <a href="https://kwasu.pl" target="_blank"
        ><img src="/logo.png" alt="Rush Pair" width="200px"
      /></a>
    </div>

    <section
      id="controls"
      class="flex flex-col items-center py-10"
      :class="{ expanded: !isLoading }"
    >
      <div
        id="controls-delayed"
        class="flex flex-col items-center justify-center gap-10"
      >
        <button
          class="px-8 py-4 font-bold bg-yellow-400 hover:bg-yellow-500 rounded-2xl transition-all"
        >
          Join session
        </button>
        <button class="px-4 py-2">Host session</button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";

const isLoading = ref<boolean>(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});
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
