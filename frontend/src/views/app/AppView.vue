<template>
  <main
    class="flex flex-col items-center justify-center w-full h-full relative"
  >
    <h1 class="text-5xl">Logged in</h1>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped>
#controls {
  max-height: 0;
  overflow: hidden;
  transition: all 1s ease;
  opacity: 0;
}

#controls.show {
  max-height: 200px;
  opacity: 1;
}

#controls-delayed,
#login-button {
  opacity: 0;
  transition: all 1s ease;
  pointer-events: none;
}

#controls.show #controls-delayed,
#login-button.show {
  opacity: 1;
  transition-delay: 1s;
  pointer-events: auto;
}

.enabled {
  pointer-events: all;
}
</style>
