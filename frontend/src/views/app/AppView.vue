<template>
  <div
    class="w-full h-full bg-slate-200 dark:bg-neutral-900 flex justify-center"
  >
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
import { onBeforeMount } from "vue";
import { useAuthStore } from "../../stores/authStore";

const authStore = useAuthStore();

onBeforeMount(() => {
  document.documentElement.setAttribute("data-theme", authStore.settings.theme);
});
</script>
