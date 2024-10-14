<template>
  <div
    class="absolute z-50 bg-black/40 w-dvw h-dvh flex items-center justify-center"
    @click="closeModal"
  >
    <Transition name="pop-up">
      <section
        @click.stop=""
        v-if="isVisible"
        class="w-full md:max-w-[28rem] h-full md:max-h-[42rem] bg-slate-50 md:rounded-lg p-12 relative"
      >
        <slot></slot>
        <button
          @click="closeModal"
          class="absolute top-6 right-6 text-neutral-400 hover:text-neutral-500 transition-colors text-4xl flex items-center justify-center w-8 h-8"
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
