interface User {
  name: string;
  age: number;
  gender?: "female" | "male" | "other";
  country: string;
  city: string;
  phoneNumber: string;
}
interface State extends User {
  email: string;
  token: string;
  firstVisit: boolean;
}

export type { User, State };
