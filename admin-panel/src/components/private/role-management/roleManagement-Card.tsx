"use client";
import { GetRoleManagementAction } from "@/action/roleManagementAction/roleManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { RoleManagementColumn } from "./roleManagement-Header";

const RoleManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by role name...",
      }}
      columns={RoleManagementColumn()}
      fetchData={GetRoleManagementAction}
      exportable={true}
    />
  );
};

export default RoleManagementCard;
