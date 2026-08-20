"use client";

import {
  CreateBlogCategoryAction,
  fetchBlogCategoryByIdAction,
  UpdateBlogCategoryAction,
} from "@/action/blogManagementAction/blogCategoryManagementAction";
import { customToast } from "@/components/customToast";
import InputField from "@/components/form/input/InputField";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { ModuleName } from "@/constants/permissionEnums";
import { BlogStatus } from "@/enums/adminEnums";
import {
  CreateBlogCategorySchema,
  UpdateBlogCategorySchema,
} from "@/schema/blogCategoryManagementSchema";
import { getChangedFields } from "@/utils/common";
import { useModuleStore } from "@/zustand/module.store";
import { useFormik } from "formik";
import { CircleX, Upload, UploadCloudIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TbCategory2 } from "react-icons/tb";
import slugify from "slugify";

interface ICreateBlogCategoryManagement {
  name: string;
  slug: string;
  status: BlogStatus.ACTIVE;
}

const IPOManagmentFrom = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { Id, clearModule } = useModuleStore();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [addPage] = useState(pathName.includes("/add"));
  const [data, setData] = useState<ICreateBlogCategoryManagement | null>(null);

  const initialValues: any = useMemo(
    () => ({
      name: data?.name || "",
      slug: data?.slug || "",
      status: data?.status !== undefined ? data.status : BlogStatus.ACTIVE,
    }),
    [data]
  );

  const formikState = useFormik({
    initialValues,
    validationSchema: addPage
      ? CreateBlogCategorySchema
      : UpdateBlogCategorySchema,
    enableReinitialize: true,

    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let response;
        if (!addPage) {
          const payload = getChangedFields(values, data || {});
          if (Object.keys(payload).length === 0) {
            customToast.error("No changes detected");
            return;
          }

          if (Object.keys(payload).length > 0) {
            // @ts-ignore
            response = await UpdateBlogCategoryAction(Id, payload);
          } else {
            customToast.error("No changes detected");
            return;
          }
        } else {
          response = await CreateBlogCategoryAction(values);
        }

        if (response?.status === "success") {
          customToast.success(
            `Blog category ${addPage ? "created" : "updated"} successfully!`
          );
          router.push("/IPO-management");
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

  const fetchBlogCategoryById = useCallback(
    async (id: string) => {
      setFetchLoading(true);
      try {
        const response = await fetchBlogCategoryByIdAction(id);
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
      fetchBlogCategoryById(Id);
    }
  }, [Id, addPage, fetchBlogCategoryById, clearModule]);

  useEffect(() => {
    if (!addPage) {
      const { Id } = useModuleStore.getState();
      if (Id.length === 0) {
        router.push("/IPO-managment");
      } else {
        fetchBlogCategoryById(Id);
      }
    } else {
      clearModule();
    }
  }, [Id, fetchBlogCategoryById, addPage, clearModule, router]);

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <InputField
                    label="Title"
                    type="text"
                    placeholder="Enter category name"
                    formik={formikState}
                    name="name"
                    maxLength={55}
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
                    maxLength={55}
                    disabled
                    icon={
                      <TbCategory2 className="text-gray-500 dark:text-gray-400" />
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <Switch
                    label="Status"
                    checked={formikState.values.status === BlogStatus.ACTIVE}
                    onChange={(isActive) => {
                      formikState.setFieldValue(
                        "status",
                        isActive ? BlogStatus.ACTIVE : BlogStatus.INACTIVE
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
                  <EditRestrictionCard moduleName={ModuleName.ACCESSMANAGEMENT}>
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

export default IPOManagmentFrom;
