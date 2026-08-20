"use client";

import { ColumnConfig } from "@/components/tables/ListTable";
import Badge from "@/components/ui/badge/Badge";
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
  DeleteBlogPostByIdAction,
  IBlogPostManagementItem,
} from "@/action/blogManagementAction/blogPostManagementAction";
import GenericDetailsModal from "@/components/common/detailsModal";
import { BlogPostStatus, BlogType, RoleEnum } from "@/enums/adminEnums";
import { useState } from "react";

const TableAction = ({
  blogPostId,
  data,
}: {
  blogPostId: string;
  data: IBlogPostManagementItem;
}) => {
  const router = useRouter();
  const setRefetchApi = useModuleStore((state) => state.setRefetchApi);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setShowDetailsModal] = useState(false);

  async function deleteItem(blogPostId: string) {
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

    setIsDeleting(true);
    try {
      const response = await DeleteBlogPostByIdAction({ id: blogPostId });

      if (response?.status === "success") {
        Swal.fire({
          title: "Successfully Deleted",
          text: response?.message || "Blog post has been deleted.",
          icon: "success",
          confirmButtonColor: "#0e7490",
        });
        setRefetchApi();
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
        text: "Failed to delete the blog post. Please try again later.",
        icon: "error",
        confirmButtonColor: "#0e7490",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleEdit = () => {
    useModuleStore.getState().setModule(blogPostId, ModuleName.BLOG_POST);
    return router.push("/blog-post-management/edit");
  };

  const handleDelete = () => {
    deleteItem(blogPostId);
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <EyeIcon
          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          size={20}
          onClick={() => setShowDetailsModal(true)}
        />
        <EditRestrictionCard moduleName={ModuleName.BLOG_POST}>
          <PencilLine
            className="text-blue-500 text-xl cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleEdit}
            size={20}
          />
        </EditRestrictionCard>
        <DeleteRestrictionCard moduleName={ModuleName.BLOG_POST}>
          <Trash2
            className={`${
              isDeleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } text-red-500 hover:text-red-700 text-xl transition-colors`}
            onClick={!isDeleting ? handleDelete : undefined}
            size={20}
          />
        </DeleteRestrictionCard>
      </div>

      <GenericDetailsModal
        isOpen={isOpen}
        onClose={() => setShowDetailsModal(false)}
        title="Blog Post Details"
        description="Information about the selected blog post"
        data={{
          title: data?.title ?? "-",
          categorySlug: data?.categorySlug ?? "-",
          description: data?.description ?? "-",
          slug: data?.slug ?? "-",
          content: data?.content ?? "-",
          status:
            data?.status === BlogPostStatus.DRAFT
              ? "Draft"
              : data?.status === BlogPostStatus.PENDING
              ? "Pending"
              : data?.status === BlogPostStatus.PUBLISHED
              ? "Published"
              : "-",
          tags: data?.tags.length <= 0 ? "No Tags" : data?.tags ?? "-",
          views: data?.views ?? "-",
          likes: data?.likes ?? "-",
          type:
            data?.type === BlogType.isFeatured
              ? "Featured Blog Post"
              : data?.type === BlogType.isLatest
              ? "Latest Blog Post"
              : data?.type === BlogType.normal
              ? "Normal Blog Post"
              : "-",
          contentLength: data?.contentLength ?? "-",
          hasImage: data?.hasImage ?? "-",
          createdByRole:
            data?.createdByRole === RoleEnum.ADMIN
              ? "Admin"
              : data?.createdByRole === RoleEnum.ARTIST
              ? "Artist"
              : data?.createdByRole
              ? "Member"
              : "-",
          thumbnail: data?.thumbnail ?? "-",
          createdBy: data?.createdBy ?? "-",
          modifiedBy: data?.modifiedBy ?? "-",
          createdAt: data?.createdAt ?? "-",
          updatedAt: data?.updatedAt ?? "-",
        }}
        fieldLabels={{
          title: "Blog Title",
          categorySlug: "Category",
          description: "Description",
          content: "Content",
          views: "Views",
          status: "Blog Post Status",
          createdBy: "Created By",
          modifiedBy: "Modified By",
          createdAt: "Created On",
          updatedAt: "Last Updated",
        }}
      />
    </>
  );
};

export const BlogPostManagementColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "title",
      header: "Title",
      type: "custom",
      render: (value: any) => {
        const truncated =
          value && value.length > 10 ? value.substring(0, 10) + "..." : value;
        return <p className="text-gray-800 dark:text-gray-200">{truncated}</p>;
      },
    },
    {
      key: "slug",
      header: "Slug",
      type: "custom",
      render: (value: any) => {
        const truncated =
          value && value.length > 10 ? value.substring(0, 10) + "..." : value;
        return <p className="text-gray-800 dark:text-gray-200">{truncated}</p>;
      },
    },

    {
      key: "status",
      header: "Status",
      type: "badge",
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
          value == BlogPostStatus.PUBLISHED
            ? "success"
            : value == BlogPostStatus.PENDING
            ? "warning"
            : "error";

        return (
          <Badge color={badgeColor}>
            {value == BlogPostStatus.PUBLISHED
              ? "Published"
              : value == BlogPostStatus.PENDING
              ? "Pending"
              : "Draft"}
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
      render: (value: any) => {
        return (
          <span className="text-gray-600 dark:text-gray-300">
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
      render: (id: any, row) => {
        return <TableAction blogPostId={id} data={row} />;
      },
      omit: !checkEditDeleteModulePermissions(ModuleName.BLOG_POST, admin),
    },
  ];
};
