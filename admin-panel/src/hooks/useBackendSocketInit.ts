"use client";
import SocketManager from "@/config/backendSocket.config";
import { useAdminStore } from "@/zustand/admin.store";
import { useApiJobStore } from "@/zustand/apiJob.store";
import { useHistoricalDataStore } from "@/zustand/historicalDataManagement.store";
import { useLogoSetupLogsStore } from "@/zustand/logoSetupLogs.Store";
import { useEffect } from "react";

const useBackendSocketInit = () => {
  const setLogs = useHistoricalDataStore((state) => state.setLogs);
  const setLogoLogs = useLogoSetupLogsStore((state) => state.addLog);
  const removeJobId = useApiJobStore((state) => state.removeJobId);
  const email = useAdminStore((state) => state.admin?.email);

  useEffect(() => {
    if (!email) return;

    SocketManager.connect(process.env.NEXT_PUBLIC_MARKET_DATA_SOCKET_URL!);

    const handleHistoricalLogs = (msg: string) => {
      const type = "historical";
      setLogs(msg, type);
    };

    const handleRangeLogs = (msg: string) => {
      const type = "range";
      setLogs(msg, type);
    };

    const handleJobLogs = (msg: string) => {
      const type = "job";
      setLogs(msg, type);
    };

    const handleJobCancelledLogs = (data: { msg: string; jobId: string }) => {
      setLogs(data.msg, "job");
      removeJobId(data.jobId);
    };

    const handleLogoLogs = (msg: string) => {
      setLogoLogs(msg);
    };

    SocketManager.on("historicalDataLog", handleHistoricalLogs);
    SocketManager.on("rangeHistoricalDataLog", handleRangeLogs);
    SocketManager.on("jobLog", handleJobLogs);
    SocketManager.on("job-cancelled", handleJobCancelledLogs);
    SocketManager.on("logoLogs", handleLogoLogs);

    return () => {
      SocketManager.off("historicalDataLog", handleHistoricalLogs);
      SocketManager.off("rangeHistoricalDataLog", handleRangeLogs);
      SocketManager.off("jobLog", handleJobLogs);
      SocketManager.off("job-cancelled", handleJobCancelledLogs);
      SocketManager.off("logoLogs", handleLogoLogs);
    };
  }, [email]);

  return null;
};

export default useBackendSocketInit;
