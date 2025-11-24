type Theme = "system" | "dark" | "light";
type Language = "en" | "pl";

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
  unreadMessagesCount: number;
  isBlocked?: boolean;
  isFavourite: boolean;
}

interface UserStoreState extends User {
  id: string;
  email: string;
  token: string;
  settings: {
    notifications: boolean;
    theme: Theme;
    language: Language;
  };
  pairs: Array<PairInfo> | [];
  rushCoins: number;
}

interface ChatStoreState {
  pairInfo: PairInfo;
  currentPage: number;
  hasMoreMessages: boolean;
  messages: Message[];
  isLoading: boolean;
  connected: boolean;
  roomId: string;
  isTyping: boolean;
}

interface MainStoreState {
  isLoading: boolean;
  isDrawing: boolean;
  isEmpty: boolean;
  pairId: string;
  socketMessage: string;
  showCoinsCollectionModal: boolean;
  showBlockedPairs: "yes" | "";
}

interface Emoji {
  emoji: string;
  name: string;
  group: string;
}

interface Message {
  _id: string;
  sender: string;
  content: string;
  date: string;
  isRead?: boolean;
  readAt?: string;
  isDeleted?: boolean;
}

type GameStatus = null | "pending" | "inProgress" | "finished";
interface Game {
  gameId: string;
  gameName: string;
  players:
    | [
        {
          player: string;
          status: GameStatus;
        }
      ]
    | [];
  createdAt: number;
  createdBy: string;
  score: number;
  status: GameStatus;
}
interface GameStoreState extends Game {
  gameData: any;
}

export type {
  User,
  UserStoreState,
  ChatStoreState,
  PairInfo,
  Message,
  Emoji,
  MainStoreState,
  Game,
  GameStoreState,
  Language,
  Theme,
};
