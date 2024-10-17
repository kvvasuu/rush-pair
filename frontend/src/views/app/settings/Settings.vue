<template>
  <div
    class="absolute top-16 flex flex-col items-center justify-start max-w-[666px] w-full h-[calc(100%-8rem)] pt-12 pb-8 overflow-auto"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="h-24"><UserAvatar></UserAvatar></div>

      <p class="text-neutral-300 font-semibold text-2xl mt-6 select-none">
        {{ authStore.name }}
      </p>
      <p class="text-neutral-500 text-sm select-none">
        {{ authStore.email }}
      </p>
    </div>
    <ol class="mt-8 rounded-lg w-4/5">
      <li>
        <RouterLink
          to="/app/settings/profile"
          class="flex items-center text-xl text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-800 hover:bg-neutral-700/50 relative rounded-t-lg"
          ><i class="fa-solid fa-user w-10 text-center"></i>
          <span class="px-1">Profile</span>

          <i class="fa-solid fa-angle-right ml-auto mr-3 text-neutral-500"></i>
          <div
            class="bottom-0 right-0 w-[calc(100%-54px)] h-[1px] bg-neutral-700 absolute"
          ></div>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/app/settings/profile"
          class="flex items-center text-xl text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-800 hover:bg-neutral-700/50 relative"
          ><i class="fa-solid fa-bell w-10 text-center"></i>
          <span class="px-1">Notifications</span>
          <i class="fa-solid fa-angle-right ml-auto mr-3 text-neutral-500"></i>
          <div
            class="bottom-0 right-0 w-[calc(100%-54px)] h-[1px] bg-neutral-700 absolute"
          ></div>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/app/settings/profile"
          class="flex items-center text-xl text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-800 hover:bg-neutral-700/50 relative"
          ><i class="fa-solid fa-eye w-10 text-center"></i>
          <span class="px-1">Apperance</span>
          <i class="fa-solid fa-angle-right ml-auto mr-3 text-neutral-500"></i>
          <div
            class="bottom-0 right-0 w-[calc(100%-54px)] h-[1px] bg-neutral-700 absolute"
          ></div>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/app/settings/profile"
          class="flex items-center text-xl text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-800 hover:bg-neutral-700/50 relative rounded-b-lg"
          ><i class="fa-solid fa-lock w-10 text-center"></i>
          <span class="px-1">Security</span>
          <i class="fa-solid fa-angle-right ml-auto mr-3 text-neutral-500"></i>
        </RouterLink>
      </li>
    </ol>
    <ol class="mt-auto rounded-lg overflow-hidden w-4/5 text-center">
      <li
        class="w-full p-3 text-red-500 cursor-pointer bg-neutral-800 hover:bg-neutral-700/50 transition-all"
        @click="logout"
      >
        Logout
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from "../../../components/containers/UserAvatar.vue";
import { useAuthStore } from "../../../stores/authStore";
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
};
</script>
