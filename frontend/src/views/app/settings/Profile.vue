<template>
  <div
    class="absolute top-16 flex flex-col items-center justify-start max-w-[666px] w-full h-[calc(100%-8rem)] py-12"
  >
    <div class="flex flex-col items-center justify-center group cursor-pointer">
      <div class="h-24 relative">
        <UserAvatar></UserAvatar>
        <div
          class="bg-amber-400 rounded-full h-8 w-8 bottom-0 right-0 absolute flex items-center justify-center group-hover:bg-yellow-400 transition-all"
        >
          <i class="fa-solid fa-pencil"></i>
        </div>
      </div>
      <p class="text-neutral-400 mt-4">Change image</p>
    </div>
    <ol class="mt-8 rounded-lg overflow-hidden w-4/5">
      <li class="relative">
        <input
          id="name"
          type="text"
          class="text-xl text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-800 hover:bg-neutral-700/50 relative outline-none cursor-pointer placeholder:text-base placeholder:text-neutral-600"
          autocomplete="off"
          v-model="details.name"
          required
          placeholder="Required"
        />
        <label
          for="name"
          class="absolute left-5 h-full flex items-center top-0 text-neutral-400 text-xl"
          >Name</label
        >

        <div
          class="bottom-0 right-0 w-[calc(100%-22px)] h-[1px] bg-neutral-700 absolute"
        ></div>
      </li>
      <li
        class="select-none text-xl text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-800 relative"
      >
        <span
          class="absolute left-5 h-full flex items-center top-0 text-neutral-400 text-xl"
          >Gender</span
        >
        <p class="capitalize">{{ details.gender }}</p>
        <div
          class="bottom-0 right-0 w-[calc(100%-22px)] h-[1px] bg-neutral-700 absolute"
        ></div>
      </li>

      <li class="relative">
        <input
          id="birthdate"
          type="date"
          class="text-xl text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-800 hover:bg-neutral-700/50 relative outline-none cursor-pointer"
          autocomplete="off"
          v-model="details.birthdate"
          min="1920-01-01"
          max="2008-01-01"
          ref="birthdateInputRef"
          @focus="birthdateInputRef.showPicker()"
        />
        <label
          for="birthdate"
          class="absolute left-5 h-full flex items-center top-0 text-neutral-400 text-xl"
          >Birthdate</label
        >
      </li>
    </ol>

    <ol class="mt-8 rounded-lg overflow-hidden w-4/5">
      <li class="relative">
        <input
          id="country"
          type="text"
          class="text-xl text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-800 hover:bg-neutral-700/50 relative outline-none cursor-pointer placeholder:text-base placeholder:text-neutral-600"
          autocomplete="off"
          v-model="details.country"
          placeholder="Optional"
        />
        <label
          for="name"
          class="absolute left-5 h-full flex items-center top-0 text-neutral-400 text-xl"
          >Country</label
        >

        <div
          class="bottom-0 right-0 w-[calc(100%-22px)] h-[1px] bg-neutral-700 absolute"
        ></div>
      </li>
      <li class="relative">
        <input
          id="city"
          type="text"
          class="text-xl text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-800 hover:bg-neutral-700/50 relative outline-none cursor-pointer placeholder:text-base placeholder:text-neutral-600"
          autocomplete="off"
          v-model="details.city"
          placeholder="Optional"
        />
        <label
          for="name"
          class="absolute left-5 h-full flex items-center top-0 text-neutral-400 text-xl"
          >City</label
        >

        <div
          class="bottom-0 right-0 w-[calc(100%-22px)] h-[1px] bg-neutral-700 absolute"
        ></div>
      </li>

      <li class="relative">
        <input
          id="phone-number"
          type="text"
          class="text-xl text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-800 hover:bg-neutral-700/50 relative outline-none cursor-pointer placeholder:text-base placeholder:text-neutral-600"
          autocomplete="off"
          v-model="details.phoneNumber"
          placeholder="Optional"
        />
        <label
          for="name"
          class="absolute left-5 h-full flex items-center top-0 text-neutral-400 text-xl"
          >Phone</label
        >
      </li>
    </ol>
    <button
      class="mt-12 rounded-lg py-3 px-8 text-xl text-neutral-400 bg-neutral-800 hover:bg-neutral-700/50"
      :disabled="!isSavePossible"
      :class="{
        'opacity-50 hover:bg-neutral-800 cursor-auto text-neutral-600':
          !isSavePossible,
      }"
      @click="saveDetails"
    >
      Save
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import UserAvatar from "../../../components/containers/UserAvatar.vue";
import { useAuthStore } from "../../../stores/authStore";

const authStore = useAuthStore();

const details = reactive({ ...authStore.$state });

const birthdateInputRef = ref();

const isSavePossible = computed(() => {
  return (
    JSON.stringify(details) !== JSON.stringify(authStore.$state) &&
    !!details.name &&
    !!details.birthdate
  );
});

const saveDetails = async () => {
  await authStore
    .updateUser({ ...details })
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  color: transparent;
}
</style>
