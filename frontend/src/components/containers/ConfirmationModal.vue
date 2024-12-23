<template>
  <div
    class="absolute z-50 bg-black/40 w-full h-full flex items-center justify-center"
    @mousedown="closeModal"
  >
    <Transition name="pop-up">
      <section
        @mousedown.stop=""
        v-if="isVisible"
        class="w-full md:max-w-[32rem] mx-6 h-full max-h-72 sm:max-h-56 bg-slate-50 dark:bg-neutral-800 rounded-lg p-12 relative"
      >
        <div><slot name="text"></slot></div>
        <div></div>
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-500 transition-colors text-4xl flex items-center justify-center w-8 h-8"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const emit = defineEmits(["close"]);

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});

const closeModal = () => {
  isVisible.value = false;
  setTimeout(() => {
    emit("close");
  }, 200);
};
</script>
