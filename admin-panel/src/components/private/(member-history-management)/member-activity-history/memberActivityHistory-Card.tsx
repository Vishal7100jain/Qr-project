"use client";
import { GetMemberActivityHistoyAction } from "@/action/memberHistory/memberHistoryAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { MemberActivityHistoryColumn } from "./memberActivityHistory-header";

// TODO: add the status code filter here and admin email search extra
const MemberActivityHistoryManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by Module name, url...",
        emailSearch: true,
        emailSearchPlaceHolder: "Search by member email...",
        statusCode: true,
      }}
      columns={MemberActivityHistoryColumn()}
      fetchData={GetMemberActivityHistoyAction}
      exportable={true}
    />
  );
};

export default MemberActivityHistoryManagementCard;
