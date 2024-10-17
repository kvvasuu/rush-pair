<template>
  <BasicOverlay @close="close">
    <div class="flex flex-col items-center justify-start w-full h-full py-20">
      <div
        id="image-preview"
        class="w-4/5 h-[512px] flex items-center justify-center"
      >
        <div class="w-full h-full" v-if="isUploaded">
          <div
            class="w-full aspect-square relative overflow-hidden rounded-full"
          >
            <div
              class="absolute min-w-full min-h-full"
              :style="{ width: `${scale}%` }"
            >
              <img
                :src="imageFileUrl"
                alt="ProfileImage"
                class="h-full w-full"
                draggable="false"
              />
            </div>
          </div>

          <div class="mt-4 w-full px-24">
            <input
              id="minmax-range"
              type="range"
              min="100"
              max="200"
              v-model="scale"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div class="w-4/5 flex flex-col items-center justify-center" v-else>
          <UserAvatar></UserAvatar>
          <label
            for="uploadFile"
            class="mt-12 rounded-lg py-3 px-8 text-xl text-neutral-400 bg-neutral-800 hover:bg-neutral-700/50 transition-all cursor-pointer"
          >
            <i class="fa-solid fa-cloud-arrow-up"></i> Upload
            <input
              type="file"
              id="uploadFile"
              class="hidden"
              accept="image/*"
              @change="previewImage"
            />
          </label>
        </div>
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
const imageFile = ref<File | null>(null);
const imageFileUrl = ref<string>("");

const scale = ref(5);

/* const mainStore = useMainStore();
const authStore = useAuthStore(); */

const previewImage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0];
    isUploaded.value = true;
    imageFileUrl.value = URL.createObjectURL(imageFile.value);
  } else {
    isUploaded.value = false;
  }
};

const close = () => {
  emit("close");
};
</script>
