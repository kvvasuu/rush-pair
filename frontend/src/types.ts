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
  name?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  imageUrl?: string;
  isVisible: boolean;
  city?: string;
  description?: string;
}

interface UserStoreState extends User {
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
}

export type { User, UserStoreState, ChatStoreState, PairInfo };
