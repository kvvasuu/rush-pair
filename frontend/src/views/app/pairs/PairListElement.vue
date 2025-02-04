<template>
  <li
    class="w-full h-24 px-6 py-3 flex items-center justify-start cursor-pointer rounded-md hover:bg-slate-100/50 dark:hover:bg-neutral-800/75 transition-all relative group"
    @click="goToPair"
    :title="`${pair.name}, ${t('pairs.pairedAt')}: ${pairedAt}`"
    v-if="!pair.isBlocked"
  >
    <div class="relative">
      <PairAvatar
        :pair="pair"
        :key="pair.imageUrl"
        :is-active="pair.isActive"
        class="min-w-[72px] max-w-[72px]"
      ></PairAvatar>
      <div
        v-if="!!pair.unreadMessagesCount"
        class="absolute right-0 top-0 h-6 min-w-6 px-1 flex items-center justify-center text-xs font-semibold text-neutral-100 rounded-full bg-rose-500 shadow"
        :title="
          pair.unreadMessagesCount
            ? t('general.unreadMessages', {
                count: pair.unreadMessagesCount,
              })
            : pair?.name
        "
      >
        {{ pair.unreadMessagesCount < 100 ? pair.unreadMessagesCount : "99+" }}
      </div>
    </div>

    <div class="h-full flex flex-col items-start justify-center mr-4 min-w-0">
      <p
        class="pl-6 text-lg font-semibold text-slate-700 dark:text-neutral-300 select-none w-full truncate min-w-0"
      >
        <span v-html="highlightMatch(pair.name)"></span>
      </p>

      <p class="px-6 text-sm text-slate-600 dark:text-neutral-500 select-none">
        {{ pairedAt }}
      </p>
    </div>
    <i
      class="ml-auto mr-0 fa-solid fa-masks-theater text-3xl text-slate-400 dark:text-neutral-500 group-hover:text-slate-500/75 dark:group-hover:text-neutral-400/90 group-hover:rotate-6 transition-all duration-300"
      :title="t('pairs.anonymous')"
      v-if="!pair.isVisible && !pair.askedForReveal"
    ></i>
    <i
      class="ml-auto mr-0 fa-solid fa-eye text-3xl text-slate-400 dark:text-neutral-500 group-hover:text-slate-500/75 dark:group-hover:text-neutral-400/90 group-hover:rotate-6 transition-all duration-300"
      :title="t('pairs.askedForReveal')"
      v-else-if="!pair.isVisible && pair.askedForReveal"
    ></i>
  </li>
  <li
    class="w-full h-24 px-6 py-3 flex items-center justify-start cursor-pointer rounded-md hover:bg-slate-100/50 dark:hover:bg-neutral-800/75 transition-all relative group"
    @click="goToPair"
    v-else
  >
    <div class="relative">
      <PairAvatar class="min-w-[72px] max-w-[72px]"></PairAvatar>
    </div>

    <div class="h-full flex flex-col items-start justify-center mr-4 min-w-0">
      <p
        class="pl-6 text-lg font-semibold text-slate-700 dark:text-neutral-300 select-none w-full truncate min-w-0"
      >
        <span>{{ pair.name }}</span>
      </p>

      <p class="px-6 text-sm text-slate-600 dark:text-neutral-500 select-none">
        You can no longer chat with this user.
      </p>
    </div>
    <i
      class="ml-auto mr-0 fa-solid fa-ban text-3xl text-slate-400 dark:text-neutral-500 group-hover:text-slate-500/75 dark:group-hover:text-neutral-400/90 group-hover:rotate-6 transition-all duration-300"
    ></i>
  </li>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import PairAvatar from "../../../components/PairAvatar.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps(["pair", "searchValue"]);

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

const highlightMatch = (text: string) => {
  if (!props.searchValue || props.searchValue.length < 2) return text;
  const queryRegex = new RegExp(
    `(${props.searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(
    queryRegex,
    `<strong class="font-bold text-rose-500 dark:text-rose-400 bg-neutral-500/20">$1</strong>`
  );
};
</script>
