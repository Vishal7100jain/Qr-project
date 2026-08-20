"use client";

import {
  CreateAdminAction,
  fetchAdminByIdAction,
  getRoleListAction,
  UpdateAdminAction,
} from "@/action/adminMangement/adminManagementAction";
import { customToast } from "@/components/customToast";
import InputField from "@/components/form/input/InputField";
import SingleSelect from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { ModuleName } from "@/constants/permissionEnums";
import { AdminStatusEnum } from "@/enums/adminEnums";
import { useModal } from "@/hooks/useModal";
import { EyeCloseIcon } from "@/icons";
import {
  CreateAdminSchema,
  UpdateAdminSchema,
} from "@/schema/adminManagementSchema";
import { ImageCropper } from "@/utils/canvasPreview";
import {
  appendChangedFieldsToFormData,
  checkViewApiPermission,
} from "@/utils/common";
import { IAdmin } from "@/zustand/admin.store";
import { useModuleStore } from "@/zustand/module.store";
import { useFormik } from "formik";
import {
  CircleX,
  EyeIcon,
  Lock,
  Mail,
  Phone,
  Upload,
  UploadCloudIcon,
  User2,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { AdminManagementPasswordModal } from "../AdminManagementPasswordModal";

interface IRoleOption {
  value: string;
  label: string;
  name?: string;
}

export interface ICreateAdmin {
  username: string;
  email: string;
  password: string;
  contactNumber: string;
  roleId: string;
  status: AdminStatusEnum;
  profilePhoto: string;
  profilePhotoFile: File | null;
}

const FormAccessPermission = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const { Id, clearModule } = useModuleStore();
  const [imgSrc, setImgSrc] = useState<string>("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addPage] = useState(pathName.includes("/add"));
  const [data, setData] = useState<IAdmin | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [roleList, setRoleList] = useState<IRoleOption[]>([]);
  const [fileChanged, setFileChanged] = useState(false);
  const [superAdminPassword, setSuperAdminPassword] = useState("");
  const [otherSuperAdminPassword, setOtherSuperAdminPassword] = useState("");
  const [showSuperAdminPasswordModal, setShowSuperAdminPasswordModal] =
    useState(false);
  const [
    showOtherSuperAdminPasswordModal,
    setShowOtherSuperAdminPasswordModal,
  ] = useState(false);
  const [profilePhotoError, setProfilePhotoError] = useState<string | null>(
    null
  );

  const handleSubmitWithPassword = () => {
    formikState.submitForm();
  };

  const initialValues: any = useMemo(
    () => ({
      username: data?.username || "",
      email: data?.email || "",
      password: "",
      contactNumber: data?.contactNumber?.toString() || "",
      roleId: data?.roleId?._id || "",
      status:
        data?.status !== undefined
          ? Number(data.status)
          : AdminStatusEnum.ACTIVE,
      profilePhoto:
        !addPage && data?.profileImage
          ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${data.profileImage}`
          : "",
      profilePhotoFile: null,
    }),
    [data, addPage]
  );

  const formikState = useFormik({
    initialValues,
    validationSchema: addPage ? CreateAdminSchema : UpdateAdminSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setFieldError }) => {
      setIsLoading(true);
      try {
        const formData = new FormData();

        if (values.password) {
          formData.append("password", values.password);
        }

        appendChangedFieldsToFormData(
          formData,
          values,
          data || {},
          ["password"],
          fileChanged,
          ["profilePhotoFile"]
        );

        if (!addPage && Array.from(formData.keys()).length === 0) {
          customToast.error("No changes detected");
          return;
        }

        let response;
        if (addPage) {
          response = await CreateAdminAction(formData);
        } else {
          response = await UpdateAdminAction(Id, formData);
        }

        if (response?.status === "success") {
          customToast.success(
            response?.message ||
              `Admin ${addPage ? "created" : "updated"} successfully!`
          );
          router.push("/admin-management");
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (String(formikState.values.roleId) !== String(data?.roleId)) {
      const newRole = roleList.find(
        (r) => r.value === formikState.values.roleId
      );
      const oldRole = data?.roleId
        ? roleList.find((r) => String(r.value) === String(data.roleId))
        : null;

      if (newRole?.label === "super_admin") {
        setShowSuperAdminPasswordModal(true);
        return;
      } else if (oldRole?.label === "super_admin") {
        setShowOtherSuperAdminPasswordModal(true);
        return;
      }
    }

    formikState.handleSubmit(e);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    setProfilePhotoError(null);

    try {
      if (file) {
        if (file.size > 1024 * 1024) {
          customToast.error("File size must be less than 1MB");
          return;
        }
        const schema = addPage ? CreateAdminSchema : UpdateAdminSchema;
        await schema.validateAt("profilePhotoFile", { profilePhotoFile: file });

        setFileChanged(true);

        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgSrc(reader.result?.toString() || "");
          openModal();
        });
        reader.readAsDataURL(file);

        formikState.setFieldValue("profilePhotoFile", file);
      }
    } catch (error: any) {
      setProfilePhotoError(error.message);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const fetchAdminById = useCallback(
    async (id: string) => {
      setFetchLoading(true);
      try {
        const response = await fetchAdminByIdAction(id);
        if (response?.status === "error") {
          customToast.error(response?.message);
          return router.back();
        }
        if (response?.data) {
          setData(response.data as IAdmin);
        }
      } catch (error: any) {
        customToast.error(error.message);
      } finally {
        setFetchLoading(false);
      }
    },
    [router]
  );

  const fetchRolesList = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response = await getRoleListAction();
      if (response?.status === "success") {
        const formattedData: IRoleOption[] = response.data.map((role: any) => ({
          label: role.name,
          value: role._id,
          name: role.name,
        }));
        setRoleList(formattedData);
      }
    } catch (error: any) {
      customToast.error(error.message);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolesList();
  }, [fetchRolesList]);

  useEffect(() => {
    if (!addPage) {
      const { Id } = useModuleStore.getState();
      if (
        Id.length === 0 ||
        !checkViewApiPermission(ModuleName.ADMINMANAGEMENT)
      ) {
        router.push("/admin-management");
      } else {
        fetchAdminById(Id);
      }
    } else {
      clearModule();
    }
  }, [Id, fetchAdminById, addPage, clearModule, router]);

  useEffect(() => {
    return () => {
      if (formikState.values.profilePhoto?.startsWith("blob:")) {
        URL.revokeObjectURL(formikState.values.profilePhoto);
      }
    };
  }, [formikState.values.profilePhoto]);

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg mb-6">
        <form onSubmit={handleSubmit} className="w-full p-4">
          {fetchLoading ? (
            <div className="flex justify-center items-center h-full w-full mt-5">
              <h5 className="text-black dark:text-white">
                Loading...
                <Loader className="bg-brand-500" />
              </h5>
            </div>
          ) : (
            <>
              {/* Profile Photo Upload Section */}
              <div className="flex flex-col items-center mb-8 relative">
                <div className="relative w-24 h-24 mb-4">
                  <label
                    htmlFor="profilePhotoFile"
                    className="cursor-pointer block w-full h-full"
                  >
                    {formikState.values.profilePhoto ? (
                      <>
                        <Image
                          src={formikState.values.profilePhoto}
                          alt="Profile Preview"
                          fill
                          className="rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                          onLoad={() =>
                            URL.revokeObjectURL(formikState.values.profilePhoto)
                          }
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            formikState.setFieldValue("profilePhoto", "");
                            formikState.setFieldValue("profilePhotoFile", null);
                            setFileChanged(false);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                        >
                          <CircleX size={20} />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                        <User2
                          size={24}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    id="profilePhotoFile"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("profilePhotoFile")?.click()
                  }
                  className="text-md font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  Upload Photo
                </button>
                {profilePhotoError && (
                  <p className="mt-2 text-md text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {profilePhotoError}
                  </p>
                )}
                {formikState.touched.profilePhotoFile &&
                  formikState.errors.profilePhotoFile && (
                    <p className="mt-2 text-sm text-error-500 dark:text-error-400 absolute bottom-[-25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      {typeof formikState?.errors?.profilePhotoFile == "string"
                        ? formikState?.errors?.profilePhotoFile
                        : "some validation error in profilePhotoFile formik state"}
                    </p>
                  )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <InputField
                    label="Username"
                    type="text"
                    placeholder="Enter username"
                    icon={
                      <User2
                        size={18}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    }
                    formik={formikState}
                    name="username"
                    maxLength={55}
                  />
                  <InputField
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                    icon={
                      <Mail
                        size={18}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    }
                    formik={formikState}
                    name="email"
                    maxLength={255}
                  />
                </div>

                <div className="space-y-4">
                  <InputField
                    label="Contact Number"
                    type="text"
                    placeholder="Enter contact number"
                    icon={
                      <Phone
                        size={18}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    }
                    formik={formikState}
                    name="contactNumber"
                    maxLength={15}
                  />
                  <div className="flex justify-center items-center relative">
                    <InputField
                      label="Password"
                      name="password"
                      placeholder={"Enter password"}
                      type={showPassword ? "text" : "password"}
                      maxLength={20}
                      formik={formikState}
                      icon={
                        <Lock
                          size={18}
                          className="text-gray-500 dark:text-gray-400"
                        />
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[43%] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeIcon size={18} />
                      ) : (
                        <EyeCloseIcon size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Switch
                      label="Status"
                      checked={
                        formikState.values.status === AdminStatusEnum.ACTIVE
                      }
                      onChange={(isActive) => {
                        formikState.setFieldValue(
                          "status",
                          isActive
                            ? AdminStatusEnum.ACTIVE
                            : AdminStatusEnum.INACTIVE
                        );
                      }}
                    />
                  </div>
                  <div>
                    <SingleSelect
                      onChange={(value) => {}}
                      label="Role"
                      name="roleId"
                      id="roleId"
                      className="w-full"
                      formik={formikState}
                      placeholder="Select role"
                      options={roleList}
                      icon={
                        <User2
                          size={16}
                          className="text-gray-500 dark:text-gray-400"
                        />
                      }
                    />
                  </div>
                </div>
              </div>

              <ImageCropper
                setFieldValue={(field, value) => {
                  if (field === "profilePhoto") {
                    formikState.setFieldValue("profilePhoto", value);
                  }
                  if (field === "profilePhotoFile") {
                    formikState.setFieldValue("profilePhotoFile", value);
                    setFileChanged(true);
                  }
                }}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                isOpen={isOpen}
                onClose={closeModal}
              />

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
                  <EditRestrictionCard moduleName={ModuleName.ADMINMANAGEMENT}>
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
      <AdminManagementPasswordModal
        isOpen={showSuperAdminPasswordModal}
        onClose={() => {
          setShowSuperAdminPasswordModal(false);
          setSuperAdminPassword("");
        }}
        password={superAdminPassword}
        setPassword={setSuperAdminPassword}
        onSubmit={handleSubmitWithPassword}
        isLoading={isLoading}
        title="Promote to Super Admin"
        warningText="You are about to promote an admin to Super Admin!"
        description="Please enter your Super Admin password to confirm this critical action:"
        actionLabel="Confirm Promotion"
      />{" "}
      {/* Other Super Admin Password Modal */}{" "}
      <AdminManagementPasswordModal
        isOpen={showOtherSuperAdminPasswordModal}
        onClose={() => {
          setShowOtherSuperAdminPasswordModal(false);
          setOtherSuperAdminPassword("");
        }}
        password={otherSuperAdminPassword}
        setPassword={setOtherSuperAdminPassword}
        onSubmit={handleSubmitWithPassword}
        isLoading={isLoading}
        title="Demote Super Admin"
        warningText="You are about to demote a Super Admin account!"
        description="Please enter the password of the Super Admin you are trying to demote to confirm this critical action:"
        actionLabel="Confirm Demotion"
      />{" "}
    </div>
  );
};
export default FormAccessPermission;
