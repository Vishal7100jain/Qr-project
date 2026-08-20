"use client";

import { AddNewSymbolLogoAction } from "@/action/logoManagementAction/logoManagementAction";
import { customToast } from "@/components/customToast";
import InputField from "@/components/form/input/InputField";
import SingleSelect from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import { useModal } from "@/hooks/useModal";
import { CreateLogoSchema } from "@/schema/logoManagementSchema";
import { useFormik } from "formik";
import { CircleX, Landmark, User2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaLink, FaPencilAlt } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { LogoImageCropper } from "../logo-cropper";

export const ExchangeOption = [
  {
    value: "NSE",
    label: "NSE",
  },
  {
    value: "BSE",
    label: "BSE",
  },
  {
    value: "MCX",
    label: "MCX",
  },
  {
    value: "NCO",
    label: "NCO",
  },
];

const AddLogoForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const { isOpen, openModal, closeModal } = useModal();
  const [fileChanged, setFileChanged] = useState(false);

  const formik = useFormik({
    initialValues: {
      sk: "",
      logoUrl: "",
      logoFile: null,
      logo: "",
      xc: "",
    },
    validationSchema: CreateLogoSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let data: any;

        if (imgSrc && values?.logoFile) {
          data = new FormData();
          data.append("sk", values.sk);
          data.append("xc", values.xc);

          if (imgSrc && values.logoFile) {
            data.append("logo", values.logoFile);
          }
        } else if (values.logoUrl) {
          data = values;
        }

        const response = await AddNewSymbolLogoAction(data);
        if (response?.status === "success") {
          customToast.success(response?.message || "Logo added successfully!");
          router.push("/logo-management");
        } else {
          customToast.error(response?.message || "Something went wrong.");
        }
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

        setFileChanged(true);

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

  useEffect(() => {
    return () => {
      if (formik.values.logo?.startsWith("blob:")) {
        URL.revokeObjectURL(formik.values.logo);
      }
    };
  }, [formik.values.logo]);

  const getLogoPreview = useCallback(() => {
    if (imgSrc && formik.values.logo) return formik.values.logo;
    return "";
  }, [imgSrc, formik.values.logo]);

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={formik.handleSubmit} className="w-full p-5">
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
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        formik.setFieldValue("logo", "");
                        formik.setFieldValue("logoFile", null);
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

          <div className="flex flex-row gap-3 w-full">
            <div className="w-1/2">
              <InputField
                type="text"
                placeholder="Enter Stock/Symbol name (sk)"
                formik={formik}
                className="cursor-pointer"
                label="Stock/Symbol name"
                name="sk"
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
                placeholder="Enter logo image URL"
                formik={formik}
                name="logoUrl"
                label="Logo URL  "
                icon={
                  <FaLink
                    size={18}
                    className="text-gray-500 dark:text-gray-400"
                  />
                }
              />
            </div>
            <div className="w-1/2">
              <SingleSelect
                label="Exchange"
                options={ExchangeOption}
                placeholder="Select Exchange"
                onChange={(value: string) => formik.setFieldValue("xc", value)}
                formik={formik}
                name="xc"
                id="xc"
                icon={<Landmark size={18} className="text-gray-500" />}
                className="mb-2"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            className="px-6 py-2.5 mt-4"
          >
            <GrAdd className="h-5 w-5 mr-2" />
            {isLoading ? "Submitting..." : "Submit"}
            {isLoading && <Loader className="ml-2" />}
          </Button>
        </form>
      </div>

      {/* Image Cropper Modal */}
      <LogoImageCropper
        setFieldValue={(field, value) => {
          if (field === "profilePhoto") {
            formik.setFieldValue("logo", value);
          }
          if (field === "profilePhotoFile") {
            formik.setFieldValue("logoFile", value);
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

export default AddLogoForm;
