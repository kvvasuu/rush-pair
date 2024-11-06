<template>
  <div
    class="w-full h-full bg-slate-200 dark:bg-neutral-900 flex justify-center"
  >
    <RouterView
      v-slot="{ Component }"
      class="absolute top-0"
      :class="{
        'md:left-8 xl:left-28 w-full md:w-[calc(100%-4rem)] xl:w-[calc(100%-14rem)] h-[calc(100%-4rem)] md:h-full':
          route.path !== '/app/first-steps',
      }"
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
import BottomControls from "./BottomControls.vue";
import LeftControls from "./LeftControls.vue";
import { onBeforeMount } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();

console.log(route.path);

onBeforeMount(() => {
  document.documentElement.setAttribute("data-theme", userStore.settings.theme);
});
</script>
