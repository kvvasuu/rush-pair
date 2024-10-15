<template>
  <main
    class="flex flex-col items-center justify-center w-full h-full relative"
  >
    <div
      class="logo pointer-events-none h-40"
      :class="{
        'hover:scale-105 transition-all drop-shadow cursor-pointer duration-500 enabled opacity-95':
          showUi,
      }"
    >
      <a href="https://kwasu.pl" target="_blank"
        ><img src="/logo.png" alt="Rush Pair" width="200px"
      /></a>
    </div>

    <section
      id="controls"
      class="flex flex-col items-center py-32 md:py-16 w-full"
      :class="{ show: showUi }"
    >
      <div
        id="controls-delayed"
        class="flex flex-col items-center justify-center gap-6 px-10 w-full"
      >
        <button
          class="px-8 py-3 w-full mx-10 md:w-auto font-bold text-lg bg-yellow-400 hover:bg-amber-400 rounded-full transition-all drop-shadow-sm"
          @click="toggleAuthModal('register')"
        >
          Create account
        </button>
        <button
          class="text-slate-50 md:text-inherit px-8 py-3 w-full mx-10 md:w-auto font-bold text-md bg-transparent hover:bg-slate-200/10 border-[2px] border-slate-200 rounded-full transition-all drop-shadow-sm md:hidden"
          @click="toggleAuthModal('login')"
        >
          Login
        </button>
      </div>
    </section>
    <div
      id="login-button"
      :class="{ show: showUi }"
      class="absolute top-8 right-8 hidden md:block"
    >
      <button
        class="px-6 py-2 font-bold text-md bg-slate-50 hover:bg-slate-200 border-[1px] border-slate-200 rounded-full transition-all drop-shadow-sm"
        @click="toggleAuthModal('login')"
      >
        Login
      </button>
    </div>
    <Transition name="fade">
      <Teleport to="body">
        <CreateAccount
          v-if="registerModal"
          @close="toggleAuthModal('register')"
          @go-to-login="toggleAuthModal('login')"
        ></CreateAccount>
        <Login v-else-if="loginModal" @close="toggleAuthModal('login')"></Login>
      </Teleport>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import CreateAccount from "./CreateAccount.vue";
import Login from "./Login.vue";
import { ref, onMounted } from "vue";

const showUi = ref(false);

const registerModal = ref(false);
const loginModal = ref(false);

const toggleAuthModal = (modalType: string) => {
  switch (modalType) {
    case "register":
      registerModal.value = !registerModal.value;
      break;

    case "login":
      loginModal.value = !loginModal.value;
      break;
  }
};

onMounted(() => {
  setTimeout(() => {
    showUi.value = true;
  }, 1500);
});
</script>

<style scoped>
#controls {
  max-height: 0;
  overflow: hidden;
  transition: all 1s ease;
  opacity: 0;
}

#controls.show {
  max-height: 200px;
  opacity: 1;
}

#controls-delayed,
#login-button {
  opacity: 0;
  transition: all 1s ease;
  pointer-events: none;
}

#controls.show #controls-delayed,
#login-button.show {
  opacity: 1;
  transition-delay: 1s;
  pointer-events: auto;
}

.enabled {
  pointer-events: all;
}
</style>
