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
      <label
        class="flex items-center text-xl text-neutral-400 transition-all w-full p-3 px-2 bg-neutral-800 hover:bg-neutral-700/50 relative cursor-pointer"
      >
        <i class="fa-solid fa-bell w-10 text-center"></i>
        <span class="px-1">Notifications</span>

        <input
          type="checkbox"
          value=""
          class="sr-only peer"
          checked
          @change="changeNotifications"
        />
        <div
          role="status"
          class="flex items-center justify-center absolute right-4 h-full top-0"
          v-if="notificationsLoading"
        >
          <svg
            aria-hidden="true"
            class="w-6 h-6 text-gray-200 animate-spin fill-gray-500"
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
        <div
          v-else
          class="absolute right-4 w-11 h-6 bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-neutral-100 after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-neutral-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-700"
        ></div>
        <div
          class="bottom-0 right-0 w-[calc(100%-54px)] h-[1px] bg-neutral-700 absolute"
        ></div>
      </label>
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
import { ref } from "vue";
import UserAvatar from "../../../components/containers/UserAvatar.vue";
import { useAuthStore } from "../../../stores/authStore";
import { useSettingsStore } from "../../../stores/settingsStore";

const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const notificationsLoading = ref(false);
const changeNotifications = async () => {
  notificationsLoading.value = true;
  try {
    const res = await settingsStore.changeSettings({
      notifications: !settingsStore.settings.notifications,
    });
    console.log(res);
  } catch (err) {
    console.error(err);
  } finally {
    notificationsLoading.value = false;
  }
};

const logout = () => {
  authStore.logout();
};
</script>
