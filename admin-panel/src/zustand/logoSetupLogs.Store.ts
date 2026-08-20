import { create } from "zustand";

interface ILog {
  msg: string;
  date: string;
}

interface LogoSetupLogsStore {
  logs: ILog[];
  addLog: (log: string) => void;
  clearLogs: () => void;
}

export const useLogoSetupLogsStore = create<LogoSetupLogsStore>((set, get) => ({
  logs: [],
  addLog: (log) => {
    const newLog: ILog = {
      date: new Date().toISOString(),
      msg: log,
    };
    set({ logs: [newLog, ...get().logs] });
  },
  clearLogs: () => set({ logs: [] }),
}));
