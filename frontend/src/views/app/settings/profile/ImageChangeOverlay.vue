<template>
  <BasicOverlay @close="close">
    <div class="flex flex-col items-center justify-start w-full h-full">
      <div
        id="image-preview"
        class="w-4/5 flex flex-col items-center justify-center py-20"
      >
        <div class="w-4/5 h-full relative" v-if="isUploaded">
          <div
            class="img-overlay absolute z-20 w-full h-full bg-white/25 pointer-events-none"
          ></div>

          <div class="w-full aspect-square relative overflow-hidden">
            <div
              class="absolute min-w-full min-h-full cursor-move"
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
                class="h-full w-full select-none"
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
          class="mt-12 rounded-lg select-none py-3 px-8 text-xl text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all cursor-pointer"
        >
          <i class="fa-solid fa-cloud-arrow-up"></i>
          {{ isUploaded ? "Change" : "Upload" }}
          <input
            type="file"
            id="uploadFile"
            class="hidden select-none"
            accept="image/*"
            @change="previewImage"
          />
        </label>
        <div
          class="mt-8 w-full flex gap-4 flex-row items-center max-w-72 select-none"
          v-if="isUploaded"
        >
          <button
            class="rounded-full p-2 flex items-center justify-center select-none text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all cursor-pointer"
            @click="scaleDown"
          >
            <i class="fa-solid fa-minus h-4 w-4"></i>
          </button>
          <input
            id="minmax-range"
            type="range"
            min="100"
            max="200"
            v-model="scale"
            @input="calculateImagePosition(position.x, position.y)"
            class="w-full h-2 bg-neutral-100 rounded-lg cursor-pointer dark:bg-gray-700 select-none"
          />
          <button
            class="rounded-full p-2 flex items-center justify-center select-none text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all cursor-pointer"
            @click="scaleUp"
          >
            <i class="fa-solid fa-plus h-4 w-4"></i>
          </button>
        </div>
        <button
          class="mt-12 rounded-lg py-3 select-none px-8 text-xl text-neutral-200 dark:text-neutral-300 bg-blue-600 hover:bg-blue-500 dark:bg-blue-800 dark:hover:bg-blue-700 transition-all cursor-pointer"
          v-if="isUploaded"
          :disabled="mainStore.isLoading"
          :class="{
            'opacity-25 hover:bg-blue-600 dark:hover:bg-blue-800 cursor-auto':
              mainStore.isLoading,
          }"
          @click="changeImage"
        >
          Save
        </button>
      </div>
    </div>
  </BasicOverlay>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import UserAvatar from "../../../../components/UserAvatar.vue";
import { useUserStore } from "../../../../stores/userStore";
import { useMainStore } from "../../../../stores";
import BasicOverlay from "../../../../components/containers/BasicOverlay.vue";
import axios from "axios";

const emit = defineEmits(["close"]);

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const isUploaded = ref(false);
const imageFile = ref<File | null>(null);
const imageFileUrl = ref<string>("");

const scale = ref(100);

const mainStore = useMainStore();
const userStore = useUserStore();

const scaleUp = () => {
  if (scale.value < 200) scale.value = Math.ceil((scale.value + 10) / 10) * 10;
};

const scaleDown = () => {
  if (scale.value > 100) scale.value = Math.ceil((scale.value - 10) / 10) * 10;
};

const previewImage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0];
    imageFileUrl.value = URL.createObjectURL(imageFile.value);
    isUploaded.value = true;
  } else {
    isUploaded.value = false;
  }
};

const changeImage = async () => {
  if (!imageRef.value) return;
  const canvas = document.createElement("canvas");

  const parentElement = imageRef.value.parentElement;
  if (!parentElement) return;

  const parentRect = parentElement.getBoundingClientRect();
  const imageRect = imageRef.value.getBoundingClientRect();

  const cropX = Math.abs(imageRect.left - parentRect.left);
  const cropY = Math.abs(imageRect.top - parentRect.top);

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const img = new Image();
  img.src = imageFileUrl.value;

  img.onload = () => {
    const proportion = img.width / imageRect.width;

    canvas.width = proportion * parentRect.width;
    canvas.height = proportion * parentRect.width;
    ctx.drawImage(
      img,
      proportion * cropX,
      proportion * cropY,
      proportion * parentRect.width,
      proportion * parentRect.height,
      0,
      0,
      proportion * parentRect.width,
      proportion * parentRect.height
    );

    canvas.toBlob(async (blob) => {
      const formData = new FormData();

      const fileName = userStore.email.replace(/[@.]/g, "_");

      formData.append("profilePicture", blob as Blob, fileName);
      formData.append("email", userStore.email);
      if (userStore.imageUrl) {
        formData.append("oldImageName", userStore.imageUrl);
      }

      mainStore.isLoading = true;
      axios
        .put(`${SERVER_URL}/user/update-image`, formData, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        })
        .then((res) => {
          userStore.imageUrl = res.data.imageUrl;
          isUploaded.value = false;
          console.log(res);
          close();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          mainStore.isLoading = false;
        });
    }, "image/png");
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

<style>
.img-overlay {
  mask-image: radial-gradient(circle, transparent 71%, black 69%);
  mask-position: center;
  mask-size: 100% 100%;
}
</style>
