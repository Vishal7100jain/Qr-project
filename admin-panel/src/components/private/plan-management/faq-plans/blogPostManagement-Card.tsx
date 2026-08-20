"use client";
import { GetBlogPostManagementAction } from "@/action/blogManagementAction/blogPostManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { BlogPostManagementColumn } from "./blogPostManagement-Header";
const BlogPostManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by title and slug...",
        blogStatus: true,
      }}
      columns={BlogPostManagementColumn()}
      fetchData={GetBlogPostManagementAction}
      exportable={true}
    />
  );
};

export default BlogPostManagementCard;
