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
      name="message"
      id="message"
      contenteditable="true"
      class="w-full h-auto overflow-y-auto overflow-x-hidden max-h-32 outline-none p-4 pl-4 text-2xl bg-neutral-50 hover:bg-neutral-100/90 dark:bg-neutral-800/80 dark:hover:bg-neutral-800/50 text-neutral-600 placeholder-neutral-300 dark:text-neutral-400 dark:placeholder-neutral-700 transition-all z-20"
      :class="[isTouchDevice ? 'pr-14' : 'pr-32']"
      placeholder="Type a message..."
      autocomplete="off"
      spellcheck="false"
      @input="onInput"
      @keydown.enter="sendMessage"
      @paste="handlePaste"
      ref="messageInputRef"
    ></div>
    <button
      class="w-16 h-16 absolute bottom-0 right-0 text-rose-500 hover:text-rose-600 transition-all duration-300 text-2xl hover:text-3xl z-20"
      :title="message ? `Send message` : `Send heart`"
      @click="sendMessage"
    >
      <Transition name="pop-up-fast" mode="out-in">
        <i class="fa-solid fa-paper-plane" v-if="message"></i>
        <i class="fa-solid fa-heart" v-else></i>
      </Transition>
    </button>
    <div
      class="w-16 h-16 bottom-0 absolute right-16 z-20"
      v-if="!isTouchDevice"
    >
      <button
        class="w-full h-full absolute text-neutral-600 text-2xl group"
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
    messageInputRef.value?.focus();
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

const typingTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const isTyping = ref(false);

const onInput = (event: Event): void => {
  const target = event.target as HTMLElement;
  if (target) message.value = target.innerText.trim();

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
