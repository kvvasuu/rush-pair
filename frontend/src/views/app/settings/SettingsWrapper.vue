<template>
  <main
    class="w-full h-full flex justify-center relative bg-neutral-900 overflow-hidden"
  >
    <div
      class="flex justify-center items-center w-full h-16 relative bg-neutral-800"
    >
      <p class="text-neutral-300 font-semibold text-xl select-none">
        {{ route.name }}
      </p>

      <i
        class="fa-solid fa-angle-left absolute left-0 top-0 text-4xl text-neutral-500 hover:text-neutral-300 transition-all cursor-pointer py-3 px-4"
        @click="router.back()"
        v-if="route.name !== 'Settings'"
      ></i>
    </div>
    <RouterView
      v-slot="{ Component }"
      class="absolute top-0 w-full h-[calc(100%-4rem)]"
    >
      <Transition name="slide-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-500px);
  opacity: 0;
}
</style>
