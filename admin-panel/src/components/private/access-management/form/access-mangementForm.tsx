"use client";

import {
  CreateAccessManagementAction,
  fetchAccessByIdAction,
  UpdateAccessAction,
} from "@/action/accessMangement/accessManagementAction";
import { customToast } from "@/components/customToast";
import Checkbox from "@/components/form/input/Checkbox";
import InputField from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { ModuleName } from "@/constants/permissionEnums";
import {
  CreateAccessSchema,
  UpdateAccessSchema,
} from "@/schema/accessManagementSchema";
import { getChangedFields } from "@/utils/common";
import { useModuleStore } from "@/zustand/module.store";
import { useFormik } from "formik";
import { CircleX, Upload, UploadCloudIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RiSoundModuleFill } from "react-icons/ri";

interface ICreateAccessManagement {
  moduleName: string;
  permissions: string[];
}

const permissionOptions = [
  { value: "view", label: "View" },
  { value: "create", label: "Create" },
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Delete" },
];

const FormAccessPermission = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { Id, clearModule } = useModuleStore();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [addPage] = useState(pathName.includes("/add"));
  const [data, setData] = useState<ICreateAccessManagement | null>(null);

  const initialValues: any = useMemo(
    () => ({
      moduleName: data?.moduleName || "",
      permissions: data?.permissions || [],
    }),
    [data]
  );

  const formikState = useFormik({
    initialValues,
    validationSchema: addPage ? CreateAccessSchema : UpdateAccessSchema,
    enableReinitialize: true,

    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let response;

        if (addPage) {
          response = await CreateAccessManagementAction(values);
        } else {
          const payload = getChangedFields(values, data || {});

          if (Object.keys(payload).length === 0) {
            customToast.error("No changes detected");
            return;
          }
          // @ts-ignore
          response = await UpdateAccessAction(Id, payload);
        }

        if (response?.status === "success") {
          customToast.success(
            `Access permission ${addPage ? "created" : "updated"} successfully!`
          );
          router.push("/access-management");
        } else {
          throw new Error(response?.message || "Operation failed");
        }
      } catch (error: any) {
        customToast.error(error.message || "Unexpected error");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handlePermissionChange = (permission: string) => {
    const currentPermissions = [...formikState.values.permissions];
    const permissionIndex = currentPermissions.indexOf(permission);

    if (permissionIndex === -1) {
      currentPermissions.push(permission);
    } else {
      currentPermissions.splice(permissionIndex, 1);
    }

    formikState.setFieldValue("permissions", currentPermissions);
  };

  const fetchAccessManagementById = useCallback(
    async (id: string) => {
      setFetchLoading(true);
      try {
        const response = await fetchAccessByIdAction(id);
        if (response?.status === "error") {
          customToast.error(response?.message);
          return router.back();
        }
        if (response?.data) {
          setData(response.data as ICreateAccessManagement);
        }
      } catch (error: any) {
        customToast.error(error.message);
      } finally {
        setFetchLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (addPage) {
      clearModule();
      setData(null);
    } else {
      fetchAccessManagementById(Id);
    }
  }, [Id, addPage, fetchAccessManagementById, clearModule]);

  useEffect(() => {
    if (!addPage) {
      const { Id } = useModuleStore.getState();
      if (Id.length === 0) {
        router.push("/access-management");
      } else {
        fetchAccessByIdAction(Id);
      }
    } else {
      clearModule();
    }
  }, [Id, fetchAccessByIdAction, addPage, clearModule, router]);

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Module Name Field */}
                <div>
                  <InputField
                    label="Module Name"
                    type="text"
                    placeholder="Enter module name"
                    formik={formikState}
                    name="moduleName"
                    maxLength={55}
                    icon={
                      <RiSoundModuleFill />
                      //   size={18}
                      //   className="text-gray-500 dark:text-gray-400"
                      // />
                    }
                  />
                </div>

                {/* Permissions Checkboxes */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissions
                    <span className="text-error-500 ml-1">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row xs:items-center gap-2">
                    {permissionOptions.map((permission) => (
                      <Checkbox
                        key={permission.value}
                        name="permissions"
                        label={permission.label}
                        value={permission.value}
                        checked={formikState.values.permissions.includes(
                          permission.value
                        )}
                        onChange={() =>
                          handlePermissionChange(permission.value)
                        }
                      />
                    ))}
                  </div>
                  {formikState.touched.permissions &&
                    formikState.errors.permissions && (
                      <div className="text-error-500 text-sm absolute bottom-0">
                        {formikState.errors.permissions as string}
                      </div>
                    )}
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

export default FormAccessPermission;
