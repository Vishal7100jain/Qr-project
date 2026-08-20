"use client";

import { ColumnConfig } from "@/components/tables/ListTable";
import DeleteRestrictionCard from "@/components/ui/Restriction/DeleteRestrictionCard";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { ModuleName } from "@/constants/permissionEnums";
import { checkEditDeleteModulePermissions, convertDate } from "@/utils/common";
import { useAdminStore } from "@/zustand/admin.store";
import { useModuleStore } from "@/zustand/module.store";
import { EyeIcon, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import {
  DeleteRoleByIdAction,
  IRoleManagementItem,
} from "@/action/roleManagementAction/roleManagementAction";
import GenericDetailsModal from "@/components/common/detailsModal";
import { useState } from "react";

const TableAction = ({
  adminId,
  data,
}: {
  adminId: string;
  data: IRoleManagementItem;
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
      const response = await DeleteRoleByIdAction({ id: adminId });

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
    useModuleStore.getState().setModule(adminId, ModuleName.ROLEMANAGEMENT);
    router.push("/role-management/edit");
  };

  const formatPermissions = (access: any) => {
    if (!access || !Array.isArray(access)) return "-";

    return access
      .map((item: any) => {
        const moduleName =
          item.module
            ?.replace(/([A-Z])/g, " $1")
            ?.replace(/^./, (str: string) => str.toUpperCase())
            ?.trim() || "Unknown Module";

        const formattedPermissions =
          item.permissions
            ?.map(
              (perm: string) =>
                `• ${perm.charAt(0).toUpperCase() + perm.slice(1)}`
            )
            ?.join(" ") || "-";

        return `${moduleName}: ${formattedPermissions}`;
      })
      .join("\n");
  };

  return (
    <>
      <div className="flex gap-2 items-center w-full justify-center">
        <EyeIcon
          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          size={20}
          onClick={() => setShowDetailsModal(true)}
        />
        {data.name !== "super_admin" && (
          <EditRestrictionCard moduleName={ModuleName.ROLEMANAGEMENT}>
            <PencilLine
              className="text-blue-500 text-xl cursor-pointer hover:text-blue-700 transition-colors"
              onClick={handleEdit}
              size={20}
            />
          </EditRestrictionCard>
        )}
        {data.name !== "super_admin" ? (
          <DeleteRestrictionCard moduleName={ModuleName.ROLEMANAGEMENT}>
            <Trash2
              className={`${
                isDeleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } text-red-500 hover:text-red-700 text-xl transition-colors`}
              onClick={!isDeleting ? deleteItem : undefined}
              size={20}
            />
          </DeleteRestrictionCard>
        ) : (
          "-"
        )}
      </div>

      <GenericDetailsModal
        isOpen={isOpen}
        onClose={() => setShowDetailsModal(false)}
        title="Admin Details"
        description="Information about the selected admin"
        data={{
          name: data?.name ?? "-",
          access: formatPermissions(data?.access),

          createdBy: data?.createdBy ?? "-",
          modifiedBy: data?.modifiedBy ?? "-",
          createdAt: data?.createdAt ?? "-",
          updatedAt: data?.updatedAt ?? "-",
        }}
        fieldLabels={{
          name: "Role Name",
          access: "Access Permissions",
          createdBy: "Created By",
          modifiedBy: "Modified By",
          createdAt: "Created On",
          updatedAt: "Last Updated",
        }}
        className="whitespace-pre-line"
      />
    </>
  );
};

export const RoleManagementColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "name",
      header: "Role Name",
      align: "left",
      type: "custom",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "createdBy",
      header: "Created By",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "modifiedBy",
      header: "Modified By",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return (
          <span className="text-gray-800 dark:text-gray-200 whitespace-nowrap">
            {convertDate(value, "DD/MM/YYYY h:mm:ss a")}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: "updatedAt",
      header: "Modified Date",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => (
        <span className="text-gray-800 dark:text-gray-200 whitespace-nowrap">
          {convertDate(value, "DD/MM/YYYY h:mm:ss a")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "_id",
      header: "Actions",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (id: any, row) => {
        return <TableAction adminId={id} data={row} />;
      },
      omit: !checkEditDeleteModulePermissions(ModuleName.ROLEMANAGEMENT, admin),
    },
  ];
};
