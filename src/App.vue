<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useMainStore } from './stores';

const store = useMainStore()

onMounted(() => {
  /* Tu będzie wywołane zapytanie do backendu.
  Chcemy sprawdzić czy użytkownik jest zalogowany tzn. posiada numer id. Jeżeli posiada, będzie to ustawione w Pinia store.
  Musimy się upewnić czy jest zalogowany po to, aby wyświetlić daną treść na froncie.
  */
  setTimeout(() => {
    store.setUserId(231231)
  }, 2000); // to jest tylko symulacja ładowania
}),
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
