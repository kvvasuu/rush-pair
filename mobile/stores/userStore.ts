import { PairInfo, User } from "@/utils/types";
import { socket } from "@/utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore extends User {
  _id: string;
  email: string;
  pairs: Array<PairInfo> | [];
  rushCoins: number;

  getPairs: () => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  bindSocketEvents: () => void;
  removeSocketEvents: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      _id: "",
      email: "",
      name: "",
      birthdate: "",
      gender: "other",
      country: "",
      city: "",
      phoneNumber: "",
      firstVisit: true,
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

      connectSocket: () => {
        const id = get()._id;
        if (!id) return;

        socket.connect();
        socket.emit("login", id);
        get().bindSocketEvents();
      },
      disconnectSocket: () => {
        socket.disconnect();
        get().removeSocketEvents();
      },
      bindSocketEvents: () =>
        set((state) => {
          if (!socket.hasListeners("getMessage")) {
            socket.on("getMessage", (sender) => {
              const pairIndex = get().pairs.findIndex((pair) => pair.id === sender);
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
      name: "rushpair-user",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
