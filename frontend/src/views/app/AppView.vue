<template>
  <div class="w-full h-full">
    <RouterView
      v-slot="{ Component }"
      class="absolute top-0 w-full h-[calc(100%-4rem)]"
    >
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
import { RouterView } from "vue-router";
</script>
