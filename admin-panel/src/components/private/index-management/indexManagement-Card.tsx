"use client";
import { GetIndexListAction } from "@/action/indexManagementAction/indexManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { IndexListManagementColumn } from "./indexManagement-Header";

const IndicesManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by sk, sn and index...",
      }}
      columns={IndexListManagementColumn()}
      fetchData={GetIndexListAction}
      exportable={true}
    />
  );
};

export default IndicesManagementCard;
