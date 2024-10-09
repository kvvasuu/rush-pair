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
      <Transition name="fade">
        <div v-if="false">
          <Transition name="fade">
            <p
              class="text-gray-100/80 my-8 w-full text-center"
              v-if="store.isConnected === false"
            >
              Unable to connect. <br />Try again later.
            </p>
            <div
              role="status"
              class="w-full flex items-center justify-center"
              v-else
            >
              <svg
                aria-hidden="true"
                class="w-8 h-8 text-gray-100/25 my-8 animate-spin fill-gray-100/80"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>

    <section
      id="controls"
      class="flex flex-col items-center py-32 sm:py-16 w-full"
      :class="{ show: showUi }"
    >
      <div
        id="controls-delayed"
        class="flex flex-col items-center justify-center gap-6 px-10 w-full"
      >
        <button
          class="px-8 py-3 w-full mx-10 sm:w-auto font-bold text-lg bg-yellow-400 hover:bg-amber-400 rounded-full transition-all drop-shadow-sm"
          @click="() => toggleAuthModal('register')"
        >
          Register
        </button>
        <button
          class="text-slate-50 sm:text-inherit px-8 py-3 w-full mx-10 sm:w-auto font-bold text-md bg-transparent hover:bg-slate-200/10 border-[2px] border-slate-200 rounded-full transition-all drop-shadow-sm sm:hidden"
          @click="() => toggleAuthModal('login')"
        >
          Login
        </button>
      </div>
    </section>
    <div
      id="login-button"
      :class="{ show: showUi }"
      class="absolute top-8 right-8 hidden sm:block"
    >
      <button
        class="px-6 py-2 font-bold text-md bg-slate-50 hover:bg-slate-200 border-[1px] border-slate-200 rounded-full transition-all drop-shadow-sm"
        @click="() => toggleAuthModal('login')"
      >
        Login
      </button>
    </div>
    <Transition name="fade">
      <Teleport to="body">
        <Register
          v-if="registerModal"
          @close="toggleAuthModal('register')"
        ></Register>
      </Teleport>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import Register from "../components/Register.vue";
import { ref, onMounted } from "vue";
import { useMainStore } from "../stores";
import { useRouter } from "vue-router";

const store = useMainStore();
const router = useRouter();

const chooseMode = (mode: "admin" | "user") => {
  store.setGameMode(mode);
  mode === "admin" ? router.push("/host") : router.push("/join");
};

const showUi = ref<boolean>(false);

const registerModal = ref<boolean>(false);
const loginModal = ref<boolean>(false);

const toggleAuthModal = (type: string) => {
  switch (type) {
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
