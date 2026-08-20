import BlogCategoryManagementForm from "@/components/private/blog-management/blog-category-management/form/blogCategory-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Blog Categary",
  description:
    "Create and organize new Category, managing its placement and visibility across the platform.",
};

export default function BlogCategoryManagementAddPage() {
  return (
    <PageProvider
      moduleName={ModuleName.BLOG_POST}
      description={
        "Create and organize new Category, managing its placement and visibility across the platform."
      }
      title={"Add Blog Category"}
      goBackUrl={true}
    >
      <BlogCategoryManagementForm />
    </PageProvider>
  );
}
