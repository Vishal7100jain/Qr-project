"use client";
import { GetLogoManagementAnalysisAction } from "@/action/logoManagementAction/logoManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { LogoManagementColumn } from "./logoManagement-Header";
import LogoStatsCards from "./LogoStatsCards";

const LogoManagementCard = () => {
  return (
    <>
      <LogoStatsCards />
      <DynamicTable
        filters={{
          search: true,
          searchPlaceHolder: "Search by stocks name...",
        }}
        columns={LogoManagementColumn()}
        fetchData={GetLogoManagementAnalysisAction}
        exportable={true}
      />
    </>
  );
};

export default LogoManagementCard;
