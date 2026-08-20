"use client";

import {
  AddSymbolToIndexAction,
  GetIndexById,
  IIndexManagementItem,
  UpdateIndexBySk,
} from "@/action/indexManagementAction/indexManagementAction";
import { customToast } from "@/components/customToast";
import InputField from "@/components/form/input/InputField";
import SingleSelect from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { ModuleName } from "@/constants/permissionEnums";
import { useModal } from "@/hooks/useModal";
import {
  CreateIndexSchema,
  UpdateIndexBySkSchema,
} from "@/schema/indexManagementSchema";
import { getChangedFields } from "@/utils/common";
import { useModuleStore } from "@/zustand/module.store";
import { useFormik } from "formik";
import {
  CircleX,
  Landmark,
  Signal,
  UploadCloudIcon,
  User2,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaLink, FaPencilAlt } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { LogoImageCropper } from "../../stocks-management/logo-cropper";
import { IndexTypeEnum } from "../indexManagement-Header";

export const ExchangeOption = [
  { value: "NSE", label: "NSE" },
  { value: "BSE", label: "BSE" },
  { value: "MCX", label: "MCX" },
  { value: "GLOBAL", label: "GLOBAL" },
  { value: "NSEIX", label: "NSEIX" },
  { value: "CDS", label: "CDS" },
  { value: "NCO", label: "NCO" },
];

const IndexType = [
  { value: "high", label: "HIGH" },
  { value: "medium", label: "MEDIUM" },
  { value: "low", label: "LOW" },
];

const IndexManagementForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const { isOpen, openModal, closeModal } = useModal();

  const pathName = usePathname();
  const { Id, clearModule } = useModuleStore();
  const [addPage] = useState(pathName.includes("/add"));
  const [data, setData] = useState<IIndexManagementItem | null>(null);

  const initialValues: any = useMemo(
    () => ({
      sk: data?.sk || "",
      sn: data?.sn || "",
      xc: data?.xc || "",
      logoUrl: data?.logo || "",
      logoFile: undefined,
      logo: data?.logo || "",
      type: data?.type || "",
    }),
    [data]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: addPage ? CreateIndexSchema : UpdateIndexBySkSchema,
    enableReinitialize: true,
    onSubmit: async (values: any) => {
      setIsLoading(true);
      try {
        let response;

        if (!addPage) {
          // ── Edit mode ──────────────────────────────────────────────
          const payload: any = getChangedFields(values, {
            ...data,
            logoFile: null,
            logoUrl: data?.logo,
            logo: data?.logo,
          });

          if (Object.keys(payload).length === 0) {
            customToast.error("No changes detected");
            return;
          }

          const formData = new FormData();
          if (payload?.sn) formData.append("sn", payload.sn);
          if (payload?.xc) formData.append("xc", payload.xc);
          if (payload?.type) formData.append("type", payload.type);

          if (payload.logoFile) {
            formData.append("logo", payload.logoFile);
          } else if (payload.logoUrl) {
            formData.append("logoUrl", payload.logoUrl);
          }

          response = await UpdateIndexBySk(values.sk, formData);
        } else {
          // ── Add mode ───────────────────────────────────────────────
          console.log("values: ", values);
          const formData = new FormData();
          formData.append("sk", values.sk);
          if (values.sn) formData.append("sn", values.sn);
          formData.append("xc", values.xc);
          formData.append("type", values.type);

          if (values.logoFile) {
            formData.append("logo", values.logoFile);
          } else if (values.logoUrl) {
            formData.append("logoUrl", values.logoUrl);
          }

          response = await AddSymbolToIndexAction(formData);
        }

        if (response?.status === "success") {
          customToast.success(response.message);
          router.push("/indices-management");
        } else {
          customToast.error(response?.message || "Unexpected error");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  // ── Logo helpers (mirrored from StockManagementForm) ────────────────
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
          setImgSrc(reader.result?.toString() || "");
          openModal();
        });
        reader.readAsDataURL(file);
        formik.setFieldValue("logoFile", file);
      }
    } catch (error: any) {
      customToast.error(error.message);
      if (e.target) e.target.value = "";
    }
  };

  const getLogoPreview = useCallback(() => {
    if (imgSrc && formik.values.logo) return formik.values.logo;
    return "";
  }, [imgSrc, formik.values.logo]);

  // Revoke blob URLs on unmount / logo change
  useEffect(() => {
    return () => {
      if (formik.values.logo?.startsWith("blob:")) {
        URL.revokeObjectURL(formik.values.logo);
      }
    };
  }, [formik.values.logo]);

  // ── Fetch existing index ─────────────────────────────────────────────
  const fetchIndexDataById = useCallback(
    async (id: string) => {
      setFetchLoading(true);
      try {
        const response: any = await GetIndexById({ id });
        if (response?.status === "error") {
          customToast.error(response?.message);
          return router.back();
        }
        if (response?.data) {
          const normalized = {
            ...response.data,
            type: IndexTypeEnum[response.data.type],
          };
          setImgSrc(normalized.logo || "");
          setData(normalized);
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
      if (Id.length === 0) {
        router.push("/indices-management");
      } else {
        fetchIndexDataById(Id);
      }
    } else {
      clearModule();
    }
  }, [Id, fetchIndexDataById, addPage, clearModule, router]);

  // ── Change-detection for update button ──────────────────────────────
  const handleUpdateDisabled = useCallback(() => {
    const payload = getChangedFields(formik.values, {
      ...data,
      logoFile: null,
      logoUrl: data?.logo,
    });
    return Object.keys(payload || {}).length;
  }, [data, formik.values]);

  if (fetchLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg mb-6 p-4 h-full mt-5 flex justify-center items-center">
        <h5 className="text-black dark:text-white">
          Loading...
          <Loader className="bg-brand-500" />
        </h5>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg mb-6">
        <form onSubmit={formik.handleSubmit} className="w-full p-4 space-y-4">
          {/* ── Logo uploader ───────────────────────────────────────── */}
          <div className="flex flex-col items-center mb-2 relative">
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
                      onLoad={() => {
                        if (getLogoPreview().startsWith("blob:")) {
                          URL.revokeObjectURL(getLogoPreview());
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        formik.setFieldValue("logo", "");
                        formik.setFieldValue("logoFile", null);
                        setImgSrc("");
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
                id="logoFile"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <button
              type="button"
              onClick={() => document.getElementById("logoFile")?.click()}
              className="text-md font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            >
              Upload Logo
            </button>
            {formik.touched.logoFile && formik.errors.logoFile && (
              <p className="mt-2 text-sm text-error-500 dark:text-error-400">
                {formik.errors.logoFile as string}
              </p>
            )}
          </div>

          {/* ── Fields ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 w-full">
            <div className="w-full flex flex-row gap-3 justify-center items-center">
              <div className="w-1/2">
                <InputField
                  type="text"
                  placeholder="Enter Index symbol (sk)"
                  formik={formik}
                  label="Index Symbol"
                  name="sk"
                  icon={<FaPencilAlt size={18} className="text-gray-500" />}
                  required
                  disabled={!addPage}
                />
              </div>
              <div className="w-1/2">
                <InputField
                  type="text"
                  placeholder="Enter Index name (sn)"
                  formik={formik}
                  label="Index name"
                  name="sn"
                  icon={<FaPencilAlt size={18} className="text-gray-500" />}
                />
              </div>
            </div>

            <div className="w-full flex flex-row gap-3 justify-center items-center">
              <div className="w-1/2">
                <SingleSelect
                  label="Exchange"
                  options={ExchangeOption}
                  placeholder="Select Exchange"
                  onChange={(value: string) =>
                    formik.setFieldValue("xc", value)
                  }
                  formik={formik}
                  name="xc"
                  id="xc"
                  icon={<Landmark size={18} className="text-gray-500" />}
                  disabled={!addPage}
                />
              </div>
              <div className="w-1/2">
                <SingleSelect
                  label="Type"
                  options={IndexType}
                  placeholder="Select Type"
                  onChange={(value: string) =>
                    formik.setFieldValue("type", value)
                  }
                  formik={formik}
                  name="type"
                  id="type"
                  icon={
                    <Signal
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />
              </div>
            </div>

            {/* Logo URL */}
            <div className="w-full">
              <InputField
                type="text"
                placeholder="Enter logo image URL"
                formik={formik}
                name="logoUrl"
                label="Logo URL"
                icon={
                  <FaLink
                    size={18}
                    className="text-gray-500 dark:text-gray-400"
                  />
                }
              />
            </div>
          </div>

          {/* ── Submit / Update ────────────────────────────────────── */}
          {addPage ? (
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              className="px-6 py-2.5 mt-2"
            >
              <GrAdd className="h-5 w-5 mr-2" />
              {isLoading ? "Submitting..." : "Submit"}
              {isLoading && <Loader className="ml-2" />}
            </Button>
          ) : (
            <EditRestrictionCard moduleName={ModuleName.INDEX_MANAGEMENT}>
              <Button
                type="submit"
                disabled={isLoading || handleUpdateDisabled() === 0}
                className="px-6 py-2.5"
                variant="primary"
              >
                <UploadCloudIcon className="h-5 w-5 mr-2" />
                {isLoading ? "Updating..." : "Update"}
                {isLoading && <Loader className="ml-2" />}
              </Button>
            </EditRestrictionCard>
          )}
        </form>
      </div>

      {/* ── Image Cropper Modal ─────────────────────────────────────── */}
      <LogoImageCropper
        setFieldValue={(field, value) => {
          if (field === "profilePhoto") formik.setFieldValue("logo", value);
          if (field === "profilePhotoFile")
            formik.setFieldValue("logoFile", value);
        }}
        imgSrc={imgSrc}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default IndexManagementForm;
