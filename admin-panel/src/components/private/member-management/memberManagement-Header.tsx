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
  DeleteMemberByIdAction,
  IMemberManagementItem,
} from "@/action/memberMangement/memberManagementAction";
import GenericDetailsModal from "@/components/common/detailsModal";
import { VerifiedEnum } from "@/constants/adminEnum";
import { DeletedEnum, GenderType } from "@/enums/adminEnums";
import Image from "next/image";
import { useState } from "react";

const handleImageUrl = (image?: string, needDefault: boolean = true) => {
  if (image) {
    return process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + image;
  } else if (needDefault) {
    return "/images/user/owner.jpg";
  }
  return "";
};

const TableAction = ({
  memberId,
  data,
}: {
  memberId: string;
  data: IMemberManagementItem;
}) => {
  const router = useRouter();
  const setRefetchApi = useModuleStore((state) => state.setRefetchApi);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setShowDetailsModal] = useState(false);

  async function deleteItem(memberId: string) {
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
      let response = await DeleteMemberByIdAction({ id: memberId });

      if (response?.status === "success") {
        Swal.fire({
          title: "Successfully Deleted",
          text: response?.message || "Admin account has been deleted.",
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
        text: "Failed to delete the admin account. Please try again later.",
        icon: "error",
        confirmButtonColor: "#0e7490",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleEdit = () => {
    useModuleStore.getState().setModule(memberId, ModuleName.MEMBER_MANAGEMENT);
    return router.push("/member-management/edit");
  };

  const handleDelete = () => {
    deleteItem(memberId);
  };

  return (
    <>
      <div className="flex gap-2 items-center w-full justify-center">
        <EyeIcon
          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          size={20}
          onClick={() => setShowDetailsModal(true)}
        />
        <EditRestrictionCard moduleName={ModuleName.MEMBER_MANAGEMENT}>
          <PencilLine
            className="text-blue-500 text-xl cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleEdit}
            size={20}
          />
        </EditRestrictionCard>
        <DeleteRestrictionCard moduleName={ModuleName.MEMBER_MANAGEMENT}>
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
        title="Member Details"
        description="Information about the selected member"
        image={handleImageUrl(data?.profilePic, false)}
        data={{
          _id: data?._id,
          fullName: data?.fullName ?? "-",
          email: data?.email ?? "-",
          phoneNumber: data?.phoneNumber ?? "-",
          gender: data?.gender === GenderType.MALE ? "Male" : "Female",
          authType: data?.authType ?? "-",
          street: data?.address?.street ?? "-",
          city: data?.address?.city ?? "-",
          state: data?.address?.state ?? "-",
          country: data?.address?.country ?? "-",
          pincode: data?.address?.pincode ?? "-",
          isAddressVerified: data?.address?.isAddressVerified,
          bio: data?.bio || "NA",
          socialAuthId: data?.socialAuthId ?? "-",
          isVerifiedEmail: VerifiedEnum[Number(data?.isVerifiedEmail)],
          isVerifiedNumber: VerifiedEnum[Number(data?.isVerifiedNumber)],
          isVerified: VerifiedEnum[Number(data?.isVerified)],
          isDeleted: DeletedEnum[Number(data?.isDeleted)],
          createdAt: data?.createdAt ?? "-",
          updatedAt: data?.updatedAt ?? "-",
        }}
        fieldLabels={{
          fullName: "Full Name",
          email: "Email Address",
          gender: "Gender",
          phoneNumber: "Contact Number",
          authType: "Auth Type",
          address: "Address",
          bio: "Bio",
          createdAt: "Created On",
          updatedAt: "Last Updated",
        }}
      />
    </>
  );
};

export const MemberManagementColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  return [
    {
      key: "fullName",
      header: "Full Name",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any, data: any) => {
        return (
          <div className="flex flex-row items-center gap-2">
            <div className="w-10 h-10 relative">
              <Image
                src={handleImageUrl(data?.profilePic, true)}
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
      key: "phoneNumber",
      header: "Contact Number",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return <p className="text-gray-800 dark:text-gray-200">{value}</p>;
      },
    },

    {
      key: "isVerified",
      header: "Verification Status",
      type: "badge",
      align: "center",
      headerClassName: "justify-start",
      render: (value: any, data) => {
        const badgeColor =
          value == VerifiedEnum.VERIFIED ? "success" : "warning";

        const isDeleted = Number(data?.isDeleted) == DeletedEnum.DELETED;
        const deleted = `(${DeletedEnum[
          Number(data?.isDeleted)
        ].toLowerCase()})`;

        const label =
          value == VerifiedEnum.VERIFIED
            ? `Verified ${isDeleted ? deleted : ""}`
            : `Not Verified ${isDeleted ? deleted : ""}`;

        return <Badge color={badgeColor}>{label}</Badge>;
      },
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
        return <TableAction memberId={id} data={row} />;
      },
      omit: !checkEditDeleteModulePermissions(
        ModuleName.MEMBER_MANAGEMENT,
        admin
      ),
    },
  ];
};
