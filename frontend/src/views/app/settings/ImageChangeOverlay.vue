<template>
  <BasicOverlay @close="close">
    <div class="flex flex-col items-center justify-start w-full h-full">
      <div
        id="image-preview"
        class="w-4/5 flex flex-col items-center justify-center py-20"
      >
        <div class="w-4/5 h-full" v-if="isUploaded">
          <div class="w-full aspect-square relative overflow-hidden">
            <div
              class="absolute min-w-full min-h-full"
              :style="{
                width: `${scale}%`,
                height: 'auto',
                left: `${position.x}px`,
                top: `${position.y}px`,
              }"
              @mousedown.prevent="startDrag"
              @touchstart.prevent="startDrag"
              ref="imageRef"
            >
              <img
                :src="imageFileUrl"
                alt="ProfileImage"
                class="h-full w-full"
                draggable="false"
              />
            </div>
          </div>
        </div>

        <div class="w-4/5 flex flex-col items-center justify-center" v-else>
          <UserAvatar></UserAvatar>
        </div>
        <label
          for="uploadFile"
          class="mt-12 rounded-lg py-3 px-8 text-xl text-neutral-400 bg-neutral-800 hover:bg-neutral-700/50 transition-all cursor-pointer"
        >
          <i class="fa-solid fa-cloud-arrow-up"></i>
          {{ isUploaded ? "Change" : "Upload" }}
          <input
            type="file"
            id="uploadFile"
            class="hidden"
            accept="image/*"
            @change="previewImage"
          />
        </label>
        <div class="mt-8 w-full max-w-56" v-if="isUploaded">
          <input
            id="minmax-range"
            type="range"
            min="100"
            max="200"
            v-model="scale"
            @input="calculateImagePosition(position.x, position.y)"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
        <button
          class="mt-12 rounded-lg py-3 px-8 text-xl text-neutral-300 bg-blue-800 hover:bg-blue-700 transition-all cursor-pointer"
          v-if="isUploaded"
          :disabled="mainStore.isLoading"
          :class="{
            'opacity-25 hover:bg-blue-700 cursor-auto': mainStore.isLoading,
          }"
          @click="changeImage"
        >
          Save
        </button>
        <canvas ref="previewCanvas"></canvas>
      </div>
    </div>
  </BasicOverlay>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import UserAvatar from "../../../components/containers/UserAvatar.vue";
import { useAuthStore } from "../../../stores/authStore";
import { useMainStore } from "../../../stores";
import BasicOverlay from "../../../components/containers/BasicOverlay.vue";
import axios from "axios";

const emit = defineEmits(["close"]);

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const isUploaded = ref(false);
const imageFile = ref<File | null>(null);
const imageFileUrl = ref<string>("");

const scale = ref(150);

const mainStore = useMainStore();
const authStore = useAuthStore();

const previewCanvas = ref(null);

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

const changeImage = async () => {
  if (!imageRef.value) return;
  /* const canvas = document.createElement("canvas"); */
  const canvas = previewCanvas.value as any;

  const parentElement = imageRef.value.parentElement;
  if (!parentElement) return;

  const parentRect = parentElement.getBoundingClientRect();
  const imageRect = imageRef.value.getBoundingClientRect();

  const cropX = 0;
  const cropY = 0;
  const cropWidth = 420;
  const cropHeight = 420;

  canvas.width = cropWidth;
  canvas.height = cropWidth;

  console.log(cropX, cropY, cropWidth, cropHeight);

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const img = new Image();
  img.src = imageFileUrl.value;
  img.onload = () => {
    console.log(img.width, img.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    /* canvas.toBlob(async (blob) => {
      const formData = new FormData();

      const fileName = authStore.email.replace(/[@.]/g, "_");

      formData.append("profilePicture", blob as Blob, fileName);
      formData.append("email", authStore.email);
      mainStore.isLoading = true;
      axios
        .put(`${SERVER_URL}/user/update-image`, formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })
        .then((res) => {
          authStore.imageUrl = res.data.imageUrl;
          isUploaded.value = false;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          mainStore.isLoading = false;
        });
    }, "image/png"); */
  };
};

const close = () => {
  emit("close");
};

const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const lastMousePosition = ref({ x: 0, y: 0 });
const imageRef = ref<HTMLElement | null>(null);

const startDrag = (event: MouseEvent | TouchEvent) => {
  isDragging.value = true;
  if ("touches" in event) {
    lastMousePosition.value = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  } else {
    lastMousePosition.value = { x: event.clientX, y: event.clientY };
  }
};

const calculateImagePosition = (newX: number, newY: number): void => {
  if (!imageRef.value) return;

  const parentElement = imageRef.value.parentElement;
  if (!parentElement) return;

  const parentRect = parentElement.getBoundingClientRect();
  const imageRect = imageRef.value.getBoundingClientRect();

  const maxLeft = parentRect.width - imageRect.width;
  const maxRight = 0;
  const maxTop = parentRect.height - imageRect.height;
  const maxBottom = 0;

  const isWithinBoundsX = newX >= maxLeft && newX <= maxRight;
  const isWithinBoundsY = newY >= maxTop && newY <= maxBottom;

  if (isWithinBoundsX) {
    position.value.x = newX;
  } else if (newX < maxLeft) {
    position.value.x = maxLeft;
  } else if (newX > maxRight) {
    position.value.x = maxRight;
  }

  if (isWithinBoundsY) {
    position.value.y = newY;
  } else if (newY < maxTop) {
    position.value.y = maxTop;
  } else if (newY > maxBottom) {
    position.value.y = maxBottom;
  }
};

const onMove = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !imageRef.value) return;

  let clientX: number, clientY: number;

  if ("touches" in event) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const dx = clientX - lastMousePosition.value.x;
  const dy = clientY - lastMousePosition.value.y;

  const newX = position.value.x + dx;
  const newY = position.value.y + dy;

  calculateImagePosition(newX, newY);

  lastMousePosition.value = { x: clientX, y: clientY };
};

const stopDrag = () => {
  isDragging.value = false;
};

onMounted(() => {
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("touchend", stopDrag);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onMove);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onMove);
  document.removeEventListener("touchend", stopDrag);
});
</script>
