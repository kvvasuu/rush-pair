interface User {
  name: string;
  age: number;
  gender?: "female" | "male" | "other";
  country: string;
  city: string;
  phoneNumber: string;
}
interface authStoreState extends User {
  email: string;
  token: string;
  firstVisit: boolean;
  imageUrl: string;
}

export type { User, authStoreState };
