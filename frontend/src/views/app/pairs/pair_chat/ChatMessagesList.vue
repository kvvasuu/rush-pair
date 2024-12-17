<template>
  <div
    class="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col-reverse px-1 md:px-4 pb-4 pt-6 gap-1"
    ref="messagesContainer"
  >
    <div
      class="px-4 sm:px-0 w-full flex flex-col items-center justify-center gap-3 text-center mt-6"
      v-if="!chatStore.isLoading && showSampleMessage()"
    >
      <p
        class="text-xs text-neutral-500 select-none"
        v-if="chatStore?.messages?.length === 0"
      >
        Why not start by saying 'Hi' or use the button below to ask something
        interesting, or roll for a random message!
      </p>
      <p class="text-xs text-neutral-500 select-none" v-else>
        Long time no see! It's been a while since we last chatted. Ready to
        catch up?
      </p>
      <div class="flex gap-1 items-center">
        <button
          class="rounded-3xl flex-grow-0 shadow-sm py-2 px-3 bg-slate-100 hover:bg-slate-100/50 dark:bg-neutral-800/80 dark:hover:bg-neutral-800/50 group transition-all"
          title="Roll the dice!"
          @click="getRandomSampleMessage"
        >
          <i
            class="fa-solid fa-dice text-rose-500 group-hover:text-rose-600 group-hover:-rotate-12 group-hover:scale-105 transition-all"
          ></i>
        </button>
        <button
          class="rounded-3xl shadow-sm py-2 px-6 bg-slate-100 hover:bg-slate-100/50 dark:bg-neutral-800/80 dark:hover:bg-neutral-800/50 text-slate-800 dark:text-neutral-400 transition-all"
          :title="sampleMessage"
          @click="emit('sendSampleMessage', sampleMessage)"
        >
          {{ sampleMessage }}
        </button>
      </div>
    </div>

    <TransitionGroup name="list">
      <div
        class="rounded-3xl ml-10 mt-2 flex items-center justify-center self-start shadow-sm py-2 w-16 bg-neutral-100 dark:bg-neutral-800"
        :class="{
          'absolute z-10 bottom-4 left-[calc(50%-2rem)] ml-0 mt-0':
            showScrollButton,
        }"
        v-if="chatStore.isTyping"
        key="typing"
      >
        <div class="dot bg-neutral-400 dark:bg-neutral-500 rounded-full"></div>
        <div class="dot bg-neutral-400 dark:bg-neutral-500 rounded-full"></div>
        <div class="dot bg-neutral-400 dark:bg-neutral-500 rounded-full"></div>
      </div>

      <div
        v-for="(message, index) in chatStore.messages"
        class="w-full flex flex-col items-center justify-start msg"
        :key="message.date"
      >
        <div
          v-if="showDate(index)"
          class="text-xs font-semibold text-neutral-500 select-none mb-2 mt-4"
        >
          {{ formatDate(new Date(message.date)) }}
        </div>
        <div
          class="max-w-[85%] flex items-end justify-start msg-inner"
          :class="[message.sender === userStore.id ? 'self-end' : 'self-start']"
        >
          <PairAvatar
            :pair="chatStore.pairInfo"
            class="w-8 h-8 mr-2 shrink-0"
            :title="chatStore.pairInfo.name"
            v-if="showAvatar(message.sender, index)"
          ></PairAvatar>
          <div class="w-8 h-8 mr-2 shrink-0" v-else></div>
          <div
            class="shadow-sm py-2 px-4 dark:text-neutral-200 text-slate-800"
            :class="computeMessageStyle(message.sender, index)"
            :title="formatDate(new Date(message.date))"
          >
            {{ message.content }}
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
  <Transition name="fade">
    <button
      class="absolute left-[calc(50%-2rem)] w-16 h-16 flex items-center justify-center text-rose-500/60 hover:text-rose-500 transition-all drop-shadow-2xl"
      :class="[chatStore.isTyping ? 'bottom-14' : 'bottom-6']"
      v-if="showScrollButton"
      @click="scrollToBottom"
    >
      <p
        class="absolute -top-6 w-96 font-semibold"
        v-if="!!chatStore.pairInfo.unreadMessagesCount"
      >
        You have {{ chatStore.pairInfo.unreadMessagesCount }} new messages
      </p>
      <i class="fa-solid fa-circle-chevron-down text-[3rem]"></i>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { useChatStore } from "../../../../stores/chatStore";
import { useUserStore } from "../../../../stores/userStore";
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import PairAvatar from "../../../../components/PairAvatar.vue";

const emit = defineEmits(["sendSampleMessage"]);

const chatStore = useChatStore();
const userStore = useUserStore();

const messagesContainer = ref<HTMLDivElement | null>(null);

const sampleMessages = [
  "Hi there! How's your day going?",
  "What's your favorite hobby?",
  "Have you read any good books lately?",
  "What kind of music do you listen to?",
  "Tell me about your dream vacation destination!",
  "Do you like coffee or tea?",
  "What's something interesting about you?",
  "If you could have dinner with anyone, dead or alive, who would it be?",
  "What's your favorite type of movie?",
  "Do you prefer cats or dogs?",
  "What's one thing you've always wanted to try but haven't yet?",
  "What do you do for fun?",
  "How do you like to spend your weekends?",
  "What's your go-to comfort food?",
  "If you could visit any country in the world, where would you go?",
  "What's the best concert you've ever been to?",
  "Do you enjoy cooking? What's your signature dish?",
  "Do you have a favorite quote or saying?",
  "What's the last movie or TV show you watched?",
  "Do you believe in aliens?",
  "What's your biggest fear?",
  "What's your ideal way to relax after a long day?",
  "What's something you're really proud of?",
  "If you could live anywhere in the world, where would it be?",
  "What's your favorite season of the year?",
  "What kind of sports do you enjoy?",
  "Do you have any pets? Tell me about them!",
  "What's your favorite video game?",
  "What's the most adventurous thing you've done?",
  "Have you ever met anyone famous?",
];
const sampleMessage = ref("");
const getRandomSampleMessage = () => {
  const messageIndex = Math.floor(Math.random() * sampleMessages.length);
  sampleMessage.value = sampleMessages[messageIndex];
};

const showSampleMessage = (): boolean => {
  if (chatStore?.messages?.length === 0) return true;

  const dateNow = new Date().getTime();
  const lastMessageDate = new Date(chatStore?.messages[0]?.date).getTime();

  const timeDifference = (dateNow - lastMessageDate) / 86400000;
  return timeDifference >= 3;
};

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

const computeMessageStyle = (sender: string, index: number) => {
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
      style += "bg-rose-300 dark:bg-rose-500/20 rounded-l-3xl ";

      if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index + 1]?.sender !== sender &&
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index - 1]?.sender !== sender
      ) {
        style += "rounded-3xl ";
      } else if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index + 1]?.sender !== sender
      ) {
        style += "rounded-t-3xl rounded-l-3xl rounded-br ";
      } else if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index - 1]?.sender !== sender
      ) {
        isDateAbove
          ? (style += "rounded-3xl ")
          : (style += "rounded-b-3xl rounded-l-3xl rounded-tr ");
      } else {
        if (isDateBelow) {
          style += "rounded-b-3xl ";
        }
        if (isDateAbove) {
          style += "rounded-t-3xl ";
        }
        if (!isDateAbove && !isDateBelow) {
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
        style += "rounded-3xl ";
      } else if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index + 1]?.sender !== sender
      ) {
        style += "rounded-t-3xl rounded-r-3xl rounded-bl ";
      } else if (
        chatStore.messages[index].sender === sender &&
        chatStore.messages[index - 1]?.sender !== sender
      ) {
        isDateAbove
          ? (style += "rounded-3xl ")
          : (style += "rounded-b-3xl rounded-r-3xl rounded-tl ");
      } else {
        if (isDateBelow) {
          style += "rounded-b-3xl ";
        }
        if (isDateAbove) {
          style += "rounded-t-3xl ";
        }
        if (!isDateAbove && !isDateBelow) {
          style += "rounded-l ";
        }
      }
    }

    return style;
  }
};

const showAvatar = (sender: string, index: number) => {
  if (chatStore.messages) {
    if (
      sender === chatStore.pairInfo.id &&
      chatStore.messages[index].sender === sender &&
      chatStore.messages[index - 1]?.sender !== sender
    ) {
      return true;
    }
  }
};

const showScrollButton = ref(false);

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};

const onScroll = async () => {
  if (messagesContainer.value && !chatStore.isLoading) {
    if (
      Math.abs(messagesContainer.value.scrollTop) +
        messagesContainer.value.clientHeight >=
      messagesContainer.value.scrollHeight - 30
    ) {
      const oldScrollHeight = messagesContainer.value.scrollTop;
      const result = await chatStore.loadMessages();

      nextTick(() => {
        if (messagesContainer.value && result) {
          messagesContainer.value.scrollTop = oldScrollHeight;
        }
      });
    }

    if (
      Math.abs(messagesContainer.value.scrollTop) < 50 &&
      !!chatStore.pairInfo.unreadMessagesCount
    )
      chatStore.setMessagesStatusToRead();

    Math.abs(messagesContainer.value.scrollTop) > 100
      ? (showScrollButton.value = true)
      : (showScrollButton.value = false);
  }
};

onMounted(async () => {
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener("scroll", onScroll);
  }

  getRandomSampleMessage();
  chatStore.setMessagesStatusToRead();
});

onBeforeUnmount(() => {
  messagesContainer.value?.removeEventListener("scroll", onScroll);
});

defineExpose({
  scrollToBottom: scrollToBottom,
});
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

.msg {
  &:first-of-type {
    .msg-inner {
      .msg-user {
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
      }
    }
  }
  &:last-of-type {
    .msg-inner {
      .msg-user {
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
      }
    }
  }
}

.dot {
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
  animation-name: dot-scale;
  animation-duration: 1s;

  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 5px 0px;
  transform: scale(0.65);

  &:nth-of-type(2) {
    animation-delay: 0.15s;
  }
  &:nth-of-type(3) {
    animation-delay: 0.3s;
  }
}

@keyframes dot-scale {
  0%,
  70% {
    transform: scale(0.65);
  }
  35% {
    transform: scale(1);
  }
}
</style>
