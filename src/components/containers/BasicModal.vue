<template>
  <div
    class="absolute z-50 bg-black/40 w-dvw h-dvh flex items-center justify-center"
    @click="closeModal"
  >
    <Transition name="pop-up">
      <div @click.stop="" v-if="isVisible">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps(["preventClose"]);
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
    }, 100);
  }
};
</script>
