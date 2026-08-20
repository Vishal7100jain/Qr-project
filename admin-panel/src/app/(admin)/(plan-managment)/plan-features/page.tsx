import BlogPostManagementCard from "@/components/private/blog-management/blog-post-management/blogPostManagement-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Post Management",
  description:
    "Efficiently create, organize, and manage digital Posts across the platform.",
};

export default function BlogPostManagement() {
  return (
    <PageProvider
      addDataPageUrl={"/blog-post-management/add"}
      moduleName={ModuleName.BLOG_POST}
      description={
        "Efficiently create, organize, and manage digital Posts across the platform."
      }
      title={"Blog Post Management"}
    >
      <BlogPostManagementCard />
    </PageProvider>
  );
}
