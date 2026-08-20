"use client";

import {
  DeleteETFAction,
  IETFsManagementItem,
} from "@/action/etfsManagementAction/etfsManagementAction";
import GenericDetailsModal from "@/components/common/detailsModal";
import { ColumnConfig } from "@/components/tables/ListTable";
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

const TableAction = ({
  data,
  etfId,
}: {
  data: IETFsManagementItem;
  etfId: string;
}) => {
  const router = useRouter();
  const setRefetchApi = useModuleStore((state) => state.setRefetchApi);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setShowDetailsModal] = useState(false);

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
      const response = await DeleteETFAction(etfId);

      if (response?.status === "success") {
        Swal.fire({
          title: "Success!",
          text: response?.message || "ETF deleted successfully",
          icon: "success",
        });
        setRefetchApi();
      } else {
        throw new Error(response?.message || "Failed to delete ETF");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to delete ETF",
        icon: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleEdit = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    useModuleStore.getState().setModule(etfId, ModuleName.ETF_MANAGEMENT);
    router.push("/etf-management/edit");
  };

  const handleDelete = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!isDeleting) {
      deleteItem();
    }
  };

  const handleView = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowDetailsModal(true);
  };

  return (
    <>
      <div className="flex gap-2 items-center w-full justify-start">
        <EyeIcon
          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          size={20}
          onClick={handleView}
        />
        <EditRestrictionCard moduleName={ModuleName.ETF_MANAGEMENT}>
          <PencilLine
            className="text-blue-500 text-xl cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleEdit}
            size={20}
          />
        </EditRestrictionCard>
        <DeleteRestrictionCard moduleName={ModuleName.ETF_MANAGEMENT}>
          <Trash2
            className={`${
              isDeleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } text-red-500 hover:text-red-700 text-xl transition-colors`}
            onClick={handleDelete}
            size={20}
          />
        </DeleteRestrictionCard>
      </div>

      <GenericDetailsModal
        isOpen={isOpen}
        onClose={() => setShowDetailsModal(false)}
        title="ETF Details"
        description="Information about the selected ETF"
        data={{
          symbol: data?.sk ?? "-",
          underlying: data?.ud ?? "-",
          name: data?.sn ?? "-",
          in: data?.in ?? "-",
          tp: data?.tp ?? "-",
          fileName: data?.fileName ?? "-",
          logo_url: data?.logo ?? "-",
          createdAt: data?.createdAt ?? "-",
          updatedAt: data?.updatedAt ?? "-",
        }}
        fieldLabels={{
          symbol: "ETF Symbol",
          underlying: "Underlying Asset",
          name: "ETF name",
          in: "Instrument",
          tp: "ETF Type",
          logo_url: "Logo Url",
          fileName: "File Name",
          createdAt: "Created On",
          updatedAt: "Last Updated",
        }}
      />
    </>
  );
};

export const ETFListManagementColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "sk",
      header: "ETF Symbol",
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
      header: "ETF Name",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "ud",
      header: "Underlying Asset",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "tp",
      header: "ETF Type",
      type: "custom",
      align: "left",
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
        return <TableAction etfId={id} data={row} />;
      },
      omit: !checkEditDeleteModulePermissions(ModuleName.ETF_MANAGEMENT, admin),
    },
  ];
};
