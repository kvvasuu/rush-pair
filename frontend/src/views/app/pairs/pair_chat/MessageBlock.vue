<template>
  <div class="w-full flex flex-col items-center justify-start group">
    <div
      v-if="showDate(index)"
      class="text-xs font-semibold text-neutral-500 select-none mb-2 mt-4"
    >
      {{ formatDate(new Date(message.date)) }}
    </div>
    <div class="w-full flex flex-col">
      <div
        class="w-full flex items-center"
        :class="[
          message.sender === userStore.id ? 'justify-end' : 'justify-start',
        ]"
      >
        <PairAvatar
          :pair="chatStore.pairInfo"
          class="w-8 h-8 mr-2 shrink-0 self-end"
          :class="[
            (chatStore.messages[index].sender === message.sender &&
              chatStore.messages[index + 1]?.sender !== message.sender) ||
            (chatStore.messages[index].sender === message.sender &&
              chatStore.messages[index - 1]?.sender !== message.sender)
              ? 'mb-2'
              : '',
          ]"
          :title="chatStore.pairInfo.name"
          v-if="showAvatar(message.sender, index)"
        ></PairAvatar>
        <div
          class="w-8 h-8 mr-2 shrink-0"
          v-else-if="message.sender !== userStore.id"
        ></div>

        <div
          class="flex items-center justify-center mr-1 h-10 w-10 opacity-0 group-hover:opacity-100 transition-all"
          v-if="
            message.sender === userStore.id &&
            !message?.isDeleted &&
            !message?.isRead
          "
        >
          <button
            class="rounded-full flex items-center justify-center h-8 w-8 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            title="Delete message"
            @click="emit('showDeleteModal', message)"
          >
            <i class="fa-solid fa-trash-can text-sm"></i>
          </button>
        </div>

        <div
          class="max-w-[85%] shadow-sm py-2 px-4 text-neutral-400 select-none"
          :class="
            computeMessageStyle(message.sender, index, message?.isDeleted)
          "
          title="Message deleted."
          v-if="message?.isDeleted"
        >
          Message deleted.
        </div>
        <div
          class="max-w-[85%] flex flex-col items-end"
          :title="formatDate(new Date(message.date))"
          v-else
        >
          <div
            class="whitespace-pre-wrap break-all shadow-sm py-2 px-4 dark:text-neutral-200 text-slate-800 break-words"
            :class="computeMessageStyle(message.sender, index)"
          >
            {{ message.content }}
          </div>
          <Transition name="pop-up-fast">
            <PairAvatar
              key="readIndicator"
              :pair="chatStore.pairInfo"
              class="w-3 h-3 mr-2 shrink-0 self-end"
              :class="index === 0 ? '-mt-1' : 'mt-1'"
              :title="`Message read: ${formatDate(new Date(chatStore.messages[0]?.readAt as unknown as Date))}`"
              v-if="showReadIndicator"
            ></PairAvatar>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "../../../../stores/chatStore";
import { useUserStore } from "../../../../stores/userStore";
import PairAvatar from "../../../../components/PairAvatar.vue";
import { computed } from "vue";

const props = defineProps(["message", "index"]);
const emit = defineEmits(["showDeleteModal"]);

const chatStore = useChatStore();
const userStore = useUserStore();

const formatDate = (date: Date) => {
  const dateNow = new Date();

  const isToday =
    dateNow.getDate() === date.getDate() &&
    dateNow.getMonth() === date.getMonth() &&
    dateNow.getFullYear() === date.getFullYear();

  const isThisWeek =
    dateNow.getFullYear() === date.getFullYear() &&
    dateNow.getMonth() === date.getMonth() &&
    Math.floor(dateNow.getDate() / 7) === Math.floor(date.getDate() / 7);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const dayOfWeek = days[date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (isToday) {
    return `${hours}:${minutes}`;
  }

  if (isThisWeek) {
    return `${dayOfWeek}, ${hours}:${minutes}`;
  }

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

const showDate = (index: number) => {
  if (index === chatStore.messages.length - 1) return true;
  if (chatStore.messages) {
    return calculateDateBetween(
      chatStore.messages[index].date,
      chatStore.messages[index + 1].date
    );
  }
};

const calculateDateBetween = (prev: string = "0", next: string = "0") => {
  const prevDate = new Date(prev).getTime();
  const nextDate = new Date(next).getTime();

  const timeDifference = (prevDate - nextDate) / 60000;
  return Math.abs(timeDifference) > 10;
};

const computeMessageStyle = (
  sender: string,
  index: number,
  isDeleted: boolean = false
) => {
  if (chatStore.messages) {
    let style = "";

    const isDateAbove = calculateDateBetween(
      chatStore.messages[index]?.date,
      chatStore.messages[index + 1]?.date
    );
    const isDateBelow = calculateDateBetween(
      chatStore.messages[index]?.date,
      chatStore.messages[index - 1]?.date
    );

    if (sender === userStore.id) {
      isDeleted
        ? (style += "bg-neutral-100 dark:bg-neutral-800 rounded-l-3xl ")
        : (style += "bg-rose-300 dark:bg-rose-500/20 rounded-l-3xl ");

      if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index + 1]?.sender !== sender &&
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index - 1]?.sender !== sender
      ) {
        style += "rounded-3xl mb-2 ";
      } else if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index + 1]?.sender !== sender
      ) {
        if (isDateBelow) {
          style += "rounded-t-3xl rounded-b-3xl ";
        } else {
          style += "rounded-t-3xl rounded-l-3xl rounded-br ";
        }
      } else if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index - 1]?.sender !== sender
      ) {
        isDateAbove
          ? (style += "rounded-3xl ")
          : (style += "rounded-b-3xl rounded-l-3xl rounded-tr mb-2 ");
      } else {
        if (isDateAbove && isDateBelow) {
          style += "rounded-t-3xl rounded-b-3xl ";
        } else if (isDateBelow) {
          style += "rounded-b-3xl rounded-tr ";
        } else if (isDateAbove) {
          style += "rounded-t-3xl rounded-br ";
        } else if (!isDateAbove && !isDateBelow) {
          style += "rounded-r ";
        }
      }
    } else {
      style += "bg-blue-200 dark:bg-blue-600/20 rounded-r-3xl ";

      if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index + 1]?.sender !== sender &&
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index - 1]?.sender !== sender
      ) {
        style += "rounded-3xl mb-2 ";
      } else if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index + 1]?.sender !== sender
      ) {
        if (isDateBelow) {
          style += "rounded-t-3xl rounded-b-3xl ";
        } else {
          style += "rounded-t-3xl rounded-r-3xl rounded-bl ";
        }
      } else if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index - 1]?.sender !== sender
      ) {
        isDateAbove
          ? (style += "rounded-3xl ")
          : (style += "rounded-b-3xl rounded-r-3xl rounded-tl mb-2 ");
      } else {
        if (isDateAbove && isDateBelow) {
          style += "rounded-t-3xl rounded-b-3xl ";
        } else if (isDateBelow) {
          style += "rounded-b-3xl rounded-tl ";
        } else if (isDateAbove) {
          style += "rounded-t-3xl rounded-bl ";
        } else if (!isDateAbove && !isDateBelow) {
          style += "rounded-l ";
        }
      }
    }

    return style;
  }
};

const showAvatar = (sender: string, index: number) => {
  if (chatStore.messages) {
    const isDateBelow = calculateDateBetween(
      chatStore.messages[index]?.date,
      chatStore.messages[index - 1]?.date
    );
    return (
      (sender === chatStore.pairInfo.id &&
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index - 1]?.sender !== sender) ||
      (sender === chatStore.pairInfo.id && isDateBelow)
    );
  }
};

const showReadIndicator = computed(() => {
  const lastReadIndex = chatStore.messages
    .map((msg, index) => ({ isRead: msg.isRead, index }))
    .find((msg) => msg.isRead)?.index;
  return lastReadIndex === props.index && props.message.sender === userStore.id;
});
</script>
