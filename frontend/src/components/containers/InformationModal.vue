<template>
  <div
    class="absolute z-50 bg-black/40 w-full h-full flex items-center justify-center"
    @mousedown="closeModal"
  >
    <Transition name="pop-up">
      <section
        @mousedown.stop=""
        v-if="isVisible"
        class="flex flex-col items-center justify-center w-full sm:max-w-[32rem] gap-4 mx-6 p-6 bg-slate-200 dark:bg-neutral-900 rounded-lg relative"
      >
        <div
          class="flex flex-col items-center justify-center w-full gap-1"
          v-if="$slots.title"
        >
          <slot name="title"></slot>
        </div>
        <div
          class="flex flex-col w-full h-full gap-1 text-neutral-600 dark:text-neutral-300"
        >
          <slot name="content"></slot>
        </div>
        <div class="flex items-center justify-center w-full gap-4 mt-auto mb-0">
          <button
            class="rounded-lg w-3/5 select-none text-center py-3 px-6 font-semibold cursor-pointer text-neutral-50 dark:text-inherit bg-red-500 hover:bg-red-600 dark:hover:bg-red-500/80 transition-all"
            @click="confirm"
          >
            <slot name="confirm-button">{{ t("general.close") }}</slot>
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
