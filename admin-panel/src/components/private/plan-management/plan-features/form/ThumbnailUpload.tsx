"use client";
import { customToast } from "@/components/customToast";
import { CircleX, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ThumbnailUploadProps {
  formikState: any;
  data?: any;
}

const ThumbnailUpload: React.FC<ThumbnailUploadProps> = ({
  formikState,
  data,
}) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Handle Image Selection
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
        reader.onload = () => {
          const result = reader.result?.toString();
          if (result) {
            setThumbnailPreview(result);
            formikState.setFieldValue("thumbnail", file);
            formikState.setFieldTouched("thumbnail", false);
            formikState.validateField("thumbnail");
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error: any) {
      customToast.error(error.message);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    formikState.setFieldValue("thumbnail", null);
    formikState.setFieldTouched("thumbnail", true);
    formikState.validateField("thumbnail");

    const fileInput = document.getElementById("thumbnail") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  useEffect(() => {
    if (data?.thumbnail) {
      setThumbnailPreview(
        `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${data.thumbnail}`
      );
    }
  }, [data]);

  return (
    <div className="mb-6 relative pb-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
        Thumbnail Image <span className="text-error-500 ml-1">*</span>
      </label>

      {thumbnailPreview ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="relative mb-4">
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="h-40 w-auto object-contain rounded"
            />
            <button
              type="button"
              onClick={removeThumbnail}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <CircleX className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click the X button to remove the image
          </p>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:border-brand-500 transition-colors">
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, GIF up to 1MB
            </p>
          </div>

          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            onChange={handleImageChange}
            className="sr-only"
            accept="image/*"
          />
        </label>
      )}

      {/* Error Message */}
      {formikState.touched.thumbnail && formikState.errors.thumbnail && (
        <p className="text-red-500 text-sm absolute bottom-[-15px] left-0 dark:text-error-400">
          {formikState.errors.thumbnail}
        </p>
      )}
    </div>
  );
};

export default ThumbnailUpload;
