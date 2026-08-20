import BlogPostManagementForm from "@/components/private/blog-management/blog-post-management/form/blogPost-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Blog Post",
  description:
    "Update and modify existing content, ensuring it aligns with the platform's standards and visibility.",
};

export default function BlogPostManagementEditPage() {
  return (
    <PageProvider
      moduleName={ModuleName.BLOG_POST}
      description={
        "Update and modify existing content, ensuring it aligns with the platform's standards and visibility."
      }
      title={"Edit Blog Post"}
      goBackUrl={true}
    >
      <BlogPostManagementForm />
    </PageProvider>
  );
}
