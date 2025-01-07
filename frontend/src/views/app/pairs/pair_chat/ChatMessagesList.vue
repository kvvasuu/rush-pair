<template>
  <div
    class="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col-reverse px-1 md:px-4 pb-2 pt-6 gap-1"
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

      <MessageBlock
        v-for="(message, index) in chatStore.messages"
        :message="message"
        :index="index"
        :key="message.date"
        @show-delete-modal="toggleDeleteModal(message)"
      ></MessageBlock>
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
  <Transition name="fade" mode="out-in">
    <Teleport to="body">
      <ConfirmationModal
        @close="isDeleteModalVisible = false"
        @confirm="deleteMessage"
        v-if="isDeleteModalVisible"
      >
        <template v-slot:title>Delete message</template>
        <template v-slot:content
          ><p>
            Deleting this message will permanently remove it if it hasn't been
            read by the recipient yet.
          </p>
          <p>Are you sure you want to proceed?</p></template
        >
        <template v-slot:confirm-button>
          Delete <i class="fa-solid fa-trash-can text-sm ml-1"></i
        ></template>
      </ConfirmationModal>
    </Teleport>
  </Transition>
</template>

<script setup lang="ts">
import { useChatStore } from "../../../../stores/chatStore";
import { ref, nextTick, onMounted, onBeforeUnmount, watch } from "vue";
import MessageBlock from "./MessageBlock.vue";
import { Message } from "../../../../types";
import ConfirmationModal from "../../../../components/containers/ConfirmationModal.vue";

const emit = defineEmits(["sendSampleMessage"]);

const chatStore = useChatStore();

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

const isDeleteModalVisible = ref(false);
const messageToDelete = ref<Message | null>(null);
const toggleDeleteModal = (message: Message) => {
  if (isDeleteModalVisible.value) {
    isDeleteModalVisible.value = false;
    messageToDelete.value = null;
  } else {
    isDeleteModalVisible.value = true;
    messageToDelete.value = message;
  }
};

const deleteMessage = async () => {
  if (messageToDelete.value) chatStore.deleteMessage(messageToDelete.value);
};

watch(
  () => chatStore.pairInfo.unreadMessagesCount,
  () => {
    if (messagesContainer.value) {
      if (
        Math.abs(messagesContainer.value.scrollTop) < 50 &&
        !!chatStore.pairInfo.unreadMessagesCount
      )
        chatStore.setMessagesStatusToRead();
    }
  },
  { deep: true }
);

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
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-leave-active {
  position: absolute;
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
