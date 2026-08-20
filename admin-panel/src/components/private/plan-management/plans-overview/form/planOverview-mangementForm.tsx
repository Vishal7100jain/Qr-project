"use client";

import {
  CreatePlanPostAction,
  fetchPlansOverviewByIdAction,
  IPlanPostManagementItem,
  UpdatePlanPostAction,
} from "@/action/planManagementAction/planOverviewAction";
import { customToast } from "@/components/customToast";
import InputField from "@/components/form/input/InputField";
import SingleSelect from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { PlanStatusEnum, PlanTypeEnum } from "@/constants/adminEnum";
import { ModuleName } from "@/constants/permissionEnums";
import {
  CreatePlanSchema,
  UpdatePlanSchema,
} from "@/schema/planManagementSchema";
import { getChangedFields } from "@/utils/common";
import { useModuleStore } from "@/zustand/module.store";
import { useFormik } from "formik";
import { CircleX, Upload, UploadCloudIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPercentage } from "react-icons/fa";
import { FaFileCirclePlus, FaFolder, FaIndianRupeeSign } from "react-icons/fa6";
import { GrPlan } from "react-icons/gr";
import { MdOutlineDescription } from "react-icons/md";
import { TbCategory2 } from "react-icons/tb";
import slugify from "slugify";

const planOptions = [
  {
    label: "HAIR",
    value: PlanTypeEnum.HAIR,
  },
  {
    label: "MAKEUP",
    value: PlanTypeEnum.MAKEUP,
  },
  {
    label: "MEHNDI",
    value: PlanTypeEnum.MEHNDI,
  },
  {
    label: "NAIL",
    value: PlanTypeEnum.NAIL,
  },
];

const FormAccessPermission = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { Id, clearModule } = useModuleStore();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [addPage] = useState(pathName.includes("/add"));
  const [data, setData] = useState<IPlanPostManagementItem | null>(null);

  const initialValues: any = useMemo(
    () => ({
      planType:
        data?.planType !== undefined ? data.planType : PlanTypeEnum.MEHNDI,
      planName: data?.planName || "",
      planDescription: data?.planDescription || "",
      slug: data?.slug || "",
      price: data?.price || { monthly: 0, yearly: 0 },
      discount: data?.discount || {
        monthly: { amount: 0, percentage: 0 },
        yearly: { amount: 0, percentage: 0 },
      },
      limits: data?.limits || {
        maxPortfolio: 0,
        maxImagesPerPortfolio: 0,
      },
      status: data?.status !== undefined ? data.status : PlanStatusEnum.ACTIVE,
    }),
    [data]
  );

  const formikState = useFormik({
    initialValues,
    validationSchema: addPage ? CreatePlanSchema : UpdatePlanSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let response;

        if (addPage) {
          response = await CreatePlanPostAction(values);
        } else {
          const payload = getChangedFields(values, data || {});
          if (Object.keys(payload).length === 0) {
            customToast.error("No changes detected");
            return;
          }
          // @ts-ignore
          response = await UpdatePlanPostAction(Id, payload);
        }

        if (response?.status === "success") {
          customToast.success(
            response?.message ||
              `Plan ${addPage ? "created" : "updated"} successfully!`
          );
          router.push("/plans-overview");
        } else {
          throw new Error(response?.message || "Operation failed");
        }
      } catch (error: any) {
        customToast.error(
          error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const fetchPlansOverviewById = useCallback(
    async (id: string) => {
      setFetchLoading(true);
      try {
        const response = await fetchPlansOverviewByIdAction(id);
        if (response?.status === "error") {
          customToast.error(response?.message);
          return router.back();
        }
        if (response?.data) {
          setData(response?.data as any);
        }
      } catch (error: any) {
        customToast.error(error.message);
      } finally {
        setFetchLoading(false);
      }
    },
    [router]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    formikState.handleChange(e);

    const slug = slugify(value, {
      lower: true,
      strict: true,
      trim: true,
    });
    formikState.setFieldValue("slug", slug);
  };

  useEffect(() => {
    if (addPage) {
      clearModule();
      setData(null);
    } else {
      fetchPlansOverviewById(Id);
    }
  }, [Id, addPage, fetchPlansOverviewById, clearModule]);

  useEffect(() => {
    if (!addPage) {
      const { Id } = useModuleStore.getState();
      if (Id.length === 0) {
        router.push("/plans-overview");
      } else {
        fetchPlansOverviewById(Id);
      }
    } else {
      clearModule();
    }
  }, [Id, fetchPlansOverviewById, addPage, clearModule, router]);

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg mb-6">
        <form onSubmit={formikState.handleSubmit} className="w-full p-4">
          {fetchLoading ? (
            <div className="flex justify-center items-center h-full w-full mt-5">
              <h5 className="text-black dark:text-white">
                Loading...
                <Loader className="bg-brand-500" />
              </h5>
            </div>
          ) : (
            <>
              {/* Plan Name + Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <InputField
                    label="Plan Name"
                    type="text"
                    placeholder="Enter plan name"
                    formik={formikState}
                    name="planName"
                    maxLength={255}
                    //@ts-ignore
                    onChange={handleTitleChange}
                    icon={
                      <TbCategory2 className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Slug"
                    type="text"
                    placeholder="Slug will be auto-generated"
                    formik={formikState}
                    name="slug"
                    maxLength={100}
                    disabled
                    icon={
                      <TbCategory2 className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
              </div>

              {/* Plan Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <SingleSelect
                    label="Plan Type"
                    placeholder="Select plan type"
                    formik={formikState}
                    name="planType"
                    options={planOptions}
                    onChange={(value: string) =>
                      formikState.setFieldValue("planType", value)
                    }
                    icon={
                      <GrPlan className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Price Description"
                    type="text"
                    placeholder="Enter plan price description"
                    formik={formikState}
                    name="planDescription"
                    icon={
                      <MdOutlineDescription
                        size={20}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    }
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <InputField
                    label="Price Monthly"
                    type="number"
                    placeholder="Enter plan price monthly"
                    formik={formikState}
                    name="price.monthly"
                    icon={
                      <FaIndianRupeeSign className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Price Yearly"
                    type="number"
                    placeholder="Enter plan price yearly"
                    formik={formikState}
                    name="price.yearly"
                    icon={
                      <FaIndianRupeeSign className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
              </div>

              {/* Discounts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <InputField
                    label="Discount Monthly (Amount)"
                    type="number"
                    placeholder="Enter discount amount"
                    formik={formikState}
                    name="discount.monthly.amount"
                    icon={
                      <FaIndianRupeeSign className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Discount Monthly (%)"
                    type="number"
                    placeholder="Enter discount %"
                    formik={formikState}
                    name="discount.monthly.percentage"
                    icon={
                      <FaPercentage className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <InputField
                    label="Discount Yearly (Amount)"
                    type="number"
                    placeholder="Enter discount amount"
                    formik={formikState}
                    name="discount.yearly.amount"
                    icon={
                      <FaIndianRupeeSign className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Discount Yearly (%)"
                    type="number"
                    placeholder="Enter discount %"
                    formik={formikState}
                    name="discount.yearly.percentage"
                    icon={
                      <FaPercentage className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
              </div>

              {/* Limits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <InputField
                    label="Max Portfolio"
                    type="number"
                    placeholder="Enter max portfolio"
                    formik={formikState}
                    name="limits.maxPortfolio"
                    icon={
                      <FaFolder className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
                <div>
                  <InputField
                    label="Max Images per Portfolio"
                    type="number"
                    placeholder="Enter max images per portfolio"
                    formik={formikState}
                    name="limits.maxImagesPerPortfolio"
                    icon={
                      <FaFileCirclePlus className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <Switch
                    label="Status"
                    checked={
                      formikState.values.status === PlanStatusEnum.ACTIVE
                    }
                    onChange={(isActive) => {
                      formikState.setFieldValue(
                        "status",
                        isActive
                          ? PlanStatusEnum.ACTIVE
                          : PlanStatusEnum.INACTIVE
                      );
                    }}
                    disabled={fetchLoading}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-start">
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => router.back()}
                  variant="outline"
                  className="px-6 py-2.5"
                >
                  <CircleX className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
                {addPage ? (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="primary"
                    className="px-6 py-2.5"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {isLoading ? "Submitting..." : "Submit"}
                    {isLoading && <Loader className="ml-2" />}
                  </Button>
                ) : (
                  <EditRestrictionCard moduleName={ModuleName.PLANS}>
                    <Button
                      type="submit"
                      disabled={!formikState.dirty || isLoading}
                      className="px-6 py-2.5"
                      variant="primary"
                    >
                      <UploadCloudIcon className="h-5 w-5 mr-2" />
                      {isLoading ? "Updating..." : "Update"}
                      {isLoading && <Loader className="ml-2" />}
                    </Button>
                  </EditRestrictionCard>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormAccessPermission;
