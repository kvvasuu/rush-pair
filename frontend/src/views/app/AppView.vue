<template>
  <div class="flex flex-col items-center justify-center w-full h-full relative">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <div id="controls" class="fixed bottom-0 w-full h-16">
      <BottomControls></BottomControls>
    </div>
  </div>
</template>

<script setup lang="ts">
import BottomControls from "../../components/BottomControls.vue";
</script>
