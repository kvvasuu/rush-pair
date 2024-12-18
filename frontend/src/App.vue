<template>
  <HorizontalScreenWarning
    v-if="displayHorizontalScreenWarning"
  ></HorizontalScreenWarning>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <Component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { useUserStore } from "./stores/userStore";
import HorizontalScreenWarning from "./components/HorizontalScreenWarning.vue";

const userStore = useUserStore();

const displayHorizontalScreenWarning = ref(false);
const checkOrientation = () => {
  displayHorizontalScreenWarning.value =
    window.matchMedia("(orientation: landscape)").matches &&
    window.innerHeight <= 500;
};

watch(
  () => userStore.getAllUnreadMessages,
  (count) => {
    document.title =
      count > 0 ? `(${count > 99 ? "99+" : count}) RUSHPAIR` : "RUSHPAIR";
  },
  { immediate: true }
);

window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);

onBeforeMount(async () => {
  await userStore.login();
});
</script>
