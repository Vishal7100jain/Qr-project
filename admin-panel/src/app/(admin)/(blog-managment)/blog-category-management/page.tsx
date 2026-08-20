import BlogCategoryManagementCard from "@/components/private/blog-management/blog-category-management/blogCategoryManagement-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Categories Management",
  description:
    "Efficiently create, organize, and manage Blog categories across the platform.",
};

export default function BlogCategoryManagement() {
  return (
    <PageProvider
      addDataPageUrl={"/blog-category-management/add"}
      moduleName={ModuleName.BLOG_POST}
      description={
        "Efficiently create, organize, and manage Blog categories across the platform."
      }
      title={"Blog Categories Management"}
    >
      <BlogCategoryManagementCard />
    </PageProvider>
  );
}
