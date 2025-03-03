import avatar from "../assets/images/avatar-placeholder.png";
import avatarAnonym from "../assets/images/avatar-anonym.png";
import { computed, ref } from "vue";
import { useUserStore } from "../stores/userStore";

export function useAvatar(src?: string, isAnonym?: boolean) {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const userStore = useUserStore();

  const isError = ref(false);

  const setDefaultAvatar = () => {
    isError.value = true;
  };

  const avatarSrc = computed(() => {
    return isError.value
      ? avatar
      : isAnonym
      ? avatarAnonym
      : `${SERVER_URL}/uploads/${src}?token=${userStore.token}` || avatar;
  });

  return { setDefaultAvatar, avatarSrc };
}
