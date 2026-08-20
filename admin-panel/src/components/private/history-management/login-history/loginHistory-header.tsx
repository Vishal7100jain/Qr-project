import { ColumnConfig } from "@/components/tables/ListTable";
import Badge from "@/components/ui/badge/Badge";
import { AdminStatus } from "@/constants/adminEnum";
import { PersonTypeEnum } from "@/enums/adminEnums";
import { convertDate, getUserAgentIcon } from "@/utils/common";
import Image from "next/image";

export const LoginHistoryColumns = (): ColumnConfig<any>[] => {
  return [
    {
      key: "admin",
      header: "Admin Email",
      type: "text",
      align: "center",
      headerClassName: "justify-center",
      render: (admin: any) => (
        <span className="text-gray-800 dark:text-gray-100">{admin?.email}</span>
      ),
    },
    {
      key: "userAgent",
      header: "User Agent",
      type: "text",
      align: "center",
      headerClassName: "justify-center",
      render: (value: string) => {
        const icon = getUserAgentIcon(value);
        return (
          <div className="flex items-center justify-center gap-2">
            {icon && (
              <Image
                src={icon}
                alt="Agent Icon"
                width={35}
                height={35}
                className="rounded-sm"
              />
            )}
          </div>
        );
      },
    },
    {
      key: "ipAddress",
      header: "IP Address",
      type: "text",
      align: "center",
      headerClassName: "justify-center",
    },
    {
      key: "isActive",
      header: "Status",
      type: "custom",
      align: "center",
      headerClassName: "justify-center",
      badgeConfig: {
        colorMap: {
          1: "success",
          0: "error",
        },
      },
      render: (value: any) => {
        const badgeColor = value == AdminStatus.ACTIVE ? "success" : "error";

        return (
          <Badge color={badgeColor}>
            {value == AdminStatus.ACTIVE ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      key: "personType",
      header: "Person Type",
      type: "custom",
      align: "center",
      headerClassName: "justify-center",
      render: (type: number) => {
        const label = type === PersonTypeEnum.ADMIN ? "Admin" : "Artist";
        return <Badge color="primary">{label}</Badge>;
      },
    },
    {
      key: "loginAt",
      header: "Login At",
      type: "custom",
      align: "center",
      headerClassName: "justify-center",
      render: (value: any) => (
        <span className="text-gray-700 dark:text-gray-300">
          {convertDate(value, "DD/MM/YYYY h:mm:ss a")}
        </span>
      ),
    },
    {
      key: "logoutAt",
      header: "Logout At",
      type: "custom",
      align: "center",
      headerClassName: "justify-center",
      render: (value: any) => (
        <span className="text-gray-700 dark:text-gray-300">
          {value ? convertDate(value, "DD/MM/YYYY h:mm:ss a") : "—"}
        </span>
      ),
    },
  ];
};
