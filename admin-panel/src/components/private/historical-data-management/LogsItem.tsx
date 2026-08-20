import clsx from "clsx";
import moment from "moment";
import React from "react";

interface LogItemProps {
  msg: string;
  date: string;
}

export const LogItem = React.memo(({ msg, date }: LogItemProps) => {
  const isError = msg?.toLowerCase().includes("error");
  const isSuccess = msg?.toLowerCase().includes("success");
  const isWarning = msg?.toLowerCase().includes("warning");

  return (
    <li
      className={clsx("break-words p-2 rounded-lg border-l-4", {
        "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300":
          isError,
        "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300":
          isSuccess,
        "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300":
          isWarning,
        "border-blue-400 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300":
          !isError && !isSuccess && !isWarning,
      })}
    >
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        [{moment(date).format("MMM Do, HH:mm:ss a")}]
      </span>
      <span className="ml-2">{msg}</span>
    </li>
  );
});
