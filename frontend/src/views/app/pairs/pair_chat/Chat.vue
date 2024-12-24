<template>
  <div
    class="flex-1 h-full w-full flex flex-col lg:flex-col justify-end relative"
  >
    <div
      class="w-full h-full relative overflow-y-auto overflow-x-hidden flex flex-col-reverse gap-1"
    >
      <div
        class="w-full h-full flex items-center justify-center"
        v-if="isLoading || !chatStore.roomId"
      >
        <BasicSpinner></BasicSpinner>
      </div>
      <ChatMessagesList
        v-else
        ref="chatMessagesList"
        :key="String(chatStore.pairInfo.isVisible)"
        @send-sample-message="(msg) => (message = msg)"
      ></ChatMessagesList>
    </div>

    <div
      class="flex w-full relative items-end break-all h-auto max-h-36 pr-2 bg-neutral-50 hover:bg-neutral-100/90 dark:bg-neutral-800/80 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 transition-all z-20"
    >
      <p
        name="message"
        id="message"
        contenteditable="true"
        class="w-full break-all h-auto max-h-36 overflow-y-auto p-4 pr-0 overflow-x-hidden outline-none text-2xl"
        autocomplete="off"
        spellcheck="false"
        @input="onInput"
        @keydown.enter="sendMessage"
        @paste="handlePaste"
        ref="messageInputRef"
      ></p>
      <span
        v-if="isMessagePlaceholderVisible"
        class="absolute select-none dark:text-neutral-700 text-neutral-300 text-2xl pl-5 p-4 pointer-events-none"
        >Type a message...</span
      >
      <div class="w-16 h-16 z-20 relative" v-if="!isTouchDevice">
        <button
          class="w-full h-full text-neutral-600 text-2xl group"
          title="Select emoji"
          @click.stop="toggleEmojiSelector"
        >
          <i
            class="fa-regular fa-face-smile group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800 p-2 rounded-full transition-all duration-300"
            :class="{
              'bg-neutral-200 dark:bg-neutral-800': isEmojiSelectorVisible,
            }"
          ></i></button
        ><EmojiPicker
          class="absolute h-[19rem] -top-[17.5rem] w-[19.5rem] -left-72 rounded-br-none shadow-lg"
          @select-emoji="selectEmoji"
          @close="isEmojiSelectorVisible = false"
          v-if="isEmojiSelectorVisible"
        ></EmojiPicker>
      </div>
      <button
        class="w-16 h-16 text-rose-500 hover:text-rose-600 transition-all duration-300 text-2xl hover:text-3xl z-20"
        :title="message ? `Send message` : `Send heart`"
        @click="sendMessage"
      >
        <Transition name="pop-up-fast" mode="out-in">
          <i class="fa-solid fa-paper-plane" v-if="message"></i>
          <i class="fa-solid fa-heart" v-else></i>
        </Transition>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useChatStore } from "../../../../stores/chatStore";
import EmojiPicker from "../../../../components/EmojiPicker.vue";
import ChatMessagesList from "./ChatMessagesList.vue";
import BasicSpinner from "../../../../components/BasicSpinner.vue";

const chatStore = useChatStore();

const message = ref("");
const messageInputRef = ref<HTMLDivElement | null>(null);

const chatMessagesList = ref<InstanceType<typeof ChatMessagesList> | null>(
  null
);

const isLoading = ref(true);

const isEmojiSelectorVisible = ref(false);

const toggleEmojiSelector = () => {
  isEmojiSelectorVisible.value = !isEmojiSelectorVisible.value;
};

const selectEmoji = (emoji: string) => {
  message.value += emoji;

  if (messageInputRef.value) {
    messageInputRef.value.innerText += emoji;
    isMessagePlaceholderVisible.value = false;
    const windowSelection = window.getSelection();
    if (windowSelection) {
      messageInputRef.value?.focus();
      windowSelection.selectAllChildren(messageInputRef.value);
      windowSelection.collapseToEnd();
    }
  }
};

const sendMessage = async () => {
  let messageToSend = "";

  !message.value
    ? (messageToSend = "\u2764\uFE0F")
    : (messageToSend = message.value);

  await chatStore.sendMessage(messageToSend);
  message.value = "";
  chatStore.stopTyping();
  isTyping.value = false;
  setTimeout(() => {
    if (chatMessagesList.value) {
      chatMessagesList.value.scrollToBottom();
    }
  }, 100);
};

const isMessagePlaceholderVisible = ref(true);

const typingTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const isTyping = ref(false);

const onInput = (event: Event): void => {
  const target = event.target as HTMLElement;
  if (target) message.value = target.innerText.trim();

  isMessagePlaceholderVisible.value = false;

  if (!isTyping.value) {
    chatStore.startTyping();
    isTyping.value = true;
  }

  if (typingTimeout.value !== null) {
    clearTimeout(typingTimeout.value);
  }

  typingTimeout.value = setTimeout(() => {
    chatStore.stopTyping();
    isTyping.value = false;
  }, 2000);

  if (target.innerText.trim().length <= 0) {
    isMessagePlaceholderVisible.value = true;
    target.innerText = "";
  }
};

const handlePaste = (event: ClipboardEvent): void => {
  event.preventDefault();
  let plainText = "";
  if (event.clipboardData) {
    plainText = event.clipboardData.getData("text/plain");
  }

  document.execCommand("insertText", false, plainText);
};

onMounted(async () => {
  await chatStore.loadMessages();

  isLoading.value = false;
});

const isTouchDevice = ref(
  "ontouchstart" in window || navigator.maxTouchPoints > 0
);
</script>
