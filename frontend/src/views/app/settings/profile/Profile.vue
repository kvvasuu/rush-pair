<template>
  <div
    class="absolute top-0 pt-20 flex flex-col items-center justify-start w-full h-[calc(100%-4rem)] md:h-full overflow-y-auto"
  >
    <div
      class="flex flex-col items-center justify-center group cursor-pointer max-w-[666px]"
      @click="toggleImageChangeOverlay"
    >
      <div class="h-24 relative">
        <UserAvatar :key="imageKey"></UserAvatar>
        <div
          class="bg-amber-400 rounded-full h-8 w-8 bottom-0 right-0 absolute flex items-center justify-center group-hover:bg-yellow-400 transition-all"
        >
          <i class="fa-solid fa-camera text-neutral-700"></i>
        </div>
      </div>
      <p class="text-neutral-600 dark:text-neutral-400 mt-4">
        {{ t("settings.changeImage") }}
      </p>
    </div>
    <ol class="mt-8 rounded-lg w-4/5 max-w-[666px]">
      <li class="relative">
        <input
          id="name"
          type="text"
          class="text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-600 rounded-t-lg"
          autocomplete="off"
          v-model="details.name"
          required
          :placeholder="t('general.required')"
        />
        <label
          for="name"
          class="absolute left-5 h-full flex items-center top-0 text-neutral-500 dark:text-neutral-400 text-xl"
          >{{ t("general.name") }}</label
        >

        <div
          class="bottom-0 right-0 w-[calc(100%-22px)] h-[1px] bg-neutral-200 dark:bg-neutral-700 absolute"
        ></div>
      </li>
      <li
        class="select-none text-xl text-neutral-500 dark:text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-50 dark:bg-neutral-800 relative"
      >
        <span
          class="absolute left-5 h-full flex items-center top-0 text-neutral-500 dark:text-neutral-400 text-xl"
          >{{ t("general.gender") }}</span
        >
        <p class="capitalize text-neutral-600 dark:text-neutral-400">
          {{ t("general." + details.gender) }}
        </p>
        <div
          class="bottom-0 right-0 w-[calc(100%-22px)] h-[1px] bg-neutral-200 dark:bg-neutral-700 absolute"
        ></div>
      </li>

      <li class="relative">
        <input
          id="birthdate"
          type="date"
          class="text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-600 rounded-b-lg cursor-pointer"
          autocomplete="off"
          v-model="details.birthdate"
          min="1920-01-01"
          max="2008-01-01"
          ref="birthdateInputRef"
          @focus="birthdateInputRef.showPicker()"
        />
        <label
          for="birthdate"
          class="absolute left-5 h-full flex items-center top-0 text-neutral-500 dark:text-neutral-400 text-xl"
          >{{ t("general.birthdate") }}</label
        >
      </li>
    </ol>

    <ol class="mt-8 rounded-lg w-4/5 max-w-[666px]">
      <li class="relative">
        <input
          id="country"
          type="text"
          class="text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-600 rounded-t-lg"
          autocomplete="off"
          v-model="details.country"
          :placeholder="t('general.required')"
        />
        <label
          for="name"
          class="absolute left-5 h-full flex items-center top-0 text-neutral-500 dark:text-neutral-400 text-xl"
          >{{ t("general.country") }}</label
        >

        <div
          class="bottom-0 right-0 w-[calc(100%-22px)] h-[1px] bg-neutral-200 dark:bg-neutral-700 absolute"
        ></div>
      </li>
      <li class="relative">
        <input
          id="city"
          type="text"
          class="text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
          autocomplete="off"
          v-model="details.city"
          :placeholder="t('general.optional')"
        />
        <label
          for="name"
          class="absolute left-5 h-full flex items-center top-0 text-neutral-500 dark:text-neutral-400 text-xl"
          >{{ t("general.city") }}</label
        >

        <div
          class="bottom-0 right-0 w-[calc(100%-22px)] h-[1px] bg-neutral-200 dark:bg-neutral-700 absolute"
        ></div>
      </li>

      <li class="relative">
        <input
          id="phone-number"
          type="text"
          class="text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 pl-32 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-600 rounded-b-lg"
          autocomplete="off"
          v-model="details.phoneNumber"
          :placeholder="t('general.optional')"
        />
        <label
          for="name"
          class="absolute left-5 h-full flex items-center top-0 text-neutral-500 dark:text-neutral-400 text-xl"
          >{{ t("general.phoneNumber") }}</label
        >
      </li>
    </ol>

    <div class="relative mt-8 rounded-lg w-4/5 max-w-[666px]">
      <textarea
        id="description"
        type="text"
        class="text-xl text-neutral-600 dark:text-neutral-400 transition-all w-full p-3 px-5 bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50 relative outline-none placeholder:text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-600 rounded-lg resize-none"
        autocomplete="off"
        v-model="details.description"
        :placeholder="t('settings.tellAboutYourself')"
        rows="8"
      >
      </textarea>
    </div>

    <button
      class="my-12 select-none rounded-lg py-3 px-8 text-xl text-neutral-50 dark:text-neutral-300 bg-blue-600 hover:bg-blue-500 dark:bg-blue-800 dark:hover:bg-blue-700 transition-all"
      :disabled="!isSavePossible"
      :class="{
        'opacity-25 hover:bg-blue-600 dark:hover:bg-blue-800 cursor-auto':
          !isSavePossible,
      }"
      @click="saveDetails"
    >
      {{ t("general.save") }}
    </button>
    <Transition name="fade" mode="out-in">
      <Teleport to="body">
        <ImageChangeOverlay
          v-if="imageChangeOverlay"
          @close="toggleImageChangeOverlay"
        ></ImageChangeOverlay>
      </Teleport>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import UserAvatar from "../../../../components/UserAvatar.vue";
import { useUserStore } from "../../../../stores/userStore";
import { useMainStore } from "../../../../stores";
import ImageChangeOverlay from "./ImageChangeOverlay.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const mainStore = useMainStore();
const userStore = useUserStore();

const details = reactive({
  name: userStore.name,
  birthdate: userStore.birthdate,
  phoneNumber: userStore.phoneNumber,
  city: userStore.city,
  country: userStore.country,
  gender: userStore.gender,
  description: userStore.description,
});

const birthdateInputRef = ref();

const imageKey = ref(0);

const isSavePossible = computed(() => {
  return (
    details.name !== userStore.name ||
    details.birthdate !== userStore.birthdate ||
    details.city !== userStore.city ||
    details.country !== userStore.country ||
    details.description !== userStore.description ||
    (details.phoneNumber !== userStore.phoneNumber &&
      !!details.name &&
      !!details.birthdate &&
      !mainStore.isLoading &&
      (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/gi.test(
        details.phoneNumber
      ) ||
        details.phoneNumber == ""))
  );
});

const saveDetails = async () => {
  await userStore
    .updateUser({ ...details })
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
};

const imageChangeOverlay = ref(false);
const toggleImageChangeOverlay = () => {
  imageChangeOverlay.value && imageKey.value++;
  imageChangeOverlay.value = !imageChangeOverlay.value;
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
