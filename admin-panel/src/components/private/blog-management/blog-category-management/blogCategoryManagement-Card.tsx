"use client";
import { GetBlogCategoryManagementAction } from "@/action/blogManagementAction/blogCategoryManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { BlogCategoryManagementColumn } from "./blogCategoryManagement-Header";
const BlogCategoryManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by title and slug...",
        status: true,
      }}
      columns={BlogCategoryManagementColumn()}
      fetchData={GetBlogCategoryManagementAction}
      exportable={true}
    />
  );
};

export default BlogCategoryManagementCard;
