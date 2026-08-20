"use client";

import { getCategoryListAction } from "@/action/blogManagementAction/blogCategoryManagementAction";
import {
  CreateBlogPostAction,
  fetchBlogPostByIdAction,
  IBlogPostManagementItem,
  UpdateBlogPostAction,
} from "@/action/blogManagementAction/blogPostManagementAction";
import { customToast } from "@/components/customToast";
import InputField from "@/components/form/input/InputField";
import MyEditor from "@/components/form/MyEditor";
import { default as SingleSelect } from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { Loader } from "@/components/ui/loader";
import EditRestrictionCard from "@/components/ui/Restriction/EditRestrictionCard";
import { ModuleName } from "@/constants/permissionEnums";
import { BlogPostStatus, BlogType, RoleEnum } from "@/enums/adminEnums";
import { useModal } from "@/hooks/useModal";
import {
  CreateBlogPostSchema,
  UpdateBlogPostSchema,
} from "@/schema/blogPostManangementSchema";
import { ImageCropper } from "@/utils/canvasPreview";
import { checkViewApiPermission } from "@/utils/common";
import { useModuleStore } from "@/zustand/module.store";
import { useFormik } from "formik";
import { CircleX, Upload, UploadCloudIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineTags } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { LiaUserSecretSolid } from "react-icons/lia";
import { MdOutlineDescription, MdOutlineSubtitles } from "react-icons/md";
import "react-image-crop/dist/ReactCrop.css";
import slugify from "slugify";
import ThumbnailUpload from "./ThumbnailUpload";

interface ICategoryOption {
  value: string;
  label: string;
}

interface IRoleOption {
  value: string;
  label: string;
}

export interface ICreateBlogPost {
  title: string;
  description: string;
  slug: string;
  content: string;
  tags: string[];
  status: BlogPostStatus;
  type: BlogType;
  createdByRole: RoleEnum;
  thumbnail?: File | string;
  categoryId: any;
}

const BlogPostForm = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { Id, moduleName, clearModule } = useModuleStore();
  const [imgSrc, setImgSrc] = useState<string>("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addPage] = useState(pathName.includes("/add"));
  const [data, setData] = useState<IBlogPostManagementItem | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [categoryOptions, setCategoryOptions] = useState<ICategoryOption[]>([]);
  const [roleOptions, setRoleOptions] = useState<IRoleOption[]>([]);

  const initialValues = useMemo(
    () => ({
      title: data?.title || "",
      description: data?.description || "",
      slug: data?.slug || "",
      content: data?.content || "",
      tags: data?.tags || [],
      status:
        data?.status !== undefined
          ? data.status.toString()
          : BlogPostStatus.DRAFT.toString(),
      type:
        data?.type !== undefined
          ? data.type.toString()
          : BlogType.normal.toString(),
      createdByRole:
        data?.createdByRole !== undefined
          ? data.createdByRole.toString()
          : RoleEnum.ADMIN.toString(),
      thumbnail: data?.thumbnail
        ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${data.thumbnail}`
        : undefined,

      categoryId: data?.categoryId?._id || "",
    }),
    [data]
  );

  const originalValues = useMemo(() => {
    if (!data || addPage) return null;
    return {
      title: data?.title || "",
      description: data?.description || "",
      slug: data?.slug || "",
      content: data?.content || "",
      tags: data?.tags || [],
      status:
        data?.status !== undefined
          ? data.status.toString()
          : BlogPostStatus.DRAFT.toString(),
      type:
        data?.type !== undefined
          ? data.type.toString()
          : BlogType.normal.toString(),
      createdByRole:
        data?.createdByRole !== undefined
          ? data.createdByRole.toString()
          : RoleEnum.ADMIN.toString(),
      thumbnail: data?.thumbnail
        ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${data.thumbnail}`
        : "",

      categoryId: data?.categoryId?._id || "",
    };
  }, [data, addPage]);

  const formikState = useFormik({
    initialValues,
    validationSchema: addPage ? CreateBlogPostSchema : UpdateBlogPostSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        // @ts-ignore
        if (values?.thumbnail instanceof File) {
          formData.append("thumbnail", values.thumbnail);
        }
        formData.append("description", values.description);
        formData.append("content", values.content);
        formData.append("status", values.status.toString());
        formData.append("type", values.type.toString());
        formData.append("createdByRole", values.createdByRole.toString());
        formData.append("categoryId", values.categoryId);

        values.tags.forEach((tag) => formData.append("tags", tag));

        if (values.title !== originalValues?.title) {
          formData.append("title", values.title);
          formData.append("slug", slugify(values.title, { lower: true }));
        }

        let response;
        if (!addPage && Id) {
          // @ts-ignore
          response = await UpdateBlogPostAction(Id, formData);
        } else {
          // @ts-ignore
          response = await CreateBlogPostAction(formData);
        }

        if (response?.status === "success") {
          customToast.success(
            `Blog post ${addPage ? "created" : "updated"} successfully!`
          );
          router.push("/blog-post-management");
        } else {
          customToast.error(response?.message || "Operation failed");
        }
      } catch (error: any) {
        console.error("Submission error:", error);
        customToast.error(error.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleUpdateDisabled = useMemo(() => {
    return (): boolean => {
      if (isLoading) return true;
      if (addPage) return false;
      if (!originalValues) return true;

      const currentValues = {
        title: formikState.values.title,
        description: formikState.values.description,
        content: formikState.values.content,
        tags: formikState.values.tags,
        status: String(formikState.values.status),
        type: String(formikState.values.type),
        createdByRole: String(formikState.values.createdByRole),
        categoryId: String(formikState.values.categoryId),
        slug: formikState.values.slug,
      };

      const originalData = {
        title: originalValues.title,
        description: originalValues.description,
        content: originalValues.content,
        tags: originalValues.tags,
        status: String(originalValues.status),
        type: String(originalValues.type),
        createdByRole: String(originalValues.createdByRole),
        categoryId: String(originalValues.categoryId),
        slug: originalValues.slug,
      };

      const valuesChanged =
        JSON.stringify(currentValues) !== JSON.stringify(originalData);

      const thumbnailChanged =
        // @ts-ignore
        formikState?.values?.thumbnail instanceof File ||
        (typeof formikState.values.thumbnail === "string" &&
          formikState.values.thumbnail !== originalValues.thumbnail) ||
        (formikState.values.thumbnail === undefined &&
          originalValues.thumbnail);

      return !valuesChanged && !thumbnailChanged;
    };
  }, [isLoading, addPage, originalValues, formikState.values]);

  const fetchBlogPostById = useCallback(
    async (id: string) => {
      setFetchLoading(true);
      try {
        const response = await fetchBlogPostByIdAction(id);
        if (response?.status === "error") {
          customToast.error(response?.message);
          return router.back();
        }
        if (response?.data) {
          setData(response.data as IBlogPostManagementItem);
        }
      } catch (error: any) {
        customToast.error(error.message);
      } finally {
        setFetchLoading(false);
      }
    },
    [router]
  );

  const fetchAllCategories = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response = await getCategoryListAction();
      if (response?.status === "success") {
        const options = response.data.map((category: any) => ({
          value: category._id,
          label: category.slug,
        }));
        setCategoryOptions(options);
      }
    } catch (error: any) {
      customToast.error(error.message);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  const loadRoleOptions = useCallback(() => {
    const options = [
      { value: RoleEnum.ADMIN.toString(), label: "Admin" },
      { value: RoleEnum.ARTIST.toString(), label: "Artist" },
      { value: RoleEnum.MEMBER.toString(), label: "Member" },
    ];
    setRoleOptions(options);
  }, []);

  useEffect(() => {
    fetchAllCategories();
    loadRoleOptions();
  }, [fetchAllCategories, loadRoleOptions]);

  useEffect(() => {
    if (!addPage) {
      const { Id } = useModuleStore.getState();
      if (Id.length === 0 || !checkViewApiPermission(ModuleName.BLOG_POST)) {
        router.push("/blog-post-management");
      } else {
        fetchBlogPostById(Id);
      }
    } else {
      clearModule();
      setData(null);
    }
  }, [Id, fetchBlogPostById, addPage, clearModule, router]);

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
              {/* Title and Slug Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Title"
                  type="text"
                  placeholder="Enter post title"
                  formik={formikState}
                  name="title"
                  maxLength={100}
                  // @ts-ignore
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    formikState.handleChange(e);
                    formikState.setFieldValue(
                      "slug",
                      slugify(e.target.value, { lower: true })
                    );
                  }}
                  icon={
                    <MdOutlineSubtitles
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />
                <InputField
                  label="Slug"
                  type="text"
                  placeholder="Auto-generated slug"
                  formik={formikState}
                  name="slug"
                  disabled={true}
                  icon={
                    <MdOutlineSubtitles
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />
              </div>
              {/* Description and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Description"
                  type="text"
                  placeholder="Enter description"
                  formik={formikState}
                  name="description"
                  maxLength={255}
                  icon={
                    <MdOutlineDescription
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />
                <SingleSelect
                  label="Category"
                  name="categoryId"
                  id="categoryId"
                  options={categoryOptions}
                  placeholder="Select category"
                  onChange={(value) => {}}
                  formik={formikState}
                  icon={
                    <BiCategoryAlt
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />
              </div>
              {/* Type and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <SingleSelect
                  label="Type"
                  options={[
                    {
                      value: BlogType.isFeatured.toString(),
                      label: "Featured",
                    },
                    { value: BlogType.isLatest.toString(), label: "Latest" },
                    { value: BlogType.normal.toString(), label: "Normal" },
                  ]}
                  placeholder="Select type"
                  onChange={(value: string) =>
                    formikState.setFieldValue("type", value)
                  }
                  formik={formikState}
                  name="type"
                  id="type"
                  icon={
                    <HiOutlinePencilSquare
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />

                {/* Simplified Status Select */}
                <SingleSelect
                  label="Status"
                  options={[
                    {
                      value: BlogPostStatus.DRAFT.toString(),
                      label: "Draft",
                    },
                    {
                      value: BlogPostStatus.PUBLISHED.toString(),
                      label: "Published",
                    },
                    {
                      value: BlogPostStatus.PENDING.toString(),
                      label: "Pending",
                    },
                  ]}
                  placeholder="Select status"
                  onChange={(value: string) =>
                    formikState.setFieldValue("status", value)
                  }
                  formik={formikState}
                  name="status"
                  id="status"
                  icon={
                    <GrStatusGood
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />
              </div>
              {/* Tags and Author Role Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Tags (comma separated)"
                  type="text"
                  placeholder="Enter tags"
                  formik={formikState}
                  name="tags"
                  // @ts-ignore
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const tagsArray = e.target.value
                      .split(",")
                      .map((tag) => tag.trim());
                    formikState.setFieldValue("tags", tagsArray);
                  }}
                  value={formikState.values.tags.join(", ")}
                  icon={
                    <AiOutlineTags
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />
                <SingleSelect
                  label="Author Role"
                  options={roleOptions}
                  placeholder="Select author role"
                  onChange={(value: string) =>
                    formikState.setFieldValue("createdByRole", value)
                  }
                  disabled
                  formik={formikState}
                  name="createdByRole"
                  id="createdByRole"
                  icon={
                    <LiaUserSecretSolid
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  }
                />
              </div>
              {/* Thumbnail Upload */}
              <ThumbnailUpload formikState={formikState} data={data} />
              <div className="mb-6 relative pb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Content
                  <span className="text-error-500 ml-1">*</span>
                </label>
                <MyEditor
                  value={formikState.values.content}
                  onChange={(content: string) => {
                    formikState.setFieldValue("content", content);
                    formikState.setFieldTouched("content", true);
                  }}
                />
                {formikState.touched.content && formikState.errors.content && (
                  <p className="text-red-500 dark:text-error-400 text-sm absolute bottom-[-15px] left-0">
                    {formikState.errors.content}
                  </p>
                )}
              </div>
              <ImageCropper
                setFieldValue={(field: string, value: File) => {
                  if (field === "thumbnail") {
                    formikState.setFieldValue("thumbnail", value);
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
                  <EditRestrictionCard moduleName={ModuleName.BLOG_POST}>
                    <Button
                      type="submit"
                      disabled={isLoading || handleUpdateDisabled()}
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

export default BlogPostForm;
