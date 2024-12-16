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
        v-for="(message, index) in chatStore.messages"
        class="w-full flex flex-col items-center justify-start"
        :key="message.date"
      >
        <div
          v-if="showDate(index)"
          class="text-xs font-semibold text-neutral-500 select-none mb-2 mt-4"
        >
          {{ formatDate(new Date(message.date)) }}
        </div>
        <div
          class="max-w-[85%] flex items-end justify-start"
          :class="[message.sender === userStore.id ? 'self-end' : 'self-start']"
        >
          <PairAvatar
            :pair="chatStore.pairInfo"
            class="w-8 h-8 mr-2 shrink-0"
            :title="chatStore.pairInfo.name"
            v-if="message.sender !== userStore.id"
          ></PairAvatar>
          <div
            class="rounded-3xl shadow-sm py-2 px-4 dark:text-neutral-200 text-slate-800"
            :class="[
              message.sender === userStore.id
                ? 'bg-rose-300 dark:bg-rose-500/20'
                : 'bg-blue-200 dark:bg-blue-600/20',
            ]"
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
      class="absolute bottom-6 left-[calc(50%-2rem)] w-16 h-16 flex items-center justify-center text-rose-500/60 hover:text-rose-500 transition-all drop-shadow-2xl"
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
  if (index === 0) return false;
  if (chatStore.messages) {
    const prevMessageDate = new Date(chatStore.messages[index].date).getTime();
    const currentMessageDate = new Date(
      chatStore.messages[index + 1].date
    ).getTime();
    const timeDifference = (prevMessageDate - currentMessageDate) / 60000;
    return timeDifference > 10;
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
</style>
