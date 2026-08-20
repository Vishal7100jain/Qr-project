"use client";

import { GetAccessPermissionsList } from "@/action/accessMangement/accessManagementAction";
import {
  CreateRoleAction,
  fetchRoleByIdAction,
  IRoleManagementItem,
  UpdateRoleAction,
} from "@/action/roleManagementAction/roleManagementAction";
import { customToast } from "@/components/customToast";
import Checkbox from "@/components/form/input/Checkbox";
import InputField from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { ModuleName } from "@/constants/permissionEnums";
import {
  CreateRoleSchema,
  UpdateRoleSchema,
} from "@/schema/roleManagementSchema";
import { useModuleStore } from "@/zustand/module.store";
import { useFormik } from "formik";
import { CircleX, Upload, UploadCloudIcon, UserCog } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Module {
  _id: string;
  moduleName: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  modifiedBy: string;
}

const CreateRoleForm = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { Id, clearModule } = useModuleStore();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [addPage] = useState(pathName.includes("/add"));
  const [modules, setModules] = useState<Module[]>([]);
  const [data, setData] = useState<IRoleManagementItem | null>(null);
  const [isProtectedRole, setIsProtectedRole] = useState(false);

  const fetchModules = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response = await GetAccessPermissionsList();
      if (response?.status === "success") {
        setModules(response?.data || []);
      }
      if (response?.status === "error") {
        customToast.error(response?.message);
      }
    } catch (error: any) {
      customToast.error(error.message);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  const fetchRoleManagementById = useCallback(
    async (id: string) => {
      setFetchLoading(true);
      try {
        const response = await fetchRoleByIdAction(id);
        if (response?.status === "error") {
          customToast.error(response?.message);
          return router.back();
        }
        if (
          response?.data &&
          typeof response.data === "object" &&
          !Array.isArray(response.data)
        ) {
          const roleData = response.data as IRoleManagementItem;
          setData(roleData);
          const protectedRoles = ["default", "super_admin"];
          if (
            roleData.name &&
            protectedRoles.includes(roleData.name.toLowerCase())
          ) {
            setIsProtectedRole(true);
          }
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
    fetchModules();
  }, [fetchModules]);

  useEffect(() => {
    if (addPage) {
      clearModule();
      setData(null);
      setIsProtectedRole(false);
    } else {
      fetchRoleManagementById(Id);
    }
  }, [Id, addPage, fetchRoleManagementById, clearModule]);

  useEffect(() => {
    if (!addPage) {
      const { Id } = useModuleStore.getState();
      if (Id.length === 0) {
        router.push("/role-management");
      } else {
        fetchRoleManagementById(Id);
      }
    } else {
      clearModule();
    }
  }, [Id, fetchRoleManagementById, addPage, clearModule, router]);

  const initialValues: any = useMemo(
    () => ({
      name: data?.name || "",
      access: data?.access || [],
    }),
    [data]
  );

  const formikState = useFormik({
    initialValues,
    validationSchema: addPage ? CreateRoleSchema : UpdateRoleSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let response;

        if (!addPage) {
          const payload: any = { access: values.access };

          if (values.name !== data?.name && !isProtectedRole) {
            payload.name = values.name;
          }

          response = await UpdateRoleAction(Id, payload);
        } else {
          response = await CreateRoleAction(values);
        }

        if (response?.status === "success") {
          customToast.success(
            `Role ${addPage ? "created" : "updated"} successfully!`
          );
          router.push("/role-management");
          router.refresh();
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

  const handlePermissionChange = (
    moduleName: string,
    permission: string,
    isChecked: boolean
  ) => {
    const currentAccess = [...(formikState.values.access || [])];
    const moduleIndex = currentAccess.findIndex(
      (item) => item.module === moduleName
    );

    if (moduleIndex === -1) {
      if (isChecked) {
        currentAccess.push({
          module: moduleName,
          permissions: [permission],
        });
      }
    } else {
      if (isChecked) {
        if (!currentAccess[moduleIndex].permissions.includes(permission)) {
          currentAccess[moduleIndex].permissions.push(permission);
        }
      } else {
        currentAccess[moduleIndex].permissions = currentAccess[
          moduleIndex
        ].permissions.filter((p: any) => p !== permission);

        if (currentAccess[moduleIndex].permissions.length === 0) {
          currentAccess.splice(moduleIndex, 1);
        }
      }
    }

    formikState.setFieldValue("access", currentAccess);
    // Manually mark the field as touched to trigger dirty state
    formikState.setFieldTouched("access", true, false);
  };

  const isPermissionChecked = (moduleName: string, permission: string) => {
    const module = formikState.values.access?.find(
      (item: any) => item.module === moduleName
    );
    return module ? module.permissions.includes(permission) : false;
  };

  // Helper function to check if form has changes
  const hasFormChanges = useMemo(() => {
    if (addPage) return true;

    // Check if name changed (only if not protected)
    if (!isProtectedRole && formikState.values.name !== data?.name) {
      return true;
    }

    // Deep compare access arrays
    const currentAccess = formikState.values.access || [];
    const originalAccess = data?.access || [];

    // Sort both arrays for comparison
    const sortAccess = (access: any[]) => {
      return [...access]
        .map((item) => ({
          module: item.module,
          permissions: [...item.permissions].sort(),
        }))
        .sort((a, b) => a.module.localeCompare(b.module));
    };

    const sortedCurrent = sortAccess(currentAccess);
    const sortedOriginal = sortAccess(originalAccess);

    // Compare lengths
    if (sortedCurrent.length !== sortedOriginal.length) {
      return true;
    }

    // Compare each module and its permissions
    for (let i = 0; i < sortedCurrent.length; i++) {
      if (sortedCurrent[i].module !== sortedOriginal[i].module) {
        return true;
      }

      if (
        sortedCurrent[i].permissions.length !==
        sortedOriginal[i].permissions.length
      ) {
        return true;
      }

      for (let j = 0; j < sortedCurrent[i].permissions.length; j++) {
        if (
          sortedCurrent[i].permissions[j] !== sortedOriginal[i].permissions[j]
        ) {
          return true;
        }
      }
    }

    return false;
  }, [formikState.values, data, isProtectedRole, addPage]);

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
              <div className="grid grid-cols-1 gap-6 mb-6">
                {/* Role Name Field */}
                <div className="w-1/2">
                  <InputField
                    type="text"
                    placeholder="Enter role name"
                    formik={formikState}
                    label="Role Name"
                    name="name"
                    maxLength={35}
                    disabled={isProtectedRole && !addPage}
                    icon={
                      <UserCog
                        size={18}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    }
                  />
                  {isProtectedRole && !addPage && (
                    <p className="text-sm text-gray-500">
                      This is a protected role and cannot be renamed.
                    </p>
                  )}
                </div>

                {/* Permissions Section */}
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Access Rights
                    <span className="text-error-500 ml-1">*</span>
                  </label>
                  {formikState.touched.access && formikState.errors.access && (
                    <div className="text-error-500 text-sm mb-2">
                      {formikState.errors.access as string}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modules.map((module) => {
                      const allPermissions = module.permissions;
                      const selectedModule = formikState.values.access?.find(
                        (item: any) => item.module === module.moduleName
                      ) || { permissions: [] };
                      const allSelected =
                        allPermissions.length > 0 &&
                        allPermissions.every((p) =>
                          selectedModule.permissions.includes(p)
                        );

                      return (
                        <div
                          key={module._id}
                          className="border rounded-lg p-4 bg-white dark:bg-gray-800 flex flex-col justify-between min-h-[100px]"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4
                              id={`select-all-${module._id}`}
                              className="font-medium capitalize dark:text-white cursor-pointer select-none"
                              onClick={() => {
                                const currentAccess = [
                                  ...(formikState.values.access || []),
                                ];

                                if (allSelected) {
                                  // Uncheck all permissions for this module
                                  formikState.setFieldValue(
                                    "access",
                                    currentAccess.filter(
                                      (item) =>
                                        item.module !== module.moduleName
                                    )
                                  );
                                } else {
                                  // Select all permissions for this module
                                  formikState.setFieldValue("access", [
                                    ...currentAccess.filter(
                                      (item) =>
                                        item.module !== module.moduleName
                                    ),
                                    {
                                      module: module.moduleName,
                                      permissions: [...allPermissions],
                                    },
                                  ]);
                                }
                                // Mark as touched
                                formikState.setFieldTouched(
                                  "access",
                                  true,
                                  false
                                );
                              }}
                            >
                              {module.moduleName}
                            </h4>

                            <Checkbox
                              id={`select-all-${module._id}`}
                              checked={allSelected}
                              onChange={(checked) => {
                                const currentAccess = [
                                  ...(formikState.values.access || []),
                                ];
                                if (checked) {
                                  formikState.setFieldValue("access", [
                                    ...currentAccess.filter(
                                      (item) =>
                                        item.module !== module.moduleName
                                    ),
                                    {
                                      module: module.moduleName,
                                      permissions: [...allPermissions],
                                    },
                                  ]);
                                } else {
                                  formikState.setFieldValue(
                                    "access",
                                    currentAccess.filter(
                                      (item) =>
                                        item.module !== module.moduleName
                                    )
                                  );
                                }
                                // Mark as touched
                                formikState.setFieldTouched(
                                  "access",
                                  true,
                                  false
                                );
                              }}
                            />
                          </div>

                          <div className="flex gap-4 flex-wrap">
                            {allPermissions.map((permission) => (
                              <Checkbox
                                key={`${module._id}-${permission}`}
                                id={`${module._id}-${permission}`}
                                checked={isPermissionChecked(
                                  module.moduleName,
                                  permission
                                )}
                                onChange={(checked) =>
                                  handlePermissionChange(
                                    module.moduleName,
                                    permission,
                                    checked
                                  )
                                }
                                label={
                                  permission.charAt(0).toUpperCase() +
                                  permission.slice(1)
                                }
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                  <EditRestrictionCard moduleName={ModuleName.ROLEMANAGEMENT}>
                    <Button
                      type="submit"
                      disabled={!hasFormChanges || isLoading}
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

export default CreateRoleForm;
