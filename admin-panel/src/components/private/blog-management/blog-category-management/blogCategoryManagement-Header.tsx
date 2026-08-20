"use client";

import { ColumnConfig } from "@/components/tables/ListTable";
import DeleteRestrictionCard from "@/components/ui/Restriction/DeleteRestrictionCard";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";

import { ModuleName } from "@/constants/permissionEnums";
import { checkEditDeleteModulePermissions, convertDate } from "@/utils/common";

import { useAdminStore } from "@/zustand/admin.store";
import { useModuleStore } from "@/zustand/module.store";

import { PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

import { DeleteBlogCategoryByIdAction } from "@/action/blogManagementAction/blogCategoryManagementAction";
import Badge from "@/components/ui/badge/Badge";
import { BlogStatus } from "@/enums/adminEnums";

const TableAction = ({ categoryId }: { categoryId: string }) => {
  const router = useRouter();
  const setRefetchApi = useModuleStore((state) => state.setRefetchApi);
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteItem() {
    if (!categoryId) {
      Swal.fire({
        title: "Error!",
        text: "No category ID provided",
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
      const response = await DeleteBlogCategoryByIdAction({ id: categoryId });
      if (response?.status === "success") {
        Swal.fire({
          title: "Success!",
          text: response?.message || "Access deleted successfully",
          icon: "success",
        });
        setRefetchApi();
      } else {
        throw new Error(response?.message || "Failed to delete blog category");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to delete blog category",
        icon: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleEdit = () => {
    useModuleStore.getState().setModule(categoryId, ModuleName.BLOG_CATEGORY);
    router.push("/blog-category-management/edit");
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <EditRestrictionCard moduleName={ModuleName.BLOG_CATEGORY}>
          <PencilLine
            className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleEdit}
            size={20}
          />
        </EditRestrictionCard>
        <DeleteRestrictionCard moduleName={ModuleName.BLOG_CATEGORY}>
          <Trash2
            className={`${
              isDeleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } text-red-500 hover:text-red-700 text-xl transition-colors`}
            onClick={!isDeleting ? deleteItem : undefined}
            size={20}
          />
        </DeleteRestrictionCard>
      </div>
    </>
  );
};

export const BlogCategoryManagementColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "name",
      header: "Title",
      type: "text",

      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      type: "text",
      align: "left",
      headerClassName: "justify-start",

      render: (value: any) => (
        <p className="text-gray-800 dark:text-gray-200 break-words">{value}</p>
      ),
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
          value == BlogStatus.ACTIVE
            ? "success"
            : value == BlogStatus.INACTIVE
            ? "warning"
            : "error";

        return (
          <Badge color={badgeColor}>
            {value == BlogStatus.ACTIVE
              ? "Active"
              : value == BlogStatus.INACTIVE
              ? "Inactive"
              : "Suspended"}
          </Badge>
        );
      },
      sortable: true,
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
      key: "updatedAt",
      header: "Updated Date & Time",
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

      render: (id: any) => <TableAction categoryId={id} />,
      omit: !checkEditDeleteModulePermissions(ModuleName.BLOG_CATEGORY, admin),
    },
  ];
};
