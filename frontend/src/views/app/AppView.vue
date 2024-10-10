<template>
  <main
    class="flex flex-col items-center justify-center w-full h-full relative"
  >
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

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
