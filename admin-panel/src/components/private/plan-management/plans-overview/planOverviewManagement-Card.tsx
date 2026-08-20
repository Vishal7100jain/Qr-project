"use client";
import { GetPlanOverviewManagementAction } from "@/action/planManagementAction/planOverviewAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { PlanOverviewManagementColumn } from "./planOverviewManagement-Header";
const PlanOverviewManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by title...",
        status: true,
      }}
      // @ts-ignore
      columns={PlanOverviewManagementColumn()}
      fetchData={GetPlanOverviewManagementAction}
      exportable={true}
    />
  );
};

export default PlanOverviewManagementCard;
