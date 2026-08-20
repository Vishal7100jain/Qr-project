"use client";

import { ColumnConfig } from "@/components/tables/ListTable";
import Badge from "@/components/ui/badge/Badge";
import { IPOManagement } from "@/constants/adminEnum";
import { useAdminStore } from "@/zustand/admin.store";

export const IPO_managementColomn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "price",
      header: "Price",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: () => {
        return (
          <div className="flex flex-row items-center gap-2">
            <span className="text-gray-800 dark:text-gray-200">Tanmay</span>
          </div>
        );
      },
    },
    {
      key: "owner",
      header: "Owner",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: () => {
        return <p className="text-gray-800 dark:text-gray-200">Tanmay</p>;
      },
    },
    {
      key: "status",
      header: "Status",
      type: "badge",
      align: "left",
      headerClassName: "justify-start",
      badgeConfig: {
        colorMap: {
          active: "success",
          inactive: "warning",
          pending: "info",
          banned: "error",
        },
      },
      render: (value: any) => {
        const badgeColor =
          value == IPOManagement.LISTED
            ? "success"
            : value == IPOManagement.ONGOING
            ? "warning"
            : "error";

        return (
          <Badge color={badgeColor}>
            {value == IPOManagement.LISTED
              ? "LISTED"
              : value == IPOManagement.ONGOING
              ? "ONGOING"
              : "Suspended"}
          </Badge>
        );
      },
      sortable: true,
    },
  ];
};
