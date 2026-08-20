"use client";
import { GetETFListAction } from "@/action/etfsManagementAction/etfsManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { ETFListManagementColumn } from "./ETFsManagement-Header";

const ETFsManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by ETFs name...",
      }}
      columns={ETFListManagementColumn()}
      fetchData={GetETFListAction}
      exportable={true}
    />
  );
};

export default ETFsManagementCard;
