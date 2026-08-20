import CryptoJS from "crypto-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IAdmin {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  contactNumber?: string;
  roleId?: any;
  status?: any;
  role?: {
    name: string;
    access: {
      module: string;
      permissions: string[];
    }[];
  };
  token: string;
}

interface AdminState {
  admin: IAdmin | null;
  setAdmin: (admin: IAdmin) => void;
  clearAdmin: () => void;
}

const SECRET_KEY = "bridal-mehndi";

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,

      setAdmin: (admin) => {
        set({ admin });
      },

      clearAdmin: () => {
        set({ admin: null });
      },
    }),
    {
      name: "admin-storage",
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
