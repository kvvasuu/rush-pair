<template>
  <div
    class="absolute z-50 bg-black/40 w-full h-full flex items-center justify-center"
    @mousedown="closeModal"
  >
    <Transition name="pop-up">
      <section
        @mousedown.stop=""
        v-if="isVisible"
        class="flex flex-col items-center justify-center w-full sm:max-w-[32rem] mx-6 h-full max-h-72 sm:max-h-56 bg-slate-200 dark:bg-neutral-900 rounded-lg p-4 relative"
      >
        <div class="flex items-center justify-center w-full h-8">
          <h2
            class="text-center font-bold text-xl text-neutral-600 dark:text-neutral-300"
            v-if="$slots.title"
          >
            <slot name="title"></slot>
          </h2>
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-500 transition-colors text-4xl flex items-center justify-center w-8 h-8"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div
          class="flex flex-col w-full h-full sm:px-3 py-4 gap-1 text-neutral-600 dark:text-neutral-300"
        >
          <slot name="content"></slot>
        </div>
        <div class="flex items-center justify-end w-full gap-4 mt-auto mb-0">
          <button
            class="rounded-lg select-none text-center py-3 px-6 font-semibold cursor-pointer text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-all"
            @click="closeModal"
          >
            {{ t("general.cancel") }}
          </button>
          <button
            class="rounded-lg select-none text-center py-3 px-6 font-semibold cursor-pointer text-neutral-50 dark:text-inherit bg-red-500 hover:bg-red-600 dark:hover:bg-red-500/80 transition-all"
            @click="confirm"
          >
            <slot name="confirm-button">{{ t("general.confirm") }}</slot>
          </button>
        </div>
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["close", "confirm"]);

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

const confirm = () => {
  isVisible.value = false;
  emit("confirm");
  setTimeout(() => {
    emit("close");
  }, 200);
};
</script>
