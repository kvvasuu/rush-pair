<template>
  <li
    class="w-full h-24 px-6 py-3 flex items-center justify-start cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800/75 transition-all relative"
    @click="goToPair"
    :title="`${pair.name}, paired at: ${pairedAt}`"
  >
    <PairAvatar :pair="pair" class="min-w-[72px] max-w-[72px]"></PairAvatar>
    <div
      class="w-full h-full flex flex-col items-start justify-center whitespace-nowrap"
    >
      <div class="flex items-end justify-start w-full">
        <input
          type="text"
          v-model="name"
          class="ml-6 h-8 text-lg font-semibold text-slate-700 dark:text-neutral-300 select-none bg-transparent border-b-[1px] border-neutral-400 dark:border-neutral-500 outline-none"
          v-if="isEditingNickname"
        />
        <p
          class="pl-6 flex items-center h-8 text-lg font-semibold text-slate-700 dark:text-neutral-300 select-none"
          v-else
        >
          {{ name }}
        </p>
        <button
          class="ml-2 text-slate-400 dark:text-neutral-500 group"
          title="Edit nickname"
          @click.stop="
            () => (isEditingNickname ? saveNickname() : editNickname())
          "
          v-if="
            !currentlyEditedNicknameId || currentlyEditedNicknameId === pair.id
          "
        >
          <i
            class="fa-solid fa-pencil flex items-center justify-center h-8 w-8 rounded-full group-hover:bg-neutral-400/10 dark:group-hover:text-neutral-400 transition-all"
            v-if="!isEditingNickname"
          ></i>
          <i
            class="fa-solid fa-xmark flex text-rose-500 items-center justify-center h-8 w-8 rounded-full"
            v-else-if="name.length <= 0"
          ></i>
          <i
            class="fa-solid fa-check flex items-center justify-center h-8 w-8 rounded-full group-hover:bg-neutral-400/10 dark:group-hover:text-neutral-400 transition-all"
            v-else
          ></i>
        </button>
      </div>

      <p
        class="w-full px-6 text-sm text-slate-600 dark:text-neutral-500 select-none"
      >
        {{ pairedAt }}
      </p>
    </div>
    <i
      class="fa-solid fa-masks-theater text-3xl text-slate-400 dark:text-neutral-500"
      v-if="!pair.isVisible"
    ></i>
  </li>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import PairAvatar from "../../../components/PairAvatar.vue";

const props = defineProps(["pair", "currentlyEditedNicknameId"]);

const emit = defineEmits(["editedNicknameId"]);

const router = useRouter();

const goToPair = () => {
  if (!props.currentlyEditedNicknameId)
    router.push(`/app/pairs/${props.pair.id}`);
};

const pairedAt = computed(() => {
  const date = new Date(props.pair.pairedAt * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
});

const name = ref(props.pair.name || "Anonymous user");

const isEditingNickname = ref(false);

const editNickname = () => {
  emit("editedNicknameId", props.pair.id);
  isEditingNickname.value = true;
};

const saveNickname = () => {
  if (name.value.length <= 0) {
    return;
  }
  emit("editedNicknameId", "");
  isEditingNickname.value = false;
};
</script>
