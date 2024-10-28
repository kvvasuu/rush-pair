<template>
  <div
    class="w-full h-full bg-slate-200 dark:bg-neutral-900 flex justify-center"
  >
    <RouterView
      v-slot="{ Component }"
      class="absolute top-0 md:left-8 xl:left-28 w-full md:w-[calc(100%-4rem)] xl:w-[calc(100%-14rem)] h-[calc(100%-4rem)] md:h-full"
    >
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <BottomControls></BottomControls>

    <LeftControls></LeftControls>
  </div>
</template>

<script setup lang="ts">
import BottomControls from "../../components/BottomControls.vue";
import LeftControls from "../../components/LeftControls.vue";
import { onBeforeMount } from "vue";
import { useAuthStore } from "../../stores/authStore";

const authStore = useAuthStore();

onBeforeMount(() => {
  document.documentElement.setAttribute("data-theme", authStore.settings.theme);
});
</script>
