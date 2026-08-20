"use client";

import {
  LogoSetUpForAllStocksAction,
  LogoSetUpForExistingStocksAction,
} from "@/action/logoManagementAction/logoManagementAction";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import { useLogoSetupLogsStore } from "@/zustand/logoSetupLogs.Store";
import { useState } from "react";
import { FiImage, FiPlay, FiTerminal } from "react-icons/fi";
import { GrClear } from "react-icons/gr";
import Swal from "sweetalert2";
import LogoSetUpInstructions from "./logoSetUpInstructions";

const LogoSetUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logs, clearLogs } = useLogoSetupLogsStore();

  const confirmLogoSetup = async (title: string, text: string) => {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e7490",
      cancelButtonColor: "#f05252",
      confirmButtonText: "Yes, proceed",
      backdrop: "rgba(0,0,0,0.4) center top no-repeat",
    });

    return result.isConfirmed;
  };

  const handleLogoSetUp = async () => {
    const confirmed = await confirmLogoSetup(
      "Start Logo Setup?",
      "This will generate and assign logos for all stock symbols. Continue?"
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await LogoSetUpForAllStocksAction();

      if (response?.status === "success") {
        Swal.fire({
          title: "Completed!",
          text: response.message || "Logo setup completed successfully.",
          icon: "success",
        });
      } else {
        throw new Error(response?.message || "Logo setup failed.");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error during logo setup.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingLogoSetUp = async () => {
    const confirmed = await confirmLogoSetup(
      "Setup Logos From Existing?",
      "This will copy logos from existing stock symbols (same SK, different exchange). Continue?"
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await LogoSetUpForExistingStocksAction();

      if (response?.status === "success") {
        Swal.fire({
          title: "Completed!",
          text:
            response.message || "Existing logo setup completed successfully.",
          icon: "success",
        });
      } else {
        throw new Error(response?.message || "Logo setup failed.");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Unexpected error during logo setup.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col w-full max-h-[600px] min-h-[600px]">
        {/* Header */}
        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FiImage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Logo Setup for All Stocks
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure and set up logos for all available stock symbols.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              type="button"
              disabled={isLoading}
              variant="primary"
              className="w-full flex items-center justify-center"
              onClick={handleExistingLogoSetUp}
            >
              <FiPlay className="w-5 h-5 mr-2" />
              {isLoading ? "Processing..." : "Start Logo Setup From Existing"}
              {isLoading && <Loader className="ml-2" />}
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              variant="primary"
              className="w-full flex items-center justify-center"
              onClick={handleLogoSetUp}
            >
              <FiPlay className="w-5 h-5 mr-2" />
              {isLoading ? "Processing..." : "Start Logo Setup"}
              {isLoading && <Loader className="ml-2" />}
            </Button>
          </div>
        </div>
        {/* terminal header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FiTerminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Logo Setup Logs
            </h3>
          </div>
          <button
            onClick={clearLogs}
            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Clear logs"
          >
            <GrClear className="w-4 h-4" />
          </button>
        </div>
        {/* Logs Area */}
        <div
          className={`flex-1 overflow-y-auto bg-gray-200 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm ${
            logs.length === 0 ? "flex items-center justify-center" : ""
          }`}
        >
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
              <FiTerminal className="w-10 h-10 mb-2 opacity-50" />
              <p>No logs yet</p>
              <p className="text-xs mt-1">Operations will appear here</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {logs.map((log, idx) => (
                <li key={idx} className="text-gray-800 dark:text-gray-200">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    [{new Date(log.date).toLocaleTimeString()}]
                  </span>{" "}
                  {log.msg}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Footer */}
        {logs.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
            Showing {logs.length} log entries
          </div>
        )}
      </div>
      <LogoSetUpInstructions />
    </>
  );
};

export default LogoSetUpForm;
