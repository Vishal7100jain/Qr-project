import PlanOverviewManagementCard from "@/components/private/plan-management/plans-overview/planOverviewManagement-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans Overview Management",
  description:
    "Efficiently create, organize, and manage Plans Overview across the platform.",
};

export default function PlanOverviewManagement() {
  return (
    <PageProvider
      addDataPageUrl={"/plans-overview/add"}
      moduleName={ModuleName.PLANS}
      description={
        "Efficiently create, organize, and manage Plans Overview across the platform."
      }
      title={"Plans Overview Management"}
    >
      <PlanOverviewManagementCard />
    </PageProvider>
  );
}
