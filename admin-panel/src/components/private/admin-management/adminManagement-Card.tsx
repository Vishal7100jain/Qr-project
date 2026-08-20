"use client";
import { GetAdminManagementAction } from "@/action/adminMangement/adminManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { AdminManagementColumn } from "./adminManagement-Header";
const AdminManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        status: true,
        searchPlaceHolder: "Search by user name or email...",
      }}
      columns={AdminManagementColumn()}
      fetchData={GetAdminManagementAction}
      exportable={true}
    />
  );
};

export default AdminManagementCard;
