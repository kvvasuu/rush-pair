<template>
  <li
    class="w-full h-24 px-6 py-3 flex items-center justify-start cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800/75 transition-all relative"
    @click="goToPair"
    :title="`${pair.name}, paired at: ${pairedAt}`"
  >
    <PairAvatar :pair="pair" class="min-w-[72px] max-w-[72px]"></PairAvatar>
    <div
      class="h-full flex flex-col items-start justify-center whitespace-nowrap"
    >
      <p
        class="pl-6 flex items-center text-lg font-semibold text-slate-700 dark:text-neutral-300 select-none"
      >
        {{ pair.name }}
      </p>

      <p
        class="w-full px-6 text-sm text-slate-600 dark:text-neutral-500 select-none"
      >
        {{ pairedAt }}
      </p>
    </div>
    <i
      class="ml-auto mr-0 fa-solid fa-masks-theater text-3xl text-slate-400 dark:text-neutral-500"
      title="Anonymous"
      v-if="!pair.isVisible"
    ></i>
  </li>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import PairAvatar from "../../../components/PairAvatar.vue";

const props = defineProps(["pair"]);

const router = useRouter();

const goToPair = () => {
  router.push(`/app/pairs/${props.pair.id}`);
};

const pairedAt = computed(() => {
  const date = new Date(props.pair.pairedAt * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
});
</script>
