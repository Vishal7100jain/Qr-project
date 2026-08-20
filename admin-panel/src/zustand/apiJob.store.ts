import { create } from "zustand";

export interface IJobs {
  email: string;
  jobId: string;
  msg: string;
  isRunning: number;
  createdAt: Date;
}

interface IApiJobStore {
  jobs: IJobs[];
  setJobIds: (jobs: IJobs[]) => void;
  removeJobId: (jobs: string) => void;
}

export const useApiJobStore = create<IApiJobStore>()((set, get) => ({
  jobs: [],

  setJobIds: (jobs) => {
    set({ jobs: jobs });
  },

  removeJobId: (jobId) => {
    set({ jobs: get().jobs.filter((item) => item.jobId !== jobId) });
  },
}));
