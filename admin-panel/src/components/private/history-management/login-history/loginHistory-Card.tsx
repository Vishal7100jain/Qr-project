"use client";
import { GetLoginActivityHistoyAction } from "@/action/history/historyAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { LoginHistoryColumns } from "./loginHistory-header";

const LoginHistoryManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        emailSearch: true,
        emailSearchPlaceHolder: "Search by admin email...",
        status: true,
        typeDropdown: true,
      }}
      columns={LoginHistoryColumns()}
      fetchData={GetLoginActivityHistoyAction}
      exportable={true}
    />
  );
};

export default LoginHistoryManagementCard;
