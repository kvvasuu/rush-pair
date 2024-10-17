<template>
  <div
    class="absolute z-50 bg-black/80 sm:bg-black/50 w-dvw h-dvh flex items-center justify-center"
    @click="closeModal"
  >
    <Transition name="slide-from-bottom">
      <section
        @click.stop=""
        v-if="isVisible"
        class="absolute bottom-0 sm:relative w-full max-w-[666px] h-[95%] sm:h-[90%] bg-neutral-900 rounded-lg overflow-auto"
      >
        <slot></slot>
        <button
          @click="closeModal"
          class="absolute top-6 right-6 text-neutral-500 hover:text-neutral-300 transition-all cursor-pointer text-4xl flex items-center justify-center w-8 h-8"
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

const props = defineProps(["preventClose", "noCloseButton"]);
const emit = defineEmits(["close"]);

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});

const closeModal = () => {
  if (!props.preventClose) {
    isVisible.value = false;
    setTimeout(() => {
      emit("close");
    }, 200);
  }
};
</script>
