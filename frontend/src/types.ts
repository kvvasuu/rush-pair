interface User {
  name: string;
  birthdate: string;
  gender?: "female" | "male" | "other";
  country: string;
  city: string;
  phoneNumber: string;
  firstVisit?: boolean;
  imageUrl?: string;
  description?: string;
}

interface PairInfo {
  id: string;
  name: string;
  age?: number;
  gender?: "male" | "female" | "other";
  imageUrl?: string;
  isVisible: boolean;
  city?: string;
  description?: string;
  pairedAt: number;
  isActive: boolean;
  askedForReveal: boolean;
  hasBeenAskedForReveal: boolean;
}

interface UserStoreState extends User {
  id: string;
  email: string;
  token: string;
  settings: {
    notifications: boolean;
    theme: "dark" | "light";
    language: string;
  };
  pairs: Array<PairInfo> | [];
}

interface ChatStoreState {
  pairInfo: PairInfo;
  currentPage: number;
  messages: Message[];
  isLoading: boolean;
  connected: boolean;
  roomId: string;
  unreadMessagesCount: number;
}

interface Emoji {
  emoji: string;
  name: string;
  group: string;
}

interface Message {
  sender: string;
  content: string;
  date: string;
  isRead?: boolean;
}

export type { User, UserStoreState, ChatStoreState, PairInfo, Message, Emoji };
