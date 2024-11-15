<template>
  <main
    class="w-full h-full flex justify-center relative bg-slate-200 dark:bg-neutral-900 overflow-hidden"
  >
    <header
      class="flex justify-center items-center w-full h-16 relative bg-slate-200 dark:bg-neutral-800 shadow z-30"
    >
      <p
        class="text-slate-700 dark:text-neutral-300 font-semibold text-xl select-none min-w-0 max-w-48 min-[400px]:max-w-72 sm:max-w-96 truncate"
      >
        {{ pairName || "Pairs" }}
      </p>

      <button
        class="absolute flex items-center gap-2 left-0 top-0 text-neutral-600 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-300 transition-all cursor-pointer py-3 px-4"
        @click="
          router.push({ name: 'PairsList' });
          isProfileExpanded = false;
        "
        v-if="route.params.id"
      >
        <i class="fa-solid fa-angle-left text-4xl"></i>
        <span class="text-xl hidden md:block select-none">Pairs</span>
      </button>
      <PairAvatar
        class="absolute right-4 min-w-10 max-w-10 lg:hidden cursor-pointer"
        :pair="pairImage"
        v-if="route.params.id"
        @click="toggleExpandProfile"
      ></PairAvatar>
    </header>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :isProfileExpanded="isProfileExpanded" :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../../../stores/userStore";
import { useChatStore } from "../../../stores/chatStore";
import PairAvatar from "../../../components/PairAvatar.vue";

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const chatStore = useChatStore();

const pairName = computed(() => {
  if (route.params.id) return chatStore.pairInfo.name || "";
});

const pairImage = computed(() => {
  if (route.params.id) {
    return userStore.pairs.find((el) => el.id === route.params.id) || "";
  }
});

const isProfileExpanded = ref(false);

const toggleExpandProfile = () => {
  isProfileExpanded.value = !isProfileExpanded.value;
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
