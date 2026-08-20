import BlogPostManagementForm from "@/components/private/blog-management/blog-post-management/form/blogPost-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Blog Post",
  description:
    "Create and organize new posts, managing its placement and visibility across the platform.",
};

export default function BlogPostManagementAddPage() {
  return (
    <PageProvider
      moduleName={ModuleName.BLOG_POST}
      description={
        "Create and organize new posts, managing its placement and visibility across the platform."
      }
      title={"Add Blog Post"}
      goBackUrl={true}
    >
      <BlogPostManagementForm />
    </PageProvider>
  );
}
