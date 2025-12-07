import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PairInfo, User } from "@/utils/types";
import axios from "axios";
import { socket } from "@/utils/utils";

interface UserStore extends User {
  id: string;
  email: string;
  pairs: Array<PairInfo> | [];
  rushCoins: number;

  getPairs: () => void;
  bindSocketEvents: () => void;
  removeSocketEvents: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      id: "",
      email: "",
      name: "",
      birthdate: "",
      gender: "other",
      country: "",
      city: "",
      phoneNumber: "",
      firstVisit: false,
      imageUrl: "",
      description: "",
      pairs: [],
      rushCoins: 0,

      getPairs: async () => {
        try {
          const res = await axios.get("/chat/get-pairs");
          set({ pairs: res.data.pairedWith || [] });
        } catch (error) {}
      },
      bindSocketEvents: () =>
        set((state) => {
          if (!socket.hasListeners("getMessage")) {
            socket.on("getMessage", (sender) => {
              const pairIndex = get().pairs.findIndex(
                (pair) => pair.id === sender
              );
              const pair = { ...state.pairs[pairIndex] };
              return {
                pairs: [
                  ...state.pairs,
                  {
                    ...pair,
                    unreadMessagesCount: pair.unreadMessagesCount + 1,
                  },
                ],
              };
            });
          }

          return state;
        }),
      removeSocketEvents: () => {
        socket.removeAllListeners("joinedPairing");
        socket.removeAllListeners("emptyQueue");
        socket.removeAllListeners("leftPairing");
        socket.removeAllListeners("paired");
      },
    }),
    {
      name: "rushpair",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
