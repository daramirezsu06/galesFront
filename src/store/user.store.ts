import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";
import { IUser } from "@/utils/types/users/IUser";

interface State {
  user: IUser | null; // Permitir que user sea null
  setUser: (user: IUser | null) => void; // También permitir null en setUser
}

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      user: null, // Inicializa como null
      setUser: (user) => set({ user }), // Establecer user
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
