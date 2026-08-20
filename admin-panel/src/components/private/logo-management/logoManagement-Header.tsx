"use client";

import { ILogoPendingItem } from "@/action/logoManagementAction/logoManagementAction";
import { ColumnConfig } from "@/components/tables/ListTable";
import { convertDate } from "@/utils/common";
import Image from "next/image";

// 🔹 Table Columns for Logo Management Module
export const LogoManagementColumn = (): ColumnConfig<any>[] => {
  return [
    {
      key: "sk",
      header: "Symbol",
      align: "left",
      type: "custom",
      headerClassName: "justify-start",
      render: (value: any, data: ILogoPendingItem) => {
        return (
          <div className="flex flex-row items-center gap-2">
            {data?.logo ? (
              <Image
                src={data.logo}
                alt="logo"
                height={5000}
                width={5000}
                quality={100}
                className="w-8 h-8 rounded-full object-contain"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                {value?.slice(0, 1)?.toUpperCase() || "N/A"}
              </div>
            )}
            <p className="text-gray-800 dark:text-gray-200 break-words">
              {value}
            </p>
          </div>
        );
      },
    },
    {
      key: "xc",
      header: "Exchange",
      align: "left",
      type: "text",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "in",
      header: "Instrument Token",
      align: "left",
      type: "text",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      align: "left",
      type: "text",
      headerClassName: "justify-start",
      render: (value: any) => (
        <span className="text-gray-800 dark:text-gray-200 whitespace-nowrap">
          {convertDate(value, "DD/MM/YYYY h:mm:ss a")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "updatedAt",
      header: "Modified Date",
      align: "left",
      type: "text",
      headerClassName: "justify-start",
      render: (value: any) => (
        <span className="text-gray-800 dark:text-gray-200 whitespace-nowrap">
          {convertDate(value, "DD/MM/YYYY h:mm:ss a")}
        </span>
      ),
      sortable: true,
    },
  ];
};
