"use client";

import {
  DeleteHistoricalDataAction,
  IHistoricalDataItem,
} from "@/action/historicalDataManagementAction/historicalDataManagementAction";
import { ColumnConfig } from "@/components/tables/ListTable";
import DeleteRestrictionCard from "@/components/ui/Restriction/DeleteRestrictionCard";
import { ModuleName } from "@/constants/permissionEnums";
import { checkDeleteApiPermission } from "@/utils/common";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";

const timeframeCodes: Record<number, string> = {
  1: "1 Minute",
  3: "3 Minute",
  5: "5 Minute",
  10: "10 Minute",
  15: "15 Minute",
  30: "30 Minute",
  60: "1 Hour",
  1440: "1 Day",
};

const DeleteButton = ({ data }: { data: IHistoricalDataItem }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Metadata?",
      text: "This will only delete the metadata. The original data in QuestDB will remain and auto-delete as per TTL.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e7490",
      cancelButtonColor: "#f05252",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;
    setLoading(true);

    try {
      const response = await DeleteHistoricalDataAction({
        symbol: data.s,
        timeFrame: data.f,
      });

      if (response.status === "success") {
        Swal.fire("Deleted!", response.message, "success");
      } else {
        Swal.fire("Error!", response.message, "error");
      }
    } catch (err: any) {
      Swal.fire("Error!", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteRestrictionCard moduleName={ModuleName.HISTORICAL_DATA_MANAGEMENT}>
      <Trash2
        size={20}
        className={`${
          loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } text-red-500 hover:text-red-700`}
        onClick={!loading ? handleDelete : undefined}
      />
    </DeleteRestrictionCard>
  );
};

export const HistoricalDataListColumns = (): ColumnConfig<any>[] => {
  return [
    {
      key: "sk",
      header: "Symbol",
      align: "left",
      type: "custom",
      render: (value: any, data: any) => {
        return (
          <div className="flex flex-row items-center gap-2">
            {data?.logo && (
              <Image
                src={data.logo}
                alt="logo"
                height={5000}
                width={5000}
                quality={100}
                className="w-8 h-8 rounded-full object-contain"
              />
            )}
            <p className="text-gray-800 dark:text-gray-200 break-words">
              {value}
            </p>
          </div>
        );
      },
    },
    {
      key: "f",
      header: "Time Frame",
      align: "left",
      type: "custom",
      render: (value) => (
        <p className="text-gray-800 dark:text-gray-200">
          {timeframeCodes?.[value] || value}
        </p>
      ),
    },
    {
      key: "ex",
      header: "Expiry",
      align: "left",
      type: "custom",
      render: (value) => (
        <p className="text-gray-800 dark:text-gray-200">
          {new Date(value).toLocaleDateString() || value}
        </p>
      ),
    },
    {
      key: "_id",
      header: "Actions",
      align: "left",
      type: "custom",
      render: (_id, row) => <DeleteButton data={row} />,
      omit: !checkDeleteApiPermission(ModuleName.HISTORICAL_DATA_MANAGEMENT),
    },
  ];
};
