<template>
  <div
    class="absolute top-16 flex flex-col items-center justify-start max-w-[666px] w-full h-[calc(100%-8rem)] pt-12 pb-8 overflow-auto"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="h-24"><UserAvatar></UserAvatar></div>

      <p
        class="text-slate-700 dark:text-neutral-300 font-semibold text-2xl mt-6 select-none"
      >
        {{ userStore.name }}
      </p>
      <p class="text-slate-600 dark:text-neutral-500 text-sm select-none">
        {{ userStore.email }}
      </p>
    </div>
    <ol class="mt-8 mb-6 rounded-lg w-4/5">
      <li>
        <RouterLink
          to="/app/settings/profile"
          class="flex items-center text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative rounded-t-lg"
          ><i class="fa-solid fa-user w-10 text-center"></i>
          <span class="px-1 select-none">Profile</span>

          <i
            class="fa-solid fa-angle-right ml-auto mr-3 text-neutral-600 dark:text-neutral-500"
          ></i>
          <div
            class="bottom-0 right-0 w-[calc(100%-54px)] h-[1px] bg-neutral-200 dark:bg-neutral-700 absolute"
          ></div>
        </RouterLink>
      </li>
      <label
        class="flex items-center text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative cursor-pointer"
      >
        <i class="fa-solid fa-bell w-10 text-center"></i>
        <span class="px-1 select-none">Notifications</span>

        <input
          type="checkbox"
          value=""
          class="sr-only peer"
          checked
          v-model="notifications"
          @change="changeNotifications"
          id="notifications-toggle"
        />

        <div
          class="absolute right-4 w-11 h-6 bg-neutral-300 dark:bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-neutral-100 after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-neutral-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-700"
        ></div>
        <div
          class="bottom-0 right-0 w-[calc(100%-54px)] h-[1px] bg-neutral-200 dark:bg-neutral-700 absolute"
        ></div>
      </label>
      <label
        class="flex items-center text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative cursor-pointer"
      >
        <i class="fa-solid fa-eye w-10 text-center"></i>
        <span class="px-1 select-none">Theme</span>

        <input
          type="checkbox"
          value=""
          class="sr-only peer"
          v-model="theme"
          @change="changeTheme"
          true-value="dark"
          false-value="light"
          id="theme-toggle"
        />
        <div
          class="absolute right-4 w-11 h-6 bg-neutral-300 dark:bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-yellow-600 peer-checked:after:bg-yellow-500 after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-neutral-100 dark:after:bg-yellow-500/80 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"
        ></div>

        <div
          class="bottom-0 right-0 w-[calc(100%-54px)] h-[1px] bg-neutral-200 dark:bg-neutral-700 absolute"
        ></div>
      </label>
      <li>
        <RouterLink
          to="/app/settings/security"
          class="flex items-center text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative rounded-b-lg"
          ><i class="fa-solid fa-lock w-10 text-center"></i>
          <span class="px-1 select-none">Security</span>
          <i
            class="fa-solid fa-angle-right ml-auto mr-3 text-neutral-600 dark:text-neutral-500"
          ></i>
        </RouterLink>
      </li>
    </ol>
    <button
      class="mt-auto rounded-lg overflow-hidden min-h-[52px] w-4/5 flex items-center justify-center text-center p-3 text-red-500 font-semibold cursor-pointer bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 transition-all"
      @click="logout"
    >
      <div class="relative">
        <i
          class="fa-solid fa-arrow-right-from-bracket rotate-180 absolute h-full flex items-center -left-6 top-0"
        ></i>
        <span>Logout</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UserAvatar from "../../../components/UserAvatar.vue";
import { useUserStore } from "../../../stores/userStore";

const userStore = useUserStore();

const notifications = ref(userStore.settings.notifications);
const changeNotifications = async () => {
  try {
    await userStore.changeSettings({
      notifications: !userStore.settings.notifications,
    });
  } catch {}
};

const theme = ref(userStore.settings.theme);

const changeTheme = async () => {
  try {
    document.documentElement.setAttribute("data-theme", theme.value);
    await userStore.changeSettings({
      theme: theme.value,
    });
  } catch {}
};

const logout = () => {
  userStore.logout();
};
</script>
