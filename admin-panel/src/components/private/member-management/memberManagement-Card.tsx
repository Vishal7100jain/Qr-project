"use client";
import { GetMemberManagementAction } from "@/action/memberMangement/memberManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { MemberManagementColumn } from "./memberManagement-Header";

const MemberManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by full name or email...",
        verifyStatus: true,
      }}
      columns={MemberManagementColumn()}
      fetchData={GetMemberManagementAction}
      exportable={true}
    />
  );
};

export default MemberManagementCard;
