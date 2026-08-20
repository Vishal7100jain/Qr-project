"use client";
import { GetHistoricalDataListAction } from "@/action/historicalDataManagementAction/historicalDataManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { HistoricalDataListColumns } from "./historicalDataManagement-Header";

const HistoricalDataManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by Symbol, timeframe name...",
      }}
      columns={HistoricalDataListColumns()}
      fetchData={GetHistoricalDataListAction}
      exportable={true}
    />
  );
};

export default HistoricalDataManagementCard;
