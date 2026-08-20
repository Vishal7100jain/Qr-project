"use client";

import {
  DeleteAdminByIdAction,
  IAdminManagementItem,
} from "@/action/adminMangement/adminManagementAction";
import { ColumnConfig } from "@/components/tables/ListTable";
import Badge from "@/components/ui/badge/Badge";
import DeleteRestrictionCard from "@/components/ui/Restriction/DeleteRestrictionCard";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { AdminStatus } from "@/constants/adminEnum";
import { ModuleName } from "@/constants/permissionEnums";
import { checkEditDeleteModulePermissions, convertDate } from "@/utils/common";
import { useAdminStore } from "@/zustand/admin.store";
import { useModuleStore } from "@/zustand/module.store";
import { EyeIcon, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import GenericDetailsModal from "@/components/common/detailsModal";
import Image from "next/image";
import { useState } from "react";
import AdminManagementDeleteModel from "./adminManagement-deleteModel";

const TableAction = ({
  adminId,
  data,
}: {
  adminId: string;
  data: IAdminManagementItem;
}) => {
  const router = useRouter();
  const setRefetchApi = useModuleStore((state) => state.setRefetchApi);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setShowDetailsModal] = useState(false);

  async function deleteItem(adminId: string, adminPassword?: string) {
    // Check if the admin is a super admin
    const isSuperAdmin = data?.role === "super_admin";

    if (isSuperAdmin && !adminPassword) {
      // Show password modal for super admin
      setShowPasswordModal(true);
      return;
    }

    // For regular admin, show confirmation
    if (!isSuperAdmin) {
      const result = await Swal.fire({
        title: "Confirmation Required",
        text: "You cannot undo this action. Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0e7490",
        cancelButtonColor: "#f05252",
        confirmButtonText: "Yes, delete it!",
        backdrop: `rgba(0,0,0,0.4) center top no-repeat`,
      });

      if (!result.isConfirmed) return;
    }

    // Proceed with deletion
    setIsDeleting(true);
    try {
      let response: any;

      if (isSuperAdmin && adminPassword) {
        // For super admin, pass the password to the delete action
        response = await DeleteAdminByIdAction({
          id: adminId,
          superAdminPassword: adminPassword,
        });
      } else {
        // For regular admin
        response = await DeleteAdminByIdAction({ id: adminId });
      }

      if (response?.status === "success") {
        Swal.fire({
          title: "Successfully Deleted",
          text: response?.message || "Admin account has been deleted.",
          icon: "success",
          confirmButtonColor: "#0e7490",
        });
        setRefetchApi();
        setShowPasswordModal(false);
        setPassword("");
      } else {
        const errorData = response;
        Swal.fire({
          title: "Error!",
          text: errorData?.message || "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#0e7490",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the admin account. Please try again later.",
        icon: "error",
        confirmButtonColor: "#0e7490",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleSuperAdminDelete = () => {
    if (!password.trim()) {
      Swal.fire({
        title: "Password Required",
        text: "Please enter the Super Admin password to proceed.",
        icon: "warning",
        confirmButtonColor: "#0e7490",
      });
      return;
    }
    deleteItem(adminId, password);
  };

  const handleEdit = () => {
    useModuleStore.getState().setModule(adminId, ModuleName.ADMINMANAGEMENT);
    return router.push("/admin-management/edit");
  };

  const handleDelete = () => {
    deleteItem(adminId);
  };

  // Check if current admin is super admin to potentially show different styling
  const isSuperAdmin = data?.role === "super_admin";

  return (
    <>
      <div className="flex gap-2 items-center w-full justify-center">
        <EyeIcon
          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          size={20}
          onClick={() => setShowDetailsModal(true)}
        />
        <EditRestrictionCard moduleName={ModuleName.ADMINMANAGEMENT}>
          <PencilLine
            className="text-blue-500 text-xl cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleEdit}
            size={20}
          />
        </EditRestrictionCard>
        <DeleteRestrictionCard moduleName={ModuleName.ADMINMANAGEMENT}>
          <Trash2
            className={`${
              isSuperAdmin
                ? "text-red-600 hover:text-red-800"
                : "text-red-500 hover:text-red-700"
            } text-xl cursor-pointer transition-colors`}
            onClick={handleDelete}
            size={20}
            // @ts-ignore
            title={
              isSuperAdmin
                ? "Delete Super Admin (Password Required)"
                : "Delete Admin"
            }
          />
        </DeleteRestrictionCard>
      </div>

      <AdminManagementDeleteModel
        handleSuperAdminDelete={handleSuperAdminDelete}
        isDeleting={isDeleting}
        password={password}
        setPassword={setPassword}
        setShowPasswordModal={setShowPasswordModal}
        showPasswordModal={showPasswordModal}
      />

      <GenericDetailsModal
        isOpen={isOpen}
        onClose={() => setShowDetailsModal(false)}
        title="Admin Details"
        description="Information about the selected admin"
        data={{
          name: data?.username ?? "-",
          email: data?.email ?? "-",
          role: data?.role ?? "-",
          contactNumber: data?.contactNumber ?? "-",
          status:
            data?.status === AdminStatus.ACTIVE
              ? "Active"
              : data?.status === AdminStatus.INACTIVE
              ? "Inactive"
              : data?.status === AdminStatus.SUSPENDED
              ? "Suspended"
              : "-",
          createdBy: data?.createdBy ?? "-",
          modifiedBy: data?.modifiedBy ?? "-",
          createdAt: data?.createdAt ?? "-",
          updatedAt: data?.updatedAt ?? "-",
        }}
        fieldLabels={{
          name: "Full Name",
          email: "Email Address",
          role: "Role",
          contactNumber: "Contact Number",
          status: "Account Status",
          createdBy: "Created By",
          modifiedBy: "Modified By",
          createdAt: "Created On",
          updatedAt: "Last Updated",
        }}
      />
    </>
  );
};

export const AdminManagementColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "username",
      header: "Admin",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any, data: any) => {
        const handleImageUrl = () => {
          if (data?.profileImage) {
            return (
              process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + data?.profileImage
            );
          } else {
            return "/images/user/owner.jpg";
          }
        };
        return (
          <div className="flex flex-row items-center gap-2">
            <div className="w-10 h-10 relative">
              <Image
                src={handleImageUrl()}
                alt="user"
                fill
                className="rounded-full object-cover border border-gray-200"
              />
            </div>
            <span className="text-gray-800 dark:text-gray-200">{value}</span>
          </div>
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
      key: "role",
      header: "Role",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
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
          value == AdminStatus.ACTIVE
            ? "success"
            : value == AdminStatus.INACTIVE
            ? "warning"
            : "error";

        return (
          <Badge color={badgeColor}>
            {value == AdminStatus.ACTIVE
              ? "Active"
              : value == AdminStatus.INACTIVE
              ? "Inactive"
              : "Suspended"}
          </Badge>
        );
      },
      sortable: true,
    },
    {
      key: "createdAt",
      header: "Created Date",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return (
          <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {convertDate(value, "DD/MM/YYYY h:mm:ss a")}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: "updatedAt",
      header: "Updated Date",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return (
          <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {convertDate(value, "DD/MM/YYYY h:mm:ss a")}
          </span>
        );
      },
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
      omit: !checkEditDeleteModulePermissions(
        ModuleName.ADMINMANAGEMENT,
        admin
      ),
    },
  ];
};
