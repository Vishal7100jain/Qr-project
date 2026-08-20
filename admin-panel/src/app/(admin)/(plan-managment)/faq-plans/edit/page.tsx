import BlogCategoryManagementForm from "@/components/private/blog-management/blog-category-management/form/blogCategory-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Blog Category",
  description:
    "Update and modify existing category, ensuring it aligns with the platform's standards and visibility.",
};

export default function BlogCategoryManagementEditPage() {
  return (
    <PageProvider
      moduleName={ModuleName.BLOG_POST}
      description={
        "Update and modify existing category, ensuring it aligns with the platform's standards and visibility."
      }
      title={"Edit Blog Category"}
      goBackUrl={true}
    >
      <BlogCategoryManagementForm />
    </PageProvider>
  );
}
