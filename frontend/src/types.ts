interface User {
  name: string;
  birthdate: string;
  gender?: "female" | "male" | "other";
  country: string;
  city: string;
  phoneNumber: string;
  firstVisit?: boolean;
  imageUrl?: string;
}

interface Pair {
  id: string;
  name?: string;
  imageUrl?: string;
  pairedAt: number;
}

interface UserStoreState extends User {
  email: string;
  token: string;
  settings: {
    notifications: boolean;
    theme: "dark" | "light";
    language: string;
  };
  pairs: Array<Pair> | [];
}

export type { User, UserStoreState, Pair };
