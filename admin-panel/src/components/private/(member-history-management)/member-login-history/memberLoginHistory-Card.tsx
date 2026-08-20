"use client";
import { GetMemberLoginActivityHistoyAction } from "@/action/memberHistory/memberHistoryAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { MemberLoginHistoryColumns } from "./memberLoginHistory-header";

const MemberLoginHistoryManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        emailSearch: true,
        emailSearchPlaceHolder: "Search by member email...",
        status: true,
        typeDropdown: true,
      }}
      columns={MemberLoginHistoryColumns()}
      fetchData={GetMemberLoginActivityHistoyAction}
      exportable={true}
    />
  );
};

export default MemberLoginHistoryManagementCard;
