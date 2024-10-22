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
interface authStoreState extends User {
  email: string;
  token: string;
}

interface settingsStoreState {
  settings: {
    notifications: boolean;
    theme: "dark" | "light";
    language: string;
  };
}

export type { User, authStoreState, settingsStoreState };
