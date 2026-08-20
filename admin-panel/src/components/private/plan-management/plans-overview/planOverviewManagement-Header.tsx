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
  DeletePlanPostByIdAction,
  IPlanPostManagementItem,
} from "@/action/planManagementAction/planOverviewAction";
import GenericDetailsModal from "@/components/common/detailsModal";
import { PlanStatusEnum, PlanTypeEnum } from "@/constants/adminEnum";
import { useState } from "react";

const TableAction = ({
  planId,
  data,
}: {
  planId: string;
  data: IPlanPostManagementItem;
}) => {
  const router = useRouter();
  const setRefetchApi = useModuleStore((state) => state.setRefetchApi);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setShowDetailsModal] = useState(false);

  async function deleteItem(planId: string) {
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
      const response = await DeletePlanPostByIdAction({ id: planId });

      if (response?.status === "success") {
        Swal.fire({
          title: "Successfully Deleted",
          text: response?.message || "Plan has been deleted.",
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
    useModuleStore.getState().setModule(planId, ModuleName.PLANS);
    return router.push("/plans-overview/edit");
  };

  const handleDelete = () => {
    deleteItem(planId);
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <EyeIcon
          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          size={20}
          onClick={() => setShowDetailsModal(true)}
        />
        <EditRestrictionCard moduleName={ModuleName.PLANS}>
          <PencilLine
            className="text-blue-500 text-xl cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleEdit}
            size={20}
          />
        </EditRestrictionCard>
        <DeleteRestrictionCard moduleName={ModuleName.PLANS}>
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
        title="Plan Details"
        description="Information about the selected plan"
        data={{
          planName: data?.planName ?? "-",
          planType:
            data?.planType === PlanTypeEnum.MEHNDI
              ? "Mehndi"
              : data?.planType === PlanTypeEnum.NAIL
              ? "Nail"
              : data?.planType === PlanTypeEnum.MAKEUP
              ? "Makeup"
              : data?.planType === PlanTypeEnum.HAIR
              ? "Hair"
              : "-",
          slug: data?.slug ?? "-",
          priceMonthly: data?.price?.monthly ?? "-",
          priceYearly: data?.price?.yearly ?? "-",
          discountMonthly: `${data?.discount?.monthly?.amount} (${data?.discount?.monthly?.percentage}%)`,
          discountYearly: `${data?.discount?.yearly?.amount} (${data?.discount?.yearly?.percentage}%)`,
          maxPortfolio: data?.limits?.maxPortfolio ?? "-",
          maxImagesPerPortfolio: data?.limits?.maxImagesPerPortfolio ?? "-",
          status:
            data?.status === PlanStatusEnum.ACTIVE ? "Active" : "Inactive",
          createdBy: data?.createdBy ?? "-",
          modifiedBy: data?.modifiedBy ?? "-",
          createdAt: data?.createdAt ?? "-",
          updatedAt: data?.updatedAt ?? "-",
        }}
        fieldLabels={{
          planName: "Plan Name",
          planType: "Plan Type",
          slug: "Slug",
          priceMonthly: "Monthly Price",
          priceYearly: "Yearly Price",
          discountMonthly: "Monthly Discount",
          discountYearly: "Yearly Discount",
          maxPortfolio: "Max Portfolios",
          maxImagesPerPortfolio: "Max Images / Portfolio",
          status: "Status",
          createdBy: "Created By",
          modifiedBy: "Modified By",
          createdAt: "Created On",
          updatedAt: "Last Updated",
        }}
      />
    </>
  );
};

export const PlanOverviewManagementColumn =
  (): ColumnConfig<IPlanPostManagementItem>[] => {
    const admin = useAdminStore((state) => state.admin);

    return [
      {
        key: "planName",
        header: "Plan Name",
        type: "text",
        render: (value: any) => (
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            {value}
          </p>
        ),
      },
      {
        key: "price",
        header: "Price Monthly",
        type: "text",
        render: (_: any, row: IPlanPostManagementItem) => (
          <span>₹ {row?.price?.monthly?.toFixed(2) ?? "0.00"}</span>
        ),
        align: "center",
      },
      {
        key: "discount",
        header: "Discount Monthly",
        type: "text",
        render: (_: any, row: IPlanPostManagementItem) => (
          <span>
            {row?.discount?.monthly?.percentage?.toFixed(2) ?? "0.00"} %
          </span>
        ),
        align: "center",
      },
      {
        key: "price",
        header: "Price Yearly",
        type: "text",
        render: (_: any, row: IPlanPostManagementItem) => (
          <span>₹ {row?.price?.yearly?.toFixed(2) ?? "0.00"}</span>
        ),
        align: "center",
      },
      {
        key: "discount",
        header: "Discount Yearly",
        type: "text",
        render: (_: any, row: IPlanPostManagementItem) => (
          <span>
            {row?.discount?.yearly?.percentage?.toFixed(2) ?? "0.00"} %
          </span>
        ),
        align: "center",
      },
      {
        key: "createdBy",
        header: "Created By",
        type: "text",
      },
      {
        key: "status",
        header: "Status",
        type: "badge",
        badgeConfig: {
          colorMap: {
            [PlanStatusEnum.ACTIVE]: "success",
            [PlanStatusEnum.INACTIVE]: "error",
          },
        },
        render: (value: number) => (
          <Badge color={value === PlanStatusEnum.ACTIVE ? "success" : "error"}>
            {value === PlanStatusEnum.ACTIVE ? "Active" : "Inactive"}
          </Badge>
        ),
        sortable: true,
      },
      {
        key: "createdAt",
        header: "Created Date & Time",
        type: "text",
        render: (value: string) => (
          <span className="text-gray-600 dark:text-gray-300">
            {convertDate(value, "DD/MM/YYYY h:mm:ss a")}
          </span>
        ),
        sortable: true,
      },
      {
        key: "_id",
        header: "Actions",
        type: "text",
        render: (id: string, row: IPlanPostManagementItem) => {
          return <TableAction planId={id} data={row} />;
        },
        omit: !checkEditDeleteModulePermissions(ModuleName.PLANS, admin),
      },
    ];
  };
