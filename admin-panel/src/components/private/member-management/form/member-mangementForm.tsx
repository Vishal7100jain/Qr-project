"use client";

import {
  CreateMemberAction,
  fetchMemberByIdAction,
  IMemberManagementItem,
  UpdateMemberAction,
} from "@/action/memberMangement/memberManagementAction";
import { customToast } from "@/components/customToast";
import InputField from "@/components/form/input/InputField";
import SingleSelect from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { ModuleName } from "@/constants/permissionEnums";
import { GenderType } from "@/enums/adminEnums";
import { useModal } from "@/hooks/useModal";
import {
  CreateMemberSchema,
  UpdateMemberSchema,
} from "@/schema/memberManagementSchema";
import { ImageCropper } from "@/utils/canvasPreview";
import {
  appendChangedFieldsToFormData,
  checkViewApiPermission,
} from "@/utils/common";
import { useModuleStore } from "@/zustand/module.store";
import { useFormik } from "formik";
import {
  CircleX,
  Mail,
  Phone,
  Upload,
  UploadCloudIcon,
  User2,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiOutline } from "react-icons/bi";
import { GrStreetView } from "react-icons/gr";
import { IoShareSocialOutline } from "react-icons/io5";
import { PiCity } from "react-icons/pi";
import { TbBuildingEstate, TbMapPinCode, TbWorldPin } from "react-icons/tb";
import "react-image-crop/dist/ReactCrop.css";

const genderOptions = [
  { value: GenderType.MALE, label: "Male" },
  { value: GenderType.FEMALE, label: "Female" },
];

const authTypeOptions = [
  { value: "Custom", label: "Custom" },
  { value: "Google", label: "Google" },
  { value: "Facebook", label: "Facebook" },
];

const FormAccessPermission = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { Id, clearModule } = useModuleStore();
  const [imgSrc, setImgSrc] = useState<string>("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addPage] = useState(pathName.includes("/add"));
  const [data, setData] = useState<IMemberManagementItem | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [fileChanged, setFileChanged] = useState(false);
  const [profilePhotoError, setProfilePhotoError] = useState<string | null>(
    null
  );

  const initialValues: any = useMemo(
    () => ({
      fullName: data?.fullName || "",
      email: data?.email || "",
      phoneNumber: data?.phoneNumber?.toString() || "",
      gender: data?.gender || GenderType.MALE,
      street: data?.address?.street || "",
      city: data?.address?.city || "",
      state: data?.address?.state || "",
      country: data?.address?.country || "",
      pincode: data?.address?.pincode || "",
      isAddressVerified:
        data?.address?.isAddressVerified !== undefined
          ? data.address.isAddressVerified
          : true,
      profilePhoto:
        !addPage && data?.profilePic
          ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${data.profilePic}`
          : "",
      profilePic: data?.profilePic || null,
      bio: data?.bio || "",
    }),
    [data, addPage]
  );

  const formikState = useFormik({
    initialValues,
    validationSchema: addPage ? CreateMemberSchema : UpdateMemberSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setFieldError }) => {
      setIsLoading(true);
      try {
        const formData = new FormData();

        appendChangedFieldsToFormData(
          formData,
          values,
          data || {},
          ["password"],
          fileChanged,
          ["profilePic"]
        );

        if (!addPage && Array.from(formData.keys()).length === 0) {
          customToast.error("No changes detected");
          return;
        }

        let response;
        if (addPage) {
          response = await CreateMemberAction(formData);
        } else {
          response = await UpdateMemberAction(Id, formData);
        }

        if (response?.status === "success") {
          customToast.success(
            response?.message ||
              `Member ${addPage ? "created" : "updated"} successfully!`
          );
          router.push("/member-management");
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

        const schema = addPage ? CreateMemberSchema : UpdateMemberSchema;
        await schema.validateAt("profilePic", { profilePic: file });

        setFileChanged(true);

        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgSrc(reader.result?.toString() || "");
          openModal();
        });
        reader.readAsDataURL(file);

        formikState.setFieldValue("profilePic", file);
      }
    } catch (error: any) {
      setProfilePhotoError(error.message);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const fetchMemberById = useCallback(
    async (id: string) => {
      setFetchLoading(true);
      try {
        const response = await fetchMemberByIdAction(id);
        if (response?.status === "error") {
          customToast.error(response?.message);
          return router.back();
        }
        if (response?.data) {
          setData(response.data as IMemberManagementItem);
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
    if (!addPage) {
      const { Id } = useModuleStore.getState();
      if (
        Id.length === 0 ||
        !checkViewApiPermission(ModuleName.MEMBER_MANAGEMENT)
      ) {
        router.push("/member-management");
      } else {
        fetchMemberById(Id);
      }
    } else {
      clearModule();
    }
  }, [Id, fetchMemberById, addPage, clearModule, router]);

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
                    htmlFor="profilePic"
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
                            formikState.setFieldValue("profilePic", null);
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
                    id="profilePic"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById("profilePic")?.click()}
                  className="text-md font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  Upload Photo
                </button>
                {profilePhotoError && (
                  <p className="mt-2 text-md text-red-600 dark:text-red-400 text-center w-full">
                    {profilePhotoError}
                  </p>
                )}
                {formikState.touched.profilePic &&
                  formikState.errors.profilePic && (
                    <p className="mt-2 text-sm text-error-500 dark:text-error-400 text-center w-full">
                      {formikState.errors.profilePic as string}
                    </p>
                  )}
              </div>

              {/* Form Fields - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                {/* Row 1 */}
                <InputField
                  label="Full Name"
                  type="text"
                  placeholder="Enter full name"
                  icon={
                    <User2
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                  formik={formikState}
                  name="fullName"
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

                {/* Row 2 */}
                <InputField
                  label="Phone Number"
                  type="text"
                  placeholder="Enter phone number"
                  icon={
                    <Phone
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                  formik={formikState}
                  name="phoneNumber"
                  maxLength={15}
                />

                <InputField
                  label="Bio"
                  type="text"
                  placeholder="Enter bio"
                  icon={
                    <BiOutline
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                  formik={formikState}
                  name="bio"
                  maxLength={250}
                />

                {/* Row 3 */}
                <SingleSelect
                  onChange={(value) =>
                    formikState.setFieldValue("authType", value)
                  }
                  label="Auth Type"
                  name="authType"
                  id="authType"
                  className="w-full"
                  formik={formikState}
                  placeholder="Select auth type"
                  options={authTypeOptions}
                  value="Custom"
                  disabled={true}
                  icon={
                    <IoShareSocialOutline
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />

                <SingleSelect
                  onChange={(value) =>
                    formikState.setFieldValue("gender", value)
                  }
                  label="Gender"
                  name="gender"
                  id="gender"
                  className="w-full"
                  formik={formikState}
                  placeholder="Select gender"
                  options={genderOptions}
                  icon={
                    <User2
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />

                {/* Row 4 */}
                <InputField
                  label="Street"
                  type="text"
                  placeholder="Enter street address"
                  formik={formikState}
                  name="street"
                  maxLength={100}
                  icon={
                    <GrStreetView
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />

                <InputField
                  label="Pincode"
                  type="text"
                  placeholder="Enter pincode"
                  formik={formikState}
                  name="pincode"
                  maxLength={10}
                  icon={
                    <TbMapPinCode
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />

                {/* Row 5 */}
                <InputField
                  label="City"
                  type="text"
                  placeholder="Enter city"
                  formik={formikState}
                  name="city"
                  maxLength={50}
                  icon={
                    <PiCity
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="State"
                    type="text"
                    placeholder="Enter state"
                    formik={formikState}
                    name="state"
                    maxLength={50}
                    icon={
                      <TbBuildingEstate
                        size={18}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    }
                  />

                  <InputField
                    label="Country"
                    type="text"
                    placeholder="Enter country"
                    formik={formikState}
                    name="country"
                    maxLength={50}
                    icon={
                      <TbWorldPin
                        size={18}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    }
                  />
                </div>

                {/* Address Verification - Full Width */}
                <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Switch
                    label="Address Verified"
                    checked={formikState.values.isAddressVerified}
                    onChange={(isVerified) => {
                      formikState.setFieldValue(
                        "isAddressVerified",
                        isVerified
                      );
                    }}
                  />
                </div>
              </div>

              <ImageCropper
                setFieldValue={(field, value) => {
                  formikState.setFieldValue(field, value);
                  if (field === "profilePic") setFileChanged(true);
                }}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                isOpen={isOpen}
                onClose={closeModal}
              />

              <div className="flex flex-col sm:flex-row gap-3 justify-start pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => router.back()}
                  variant="outline"
                >
                  <CircleX className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
                {addPage ? (
                  <Button type="submit" disabled={isLoading} variant="primary">
                    <Upload className="h-5 w-5 mr-2" />
                    {isLoading ? "Submitting..." : "Submit"}
                    {isLoading && <Loader className="ml-2" />}
                  </Button>
                ) : (
                  <EditRestrictionCard
                    moduleName={ModuleName.MEMBER_MANAGEMENT}
                  >
                    <Button
                      type="submit"
                      disabled={
                        (!formikState.dirty && !fileChanged) || isLoading
                      }
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
