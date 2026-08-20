"use client";

import {
  DeleteSymbolFromIndexAction,
  IIndexManagementItem,
} from "@/action/indexManagementAction/indexManagementAction";
import GenericDetailsModal from "@/components/common/detailsModal";
import { ColumnConfig } from "@/components/tables/ListTable";
import Badge from "@/components/ui/badge/Badge";
import DeleteRestrictionCard from "@/components/ui/Restriction/DeleteRestrictionCard";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { ModuleName } from "@/constants/permissionEnums";
import { checkEditDeleteModulePermissions } from "@/utils/common";
import { useAdminStore } from "@/zustand/admin.store";
import { useModuleStore } from "@/zustand/module.store";
import { EyeIcon, PencilLine, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export enum IndexTypeEnum {
  high = 1,
  medium = 2,
  low = 3,
}

const TableAction = ({ data }: { data: IIndexManagementItem }) => {
  const setRefetchApi = useModuleStore((state) => state.setRefetchApi);
  const [isDeleting, setIsDeleting] = useState(false);
  const admin = useAdminStore((state) => state.admin);
  const [isOpen, setShowDetailsModal] = useState(false);
  const router = useRouter();

  async function deleteItem() {
    const result = await Swal.fire({
      title: "Confirmation Required",
      text: "You cannot undo this action. Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e7490",
      cancelButtonColor: "#f05252",
      confirmButtonText: "Yes, delete it!",
      backdrop: "rgba(0,0,0,0.4) center top no-repeat",
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);
    try {
      const response = await DeleteSymbolFromIndexAction({
        sk: data.sk,
      });

      if (response?.status === "success") {
        Swal.fire({
          title: "Success!",
          text: response?.message || "Symbol deleted successfully",
          icon: "success",
        });
        setRefetchApi();
      } else {
        throw new Error(response?.message || "Failed to delete symbol");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to delete symbol",
        icon: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleEdit = () => {
    useModuleStore.getState().setModule(data._id, ModuleName.INDEX_MANAGEMENT);
    router.push("/indices-management/edit");
  };

  return (
    <>
      <div className="flex gap-2 items-center w-full justify-start">
        <EyeIcon
          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          size={20}
          onClick={() => setShowDetailsModal(true)}
        />
        <EditRestrictionCard moduleName={ModuleName.INDEX_MANAGEMENT}>
          <PencilLine
            className="text-blue-500 text-xl cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleEdit}
            size={20}
          />
        </EditRestrictionCard>
        <DeleteRestrictionCard moduleName={ModuleName.INDEX_MANAGEMENT}>
          <Trash2
            className={`${
              isDeleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } text-red-500 hover:text-red-700 text-xl transition-colors`}
            onClick={!isDeleting ? deleteItem : undefined}
            size={20}
          />
        </DeleteRestrictionCard>
      </div>
      <GenericDetailsModal
        isOpen={isOpen}
        onClose={() => setShowDetailsModal(false)}
        title="Stock Details"
        description="Information about the selected Stock"
        data={{
          symbol: data?.sk ?? "-",
          name: data?.sn ?? "-",
          count: data?.count ?? "-",
          type: IndexTypeEnum[data?.type] ?? "-",
          exchange: data?.xc ?? "-",
          instrument_token: data?.in ?? "-",
          createdAt: data?.createdAt ?? "-",
          updatedAt: data?.updatedAt ?? "-",
        }}
        fieldLabels={{
          symbol: "Symbol",
          name: "Name",
          count: "No. of stocks",
          instrument_token: "Instrument Token",
          exchange: "Exchange",
          type: "Type",
          createdAt: "Created On",
          updatedAt: "Last Updated",
        }}
      />
    </>
  );
};

export const IndexListManagementColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "sk",
      header: "Symbol",
      align: "left",
      type: "custom",
      headerClassName: "justify-start",
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
      key: "sn",
      header: "Name",
      align: "left",
      type: "custom",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "type",
      header: "Type",
      type: "badge",
      align: "left",
      headerClassName: "justify-start",
      badgeConfig: {
        colorMap: {
          high: "success",
          medium: "warning",
          low: "info",
        },
      },
      render: (value: any) => {
        const badgeColor =
          value == IndexTypeEnum.high
            ? "success"
            : value == IndexTypeEnum.low
              ? "warning"
              : "info";

        return (
          <Badge color={badgeColor}>
            {value == IndexTypeEnum.high
              ? "High"
              : value == IndexTypeEnum.low
                ? "Low"
                : "Medium"}
          </Badge>
        );
      },
    },
    {
      key: "count",
      header: "No. of stocks",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "xc",
      header: "Exchange",
      align: "left",
      type: "custom",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },

    {
      key: "_id",
      header: "Actions",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (id: any, row) => {
        return <TableAction data={row} />;
      },
      omit: !checkEditDeleteModulePermissions(
        ModuleName.INDEX_MANAGEMENT,
        admin
      ),
    },
  ];
};
