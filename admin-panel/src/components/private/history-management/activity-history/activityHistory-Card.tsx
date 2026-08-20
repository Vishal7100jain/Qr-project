"use client";
import { GetAdminActivityHistoyAction } from "@/action/history/historyAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { ActivityHistoryColumn } from "./activityHistory-header";

// TODO: add the status code filter here and admin email search extra
const ActivityHistoryManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by Module name, url...",
        emailSearch: true,
        emailSearchPlaceHolder: "Search by admin email...",
        statusCode: true,
      }}
      columns={ActivityHistoryColumn()}
      fetchData={GetAdminActivityHistoyAction}
      exportable={true}
    />
  );
};

export default ActivityHistoryManagementCard;
