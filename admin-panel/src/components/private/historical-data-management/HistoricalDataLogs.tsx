"use client";

import { GetHistoricalLogsAction } from "@/action/historicalDataManagementAction/historicalDataManagementAction";
import { useAdminStore } from "@/zustand/admin.store";
import { useHistoricalDataStore } from "@/zustand/historicalDataManagement.store";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiCopy, FiDownload, FiTerminal } from "react-icons/fi";
import { GrClear } from "react-icons/gr";
import HistoricalDataLogsPagination from "./HistoricalDataLogsPagination";
import { LogItem } from "./LogsItem";

const PAGE_SIZE = 100;

const HistoricalDataLogs = () => {
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const logsStartRef = useRef<HTMLDivElement>(null);
  const email = useAdminStore((state) => state.admin?.email);
  const logs = useHistoricalDataStore((state) => state.logs);
  const { addLogs, clearLogs } = useHistoricalDataStore.getState();
  const [totalLogs, setTotalLogs] = useState<any>();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch logs (with append for newer pages)
  const fetchLogs = useCallback(
    async (pageNumber: number) => {
      if (isFetching || !hasMore || !email) return;
      setIsFetching(true);

      const response = await GetHistoricalLogsAction(
        { page: pageNumber, pageSize: PAGE_SIZE },
        email
      );

      if (response.status === "success" && response.data?.data?.length > 0) {
        let newLogs = response.data.data.map((log: any) => ({
          msg: log.msg,
          type: log.type,
          date: log.createdAt || new Date().toISOString(),
        }));

        // ✅ Sort logs reverse chronologically (newest → oldest)
        newLogs = newLogs.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // ✅ Append older logs when scrolling down
        addLogs(newLogs, "replace");

        const totalFetched = pageNumber * PAGE_SIZE;
        const total = response.data.total;
        setTotalLogs(total);
        setHasMore(totalFetched < total);
        setPage(pageNumber);
      } else {
        setHasMore(false);
      }

      setIsFetching(false);
    },
    [email, hasMore, isFetching]
  );

  // Initial fetch
  useEffect(() => {
    fetchLogs(1);

    return () => {
      clearLogs();
    };
  }, []);

  const handleClearLogs = () => clearLogs();

  const handleExportLogs = () => {
    const logText = logs
      .map(
        (log) =>
          `[${moment(log.date).format("YYYY-MM-DD, HH:mm:ss")}] ${log.msg}`
      )
      .join("\n");

    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historical-data-logs-${moment().format("YYYY-MM-DD")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLogs = async () => {
    const logText = logs
      .map(
        (log) =>
          `[${moment(log.date).format("YYYY-MM-DD, HH:mm:ss")}] ${log.msg}`
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(logText);
    } catch (err) {
      console.error("Failed to copy logs:", err);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;

    fetchLogs(newPage);

    // scroll to top when page changes
    logsContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full md:w-1/2 h-[648px]">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FiTerminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Historical Data Logs
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <>
                <button
                  onClick={handleCopyLogs}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy logs"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExportLogs}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Export logs"
                >
                  <FiDownload className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={handleClearLogs}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear logs"
            >
              <GrClear className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Logs */}
        <div
          ref={logsContainerRef}
          className="flex-1 overflow-y-auto bg-gray-200 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm"
        >
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
              <FiTerminal className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-md">No logs yet</p>
              <p className="text-sm mt-1">Operations will appear here</p>
            </div>
          ) : (
            <>
              <div ref={logsStartRef} />
              <ul className="space-y-2">
                {logs.map(({ msg, date }) => (
                  <LogItem key={date + msg} msg={msg} date={date} />
                ))}
              </ul>
            </>
          )}
          {isFetching && (
            <div className="text-center py-2 text-gray-500 text-xs">
              Loading more logs...
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Real-time logs</span>
          {logs.length > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              Showing 1 to {logs.length} of {totalLogs} entries
            </span>
          )}
        </div>
      </div>
      {totalLogs > PAGE_SIZE && (
        <HistoricalDataLogsPagination
          page={page}
          total={totalLogs}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default HistoricalDataLogs;
