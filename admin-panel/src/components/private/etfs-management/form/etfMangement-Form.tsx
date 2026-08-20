"use client";

import {
  AddETFAction,
  EditETFAction,
  fetchETFBySkAction,
  UploadETFListCSVAction,
} from "@/action/etfsManagementAction/etfsManagementAction";
import { customToast } from "@/components/customToast";
import InputField from "@/components/form/input/InputField";
import SingleSelect from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import { useModal } from "@/hooks/useModal";
import {
  CreateETFSchema,
  UpdateETFSchema,
  UploadETFListCSVSchema,
} from "@/schema/etfManagementSchema";
import { getChangedFields } from "@/utils/common";
import { useModuleStore } from "@/zustand/module.store";
import { useFormik } from "formik";
import { CircleX, UploadCloudIcon, User2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaFileAlt, FaPencilAlt } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { GrAdd } from "react-icons/gr";
import CsvInstructions from "../csvInstructions";
import { LogoImageCropper } from "../logo-cropper";

const ETFTypeOptions = [
  { label: "Silver", value: "silver" },
  { label: "Gold", value: "gold" },
  { label: "Index", value: "index" },
];

const AddETFForm = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { Id, clearModule } = useModuleStore();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [addPage] = useState(pathName.includes("/add"));
  const [data, setData] = useState<any | null>(null);
  const [isUploadCSV, SetIsUploadCSV] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const { isOpen, openModal, closeModal } = useModal();
  const [fileChanged, setFileChanged] = useState(false);

  const initialValues: any = useMemo(() => {
    if (isUploadCSV) {
      return { csvData: "" };
    }
    return {
      sk: data?.sk || "",
      tp: data?.tp || "",
      ud: data?.ud || "",
      sn: data?.sn || "",
      logo: data?.logo || "",
      logoFile: null,
      logoUrl: data?.logo || "",
    };
  }, [isUploadCSV, data]);

  const formikState = useFormik({
    initialValues,
    validationSchema: isUploadCSV
      ? UploadETFListCSVSchema
      : addPage
        ? CreateETFSchema
        : UpdateETFSchema,
    enableReinitialize: true,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let response: any;

        if (isUploadCSV) {
          const formData = new FormData();
          formData.append("ETF-list", values?.csvData);
          response = await UploadETFListCSVAction(formData);
        } else {
          if (addPage) {
            const formData = new FormData();
            formData.append("sk", values.sk);
            formData.append("tp", values.tp);
            formData.append("ud", values.ud);
            formData.append("sn", values.sn);

            if (imgSrc && values.logoFile) {
              formData.append("logo", values.logoFile);
            } else if (values.logoUrl && !imgSrc) {
              formData.append("logoUrl", values.logoUrl);
            }

            response = await AddETFAction(formData);
          } else {
            // EDIT MODE
            const payload = getChangedFields(values, data || {});
            const { logoFile, logo, logoUrl, ...restPayload } = payload;

            // Check if there are any changes
            const hasFileChange = fileChanged && logoFile;
            const hasUrlChange = logoUrl && logoUrl !== data?.logo;
            const hasOtherChanges = Object.keys(restPayload).length > 0;

            if (!hasFileChange && !hasUrlChange && !hasOtherChanges) {
              customToast.error("No changes detected");
              setIsLoading(false);
              return;
            }

            const formData = new FormData();

            // Handle logo changes
            if (hasFileChange) {
              // User uploaded a new file
              formData.append("logo", logoFile);
              console.log("Uploading new logo file");
            } else if (hasUrlChange) {
              // User changed the URL
              formData.append("logoUrl", logoUrl);
              console.log("Updating logo URL:", logoUrl);
            }

            // Append other changed fields
            Object.keys(restPayload).forEach((key) => {
              formData.append(key, restPayload[key]);
            });

            // Log what we're sending
            console.log("FormData contents:");
            for (let pair of formData.entries()) {
              console.log(pair[0], pair[1]);
            }

            response = await EditETFAction(Id, formData);
          }
        }

        if (response?.status === "success") {
          customToast.success(
            response?.message ||
              `ETF ${addPage ? "created" : "updated"} successfully!`
          );

          // Clean up blob URLs
          if (imgSrc && imgSrc.startsWith("blob:")) {
            URL.revokeObjectURL(imgSrc);
          }

          // Clear state
          setImgSrc("");
          setFileChanged(false);
          clearModule();

          // Navigate back and force refresh
          router.push("/etf-management");
          router.refresh(); // This forces Next.js to refetch data
        } else {
          customToast.error(
            response?.message || "An unexpected error occurred"
          );
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    try {
      if (file) {
        if (file.size > 1024 * 1024) {
          customToast.error("File size must be less than 1MB");
          return;
        }

        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const result = reader.result?.toString() || "";
          setImgSrc(result);
          openModal();
        });
        reader.readAsDataURL(file);

        // Clear URL when file is selected
        formikState.setFieldValue("logoUrl", "");
        formikState.setFieldValue("logo", "");
      }
    } catch (error: any) {
      customToast.error(error.message);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const fetchETFBySk = useCallback(
    async (Id: string) => {
      setFetchLoading(true);
      try {
        const response = await fetchETFBySkAction(Id);
        if (response?.status === "error") {
          customToast.error(response?.message);
          return router.back();
        }
        if (response?.data) {
          setData(response?.data as any);
          // Reset states when data is loaded
          setImgSrc("");
          setFileChanged(false);
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
      setImgSrc("");
      setFileChanged(false);
    } else if (Id) {
      fetchETFBySk(Id);
    }
  }, [Id, addPage, fetchETFBySk, clearModule]);

  useEffect(() => {
    if (!addPage) {
      const { Id } = useModuleStore.getState();
      if (Id.length === 0) {
        router.push("/etf-management");
      } else {
        fetchETFBySk(Id);
      }
    } else {
      clearModule();
    }
  }, [Id, fetchETFBySk, addPage, clearModule, router]);

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (imgSrc && imgSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [imgSrc]);

  const getLogoPreview = useCallback(() => {
    // Priority: cropped image > form logo value > empty
    if (imgSrc && imgSrc.startsWith("blob:")) return imgSrc;
    if (imgSrc && imgSrc.startsWith("data:")) return imgSrc;
    if (formikState.values.logo) return formikState.values.logo;
    if (formikState.values.logoUrl) return formikState.values.logoUrl;
    return "";
  }, [imgSrc, formikState.values.logo, formikState.values.logoUrl]);

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg mb-6">
        <form onSubmit={formikState.handleSubmit} className="w-full p-4">
          <div className="flex justify-end">
            <Switch
              label="Upload CSV"
              onChange={() => SetIsUploadCSV((pre) => !pre)}
              checked={isUploadCSV}
              className={"mb-2"}
            />
          </div>

          <div className="flex flex-row w-full">
            {isUploadCSV ? (
              <div className="mb-2">
                <InputField
                  type="file"
                  className="cursor-pointer"
                  placeholder="Upload list of ETFs (csv : must contain sk header)"
                  formik={formikState}
                  label="Upload list of ETFs"
                  name="csvData"
                  onChange={(e: any) => {
                    const file = e?.currentTarget?.files?.[0];
                    if (!file) return;
                    formikState.setFieldTouched("csvData", true, false);
                    formikState.setFieldValue("csvData", file);
                  }}
                  icon={
                    <FaFileAlt
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />
              </div>
            ) : (
              <>
                {fetchLoading ? (
                  <div className="flex justify-center items-center h-full w-full mt-5">
                    <h5 className="text-black dark:text-white">
                      Loading...
                      <Loader className="bg-brand-500" />
                    </h5>
                  </div>
                ) : (
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col items-center mb-6 relative">
                      <div className="relative w-24 h-24 mb-4">
                        <label
                          htmlFor="logoFile"
                          className="cursor-pointer block w-full h-full"
                        >
                          {getLogoPreview() ? (
                            <>
                              <Image
                                src={getLogoPreview()}
                                alt="Logo Preview"
                                fill
                                className="rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                                unoptimized={
                                  getLogoPreview().startsWith("blob:") ||
                                  getLogoPreview().startsWith("data:")
                                }
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();

                                  // Clean up blob URL if exists
                                  if (imgSrc && imgSrc.startsWith("blob:")) {
                                    URL.revokeObjectURL(imgSrc);
                                  }

                                  formikState.setFieldValue("logo", "");
                                  formikState.setFieldValue("logoFile", null);
                                  formikState.setFieldValue("logoUrl", "");
                                  setImgSrc("");
                                  setFileChanged(false);
                                }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors z-10"
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
                          id="logoFile"
                          className="hidden"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("logoFile")?.click()
                        }
                        className="text-md font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                      >
                        Upload Logo
                      </button>
                      {formikState.touched.logoFile &&
                        formikState.errors.logoFile && (
                          <p className="mt-2 text-sm text-error-500 dark:text-error-400">
                            {formikState.errors.logoFile as string}
                          </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      {/* First Row: SK and TP */}
                      <div className="flex flex-row gap-3 w-full">
                        <div className="w-1/2">
                          <InputField
                            type="text"
                            placeholder="Enter the ETF Symbol"
                            formik={formikState}
                            className="cursor-pointer"
                            label="ETF Symbol"
                            name="sk"
                            maxLength={205}
                            disabled={!addPage}
                            icon={
                              <FaPencilAlt
                                size={18}
                                className="text-gray-500 dark:text-gray-400"
                              />
                            }
                          />
                        </div>

                        <div className="w-1/2">
                          <SingleSelect
                            label="ETF Type"
                            options={ETFTypeOptions}
                            placeholder="Select ETF Type"
                            onChange={(value: string) =>
                              formikState.setFieldValue("tp", value)
                            }
                            formik={formikState}
                            name="tp"
                            id="tp"
                            icon={
                              <FaPencilAlt
                                size={18}
                                className="text-gray-500 dark:text-gray-400"
                              />
                            }
                          />
                        </div>
                      </div>

                      {/* Second Row: UD and SN */}
                      <div className="flex flex-row gap-3 w-full">
                        <div className="w-1/2">
                          <InputField
                            type="text"
                            placeholder="Enter the Underlying Asset"
                            formik={formikState}
                            className="cursor-pointer"
                            label="Underlying Asset"
                            name="ud"
                            maxLength={205}
                            icon={
                              <FaPencilAlt
                                size={18}
                                className="text-gray-500 dark:text-gray-400"
                              />
                            }
                          />
                        </div>

                        <div className="w-1/2">
                          <InputField
                            type="text"
                            placeholder="Enter the ETF Name"
                            formik={formikState}
                            className="cursor-pointer"
                            label="ETF Name"
                            name="sn"
                            maxLength={205}
                            icon={
                              <FaPencilAlt
                                size={18}
                                className="text-gray-500 dark:text-gray-400"
                              />
                            }
                          />
                        </div>
                      </div>

                      {/* Third Row: Logo URL */}
                      <div className="flex flex-row gap-3 w-full">
                        <div className="w-full">
                          <InputField
                            type="text"
                            placeholder="Enter logo image URL"
                            formik={formikState}
                            name="logoUrl"
                            label="Logo URL"
                            onChange={(e: any) => {
                              const newUrl = e.target.value;
                              formikState.setFieldValue("logoUrl", newUrl);

                              // Clear file upload if user enters URL
                              if (newUrl) {
                                // Clean up blob URL if exists
                                if (imgSrc && imgSrc.startsWith("blob:")) {
                                  URL.revokeObjectURL(imgSrc);
                                }

                                formikState.setFieldValue("logoFile", null);
                                setImgSrc("");
                                setFileChanged(false);
                              }
                            }}
                            icon={
                              <FaLink
                                size={18}
                                className="text-gray-500 dark:text-gray-400"
                              />
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {isUploadCSV && <CsvInstructions />}

          <div className="flex flex-col sm:flex-row gap-3 justify-start mt-4">
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => {
                // Clean up blob URL before navigation
                if (imgSrc && imgSrc.startsWith("blob:")) {
                  URL.revokeObjectURL(imgSrc);
                }
                router.back();
              }}
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
                <GrAdd className="h-5 w-5 mr-2" />
                {isLoading ? "Submitting..." : "Submit"}
                {isLoading && <Loader className="ml-2" />}
              </Button>
            ) : (
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
            )}
          </div>
        </form>
      </div>

      {/* Image Cropper Modal */}
      <LogoImageCropper
        setFieldValue={(field, value) => {
          if (field === "profilePhoto") {
            setImgSrc(value);
            formikState.setFieldValue("logo", value);
          }

          if (field === "profilePhotoFile") {
            formikState.setFieldValue("logoFile", value);
            setFileChanged(true);
          }
        }}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default AddETFForm;
