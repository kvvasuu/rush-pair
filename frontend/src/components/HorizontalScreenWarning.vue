<template>
  <div
    class="absolute top-0 left-0 w-dvw h-dvh flex flex-col gap-6 items-center justify-center bg-neutral-900/90 backdrop-blur-sm z-50 text-center text-neutral-200 pointer-events-none"
  >
    <i class="fa-solid fa-rotate text-4xl rotate"></i>
    <div>
      <p class="text-lg font-semibold">
        Rotate your device to use the application.
      </p>
      <p class="text-xs">
        This application is designed to work in portrait mode only.
      </p>
    </div>
  </div>
</template>

<style scoped>
.rotate {
  animation: rotate 3s infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(-45deg);
  }
  75% {
    transform: rotate(90deg);
  }
  100% {
    transform: rotate(-45deg);
  }
}
</style>
