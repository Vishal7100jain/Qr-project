"use client";

import { ColumnConfig } from "@/components/tables/ListTable";
import DeleteRestrictionCard from "@/components/ui/Restriction/DeleteRestrictionCard";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";

import { ModuleName, PermissionType } from "@/constants/permissionEnums";
import { checkEditDeleteModulePermissions, convertDate } from "@/utils/common";

import { useAdminStore } from "@/zustand/admin.store";
import { useModuleStore } from "@/zustand/module.store";

import { EyeIcon, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

import {
  DeleteAccessByIdAction,
  IAccessManagementItem,
} from "@/action/accessMangement/accessManagementAction";
import GenericDetailsModal from "@/components/common/detailsModal";
import Badge, { BadgeColor } from "@/components/ui/badge/Badge";

const TableAction = ({
  adminId,
  data,
}: {
  adminId: string;
  data: IAccessManagementItem;
}) => {
  const router = useRouter();
  const setRefetchApi = useModuleStore((state) => state.setRefetchApi);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setShowDetailsModal] = useState(false);

  async function deleteItem() {
    if (!adminId) {
      Swal.fire({
        title: "Error!",
        text: "No admin ID provided",
        icon: "error",
      });
      return;
    }

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
      const response = await DeleteAccessByIdAction({ id: adminId });

      if (response?.status === "success") {
        Swal.fire({
          title: "Success!",
          text: response?.message || "Access deleted successfully",
          icon: "success",
        });
        setRefetchApi();
      } else {
        throw new Error(response?.message || "Failed to delete admin");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to delete admin",
        icon: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleEdit = () => {
    useModuleStore.getState().setModule(adminId, ModuleName.ACCESSMANAGEMENT);
    router.push("/access-management/edit");
  };

  return (
    <>
      <div className="flex gap-2 items-center  w-full justify-center">
        <EyeIcon
          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          size={20}
          onClick={() => setShowDetailsModal(true)}
        />
        <EditRestrictionCard moduleName={ModuleName.ACCESSMANAGEMENT}>
          <PencilLine
            className="text-blue-500 text-xl cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleEdit}
            size={20}
          />
        </EditRestrictionCard>
        <DeleteRestrictionCard moduleName={ModuleName.ACCESSMANAGEMENT}>
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
        title="Access Permissons Details"
        description="Details of the access permissons performed"
        data={{
          moduleName: data?.moduleName ?? "N/A",
          permissions: data?.permissions ?? "N/A",
          createdBy: data?.createdBy ?? "N/A",
          modifiedBy: data?.modifiedBy ?? "N/A",
          createdAt: data?.createdAt ?? "N/A",
          updatedAt: data?.updatedAt ?? "N/A",
        }}
        fieldLabels={{
          moduleName: "Module Name",
          permissions: "Permissions",
          createdBy: "Created By",
          modifiedBy: "Modified By",
          createdAt: "Created Date",
          updatedAt: "Updated Date",
        }}
      />
    </>
  );
};

export const AccessManagementColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "moduleName",
      header: "Module Name",
      type: "text",
      align: "left",
      headerClassName: "justify-start",

      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "permissions",
      header: "Permissions",
      align: "left",
      headerClassName: "justify-start",
      type: "text",

      render: (value: string[]) => (
        <div className="flex flex-wrap gap-2">
          {value?.map((item, idx) => {
            let badgeColor: BadgeColor = "primary";
            switch (item) {
              case PermissionType.VIEW:
                badgeColor = "primary";
                break;
              case PermissionType.CREATE:
                badgeColor = "success";
                break;
              case PermissionType.EDIT:
                badgeColor = "info";
                break;
              case PermissionType.DELETE:
                badgeColor = "warning";
                break;
            }
            return (
              <Badge key={idx} color={badgeColor}>
                {item}
              </Badge>
            );
          })}
        </div>
      ),
    },
    {
      key: "createdBy",
      header: "Created By",
      type: "text",

      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">
          {value || "-"}
        </p>
      ),
    },
    {
      key: "modifiedBy",
      header: "Modified By",
      type: "text",
      align: "left",

      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">
          {value || "-"}
        </p>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date & Time",
      type: "text",
      align: "left",

      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 whitespace-nowrap">
          {convertDate(value, "DD/MM/YYYY h:mm:ss a")}
        </p>
      ),
    },
    {
      key: "_id",
      header: "Actions",
      type: "text",
      align: "left",

      headerClassName: "justify-start",
      render: (id: any, row) => <TableAction adminId={id} data={row} />,
      omit: !checkEditDeleteModulePermissions(
        ModuleName.ACCESSMANAGEMENT,
        admin
      ),
    },
  ];
};
