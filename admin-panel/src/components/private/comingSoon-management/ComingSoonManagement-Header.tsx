"use client";

import { ColumnConfig } from "@/components/tables/ListTable";
import { useAdminStore } from "@/zustand/admin.store";
import { EyeIcon } from "lucide-react";
import { useState } from "react";

import { IComingSoon } from "@/action/comingSoonAction/comingSoonSubscriberAction";
import GenericDetailsModal from "@/components/common/detailsModal";

const TableAction = ({ data }: { data: IComingSoon }) => {
  const [isOpen, setShowDetailsModal] = useState(false);

  return (
    <>
      <div className="flex gap-2 items-center w-full justify-center">
        <EyeIcon
          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          size={20}
          onClick={() => setShowDetailsModal(true)}
        />
      </div>
      <GenericDetailsModal
        isOpen={isOpen}
        onClose={() => setShowDetailsModal(false)}
        title="Subscriber Details"
        description="Information about the selected subscriber"
        data={{
          email: data?.email ?? "-",
        }}
        fieldLabels={{
          email: "Email Address",
        }}
      />
    </>
  );
};

export const ComingSoonManagementColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "_id",
      header: "User ID",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return (
          <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">
            {value?.substring(0, 8)}...
          </p>
        );
      },
    },
    {
      key: "email",
      header: "Email",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return <p className="text-gray-800 dark:text-gray-200">{value}</p>;
      },
    },
    {
      key: "_id",
      header: "Actions",
      type: "text",
      align: "center",
      headerClassName: "justify-center",
      render: (id: any, row) => {
        return <TableAction data={row} />;
      },
    },
  ];
};
