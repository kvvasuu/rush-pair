<template>
  <BasicOverlay @close="close">
    <div class="flex flex-col items-center justify-start w-full h-full py-20">
      <div
        id="image-preview"
        class="w-4/5 h-full max-h-[512px] flex items-center justify-center py-10 relative"
      >
        <div class="w-4/5 h-full" v-if="isUploaded"></div>
        <div class="w-4/5 absolute" v-else>
          <UserAvatar></UserAvatar>
        </div>
      </div>
      <div class="w-full px-24">
        <input
          id="minmax-range"
          type="range"
          min="0"
          max="10"
          v-model="scale"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
    </div>
  </BasicOverlay>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserAvatar from "../../../components/containers/UserAvatar.vue";
/* import { useAuthStore } from "../../../stores/authStore";
import { useMainStore } from "../../../stores"; */
import BasicOverlay from "../../../components/containers/BasicOverlay.vue";

const emit = defineEmits(["close"]);

const isUploaded = ref(false);

const scale = ref(5);

/* const mainStore = useMainStore();
const authStore = useAuthStore(); */

const close = () => {
  emit("close");
};
</script>
