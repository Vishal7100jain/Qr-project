import { IActivityHistory } from "@/action/history/historyAction";
import GenericDetailsModal from "@/components/common/detailsModal";
import { ColumnConfig } from "@/components/tables/ListTable";
import Badge from "@/components/ui/badge/Badge";
import { ModuleName } from "@/constants/permissionEnums";
import {
  checkEditDeleteModulePermissions,
  convertDate,
  getMethodBadgeProps,
  getStatusBadgeProps,
} from "@/utils/common";
import { useAdminStore } from "@/zustand/admin.store";
import { EyeIcon } from "lucide-react";
import { useState } from "react";

const formatResponseTime = (ms: number) => {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
};

const TableAction = ({ data }: { data: IActivityHistory }) => {
  const [isOpen, setShowDetailsModal] = useState(false);

  return (
    <div className="flex gap-2 items-center w-full justify-center">
      <EyeIcon
        className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
        size={20}
        onClick={() => setShowDetailsModal(true)}
      />
      <GenericDetailsModal
        isOpen={isOpen}
        onClose={() => setShowDetailsModal(false)}
        title="Activity Details"
        description="Details of the admin action performed"
        data={{
          email: data?.person?.email ?? "N/A",
          module: data?.mo ?? "N/A",
          description: data?.des ?? "N/A",
          url: data?.url ?? "N/A",
          method: data?.ac ?? "N/A",
          statusCode: data?.sC ?? "N/A",
          ipAddress: data?.ipAdd ?? "N/A",
          userAgent: data?.agent ?? "N/A",
          timeToResponse:
            data?.tiToRes != null
              ? `${formatResponseTime(data.tiToRes)}`
              : "N/A",
          createdAt: data?.createdAt
            ? new Date(data.createdAt).toLocaleString()
            : "N/A",
        }}
        fieldLabels={{
          email: "Performed By",
          module: "Module",
          description: "Description",
          url: "Endpoint URL",
          method: "HTTP Method",
          statusCode: "Status Code",
          ipAddress: "IP Address",
          userAgent: "User Agent",
          timeToResponse: "Response Time",
          createdAt: "Occurred On",
        }}
      />
    </div>
  );
};

export const ActivityHistoryColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "person",
      header: "Admin Email",
      type: "text",
      align: "center",
      headerClassName: "justify-center",
      render: (person: any) => (
        <span className="text-gray-800 dark:text-gray-100">
          {person?.email}
        </span>
      ),
    },
    {
      key: "mo",
      header: "Module Name",
      type: "text",
      align: "center",
      headerClassName: "justify-center",
    },
    {
      key: "url",
      header: "URL",
      type: "text",
      align: "center",
      headerClassName: "justify-center",
    },
    {
      key: "des",
      header: "Description",
      type: "text",
      align: "center",
      headerClassName: "justify-center",
    },
    {
      key: "ac",
      header: "Method",
      type: "custom",
      align: "center",
      headerClassName: "justify-center",
      render: (value: string) => {
        const { color, label } = getMethodBadgeProps(value);
        return (
          <span className="text-nowrap">
            <Badge color={color}>{label}</Badge>
          </span>
        );
      },
    },
    {
      key: "sC",
      header: "Status Code",
      type: "custom",
      align: "center",
      headerClassName: "justify-center",
      render: (code: number) => {
        const { color, label } = getStatusBadgeProps(Number(code));
        return (
          <span className="text-nowrap">
            <Badge color={color}>
              {code} - {label}
            </Badge>
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Created At",
      type: "custom",
      align: "center",
      headerClassName: "justify-center",
      render: (value: any) => (
        <span className="text-gray-700 dark:text-gray-300">
          {convertDate(value, "DD/MM/YYYY h:mm:ss a")}
        </span>
      ),
      sortable: true,
      width: "220px",
    },
    {
      key: "_id",
      header: "Actions",
      type: "custom",
      align: "center",
      headerClassName: "justify-center",
      render: (_: any, data: IActivityHistory) => <TableAction data={data} />,
      omit: !checkEditDeleteModulePermissions(
        ModuleName.ADMIN_ACTIVITY_HISTORY,
        admin
      ),
      width: "100px",
    },
  ];
};
