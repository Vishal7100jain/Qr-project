"use client";
import { GetAccessManagementAction } from "@/action/accessMangement/accessManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { AccessManagementColumn } from "./accessManagement-Header";
const AccessManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by module name...",
      }}
      columns={AccessManagementColumn()}
      fetchData={GetAccessManagementAction}
      exportable={true}
    />
  );
};

export default AccessManagementCard;
