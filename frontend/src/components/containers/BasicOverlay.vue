<template>
  <div
    class="absolute z-50 bg-black/60 dark:bg-black/80 sm:bg-black/30 w-dvw h-dvh flex items-center justify-center"
    @mousedown="closeModal"
  >
    <Transition name="slide-from-bottom">
      <section
        @mousedown.stop=""
        v-if="isVisible"
        class="absolute bottom-0 sm:relative w-full max-w-[666px] h-[95%] sm:h-[91%] bg-slate-200 dark:bg-neutral-900 rounded-t-lg sm:rounded-b-lg overflow-auto"
      >
        <slot></slot>
        <button
          @click="closeModal"
          class="absolute top-6 right-6 text-neutral-600 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300 transition-all cursor-pointer text-4xl flex items-center justify-center w-8 h-8 z-10"
          v-if="!noCloseButton"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMainStore } from "../../stores";

const store = useMainStore();

const props = defineProps(["preventClose", "noCloseButton"]);
const emit = defineEmits(["close"]);

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});

const closeModal = () => {
  if (!store.isLoading)
    if (!props.preventClose) {
      isVisible.value = false;
      setTimeout(() => {
        emit("close");
      }, 200);
    }
};
</script>
