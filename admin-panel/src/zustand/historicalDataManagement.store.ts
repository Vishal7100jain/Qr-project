import { create } from "zustand";

interface ILog {
  date: string;
  msg: string;
  type: "historical" | "range" | "job";
}

interface IHistoricalDataManagementStore {
  logs: ILog[];
  setLogs: (log: string, type?: ILog["type"]) => void;
  addLogs: (newLogs: any, mode: "prepend" | "replace") => void;
  clearLogs: () => void;
}

export const useHistoricalDataStore = create<IHistoricalDataManagementStore>()(
  (set, get) => ({
    logs: [],

    setLogs: (log, type = "historical") => {
      const newLog: ILog = {
        date: new Date().toISOString(),
        msg: log,
        type,
      };
      set({ logs: [newLog, ...get().logs] });
    },

    addLogs: (newLogs, mode = "replace") =>
      set((state) => ({
        logs:
          mode === "prepend"
            ? [...state.logs, ...newLogs]
            : mode === "replace"
            ? [...newLogs]
            : newLogs,
      })),

    clearLogs: () => {
      set({ logs: [] });
    },
  })
);
