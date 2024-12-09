<template>
  <div class="flex flex-col items-center justify-center h-full w-full">
    <Transition name="fade" mode="out-in">
      <div
        class="rounded-full bg-slate-100 w-full h-full max-w-64 max-h-64 sm:max-w-[30rem] sm:max-h-[30rem] p-12 shadow-md"
        v-if="!isDrawing"
      >
        <div class="rounded-full bg-slate-100 w-full h-full p-12 shadow-md">
          <button
            class="rounded-full bg-slate-100 w-full h-full shadow-top border-slate-100 border-8 group"
            @click="startDrawing"
            :disabled="mainStore.isDrawing"
          >
            <div
              class="rounded-full bg-red-500 w-full h-full shadow-inner shadow-red-950/25 p-4"
            >
              <div
                class="rounded-full bg-red-500 w-full h-full shadow-top flex items-center justify-center transition-all duration-150"
                :class="{
                  'animate-pulse group-active:animate-none group-active:scale-[98%] group-active:shadow-[0_1px_6px_2px_rgba(0,0,0,0.3)]':
                    !mainStore.isDrawing,
                }"
              >
                <Transition name="start-drawing">
                  <div
                    v-if="mainStore.isDrawing"
                    class="absolute bg-red-500 w-full h-full"
                  ></div>
                </Transition>
                <p class="text-slate-100 font-bold text-3xl drop-shadow-md">
                  Rush for Pair!
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div
        v-else
        class="bg-red-500 w-full h-full flex flex-col justify-center gap-4"
      >
        <BasicSpinner></BasicSpinner>
        <button @click="stopDrawing">Back</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import BasicSpinner from "../../../components/BasicSpinner.vue";
import { useMainStore } from "../../../stores";

const emit = defineEmits(["startDrawing", "stopDrawing"]);

const mainStore = useMainStore();

const isDrawing = ref(false);

const startDrawing = () => {
  emit("startDrawing");
  mainStore.isDrawing = true;
  setTimeout(() => {
    isDrawing.value = true;
  }, 1200);
};

const stopDrawing = () => {
  isDrawing.value = false;
  emit("stopDrawing");
  mainStore.isDrawing = false;
};

onBeforeUnmount(() => {
  mainStore.isDrawing = false;
});
</script>

<style scoped>
.start-drawing-enter-active {
  transition: all 1s ease-out;
}

.start-drawing-leave-active {
  transition: all 2s ease-in;
}

.start-drawing-enter-from {
  transform: scale(0%);
  border-radius: 100%;
}
.start-drawing-leave-to {
  transform: scale(100%);
  border-radius: 0%;
}
</style>
