import { ModuleName } from "@/constants/permissionEnums";
import CryptoJS from "crypto-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IModuleState {
  Id: string;
  moduleName: ModuleName | string;
  refetchApi: boolean;
  setModule: (Id: string, moduleName: ModuleName) => void;
  setRefetchApi: () => void;
  clearModule: () => void;
}

const SECRET_KEY = "bridal-mehndi";

export const useModuleStore = create<IModuleState>()(
  persist(
    (set, get) => ({
      Id: "",
      moduleName: "",
      refetchApi: false,

      setModule: (Id, moduleName) => set({ Id, moduleName }),
      setRefetchApi: () => set({ refetchApi: !get().refetchApi }),
      clearModule: () => set({ Id: "", moduleName: "" }),
    }),
    {
      name: "module-storage",
      storage: {
        getItem: (name) => {
          const encrypted = localStorage.getItem(name);
          if (!encrypted) return null;
          try {
            const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decrypted);
          } catch (error) {
            console.error("Decryption error:", error);
            return null;
          }
        },
        setItem: (name, value) => {
          const stringValue = JSON.stringify(value);
          const encrypted = CryptoJS.AES.encrypt(
            stringValue,
            SECRET_KEY
          ).toString();
          localStorage.setItem(name, encrypted);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
