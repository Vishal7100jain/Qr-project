import PlanOverviewForm from "@/components/private/plan-management/plans-overview/form/planOverview-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Plan Management",
  description:
    "Create and organize new Plan, managing its placement and visibility across the platform.",
};

export default function PlanOverviewAddPage() {
  return (
    <PageProvider
      moduleName={ModuleName.PLANS}
      description={
        "Create and organize new Plan, managing its placement and visibility across the platform."
      }
      title={"Add Plan Management"}
      goBackUrl={true}
    >
      <PlanOverviewForm />
    </PageProvider>
  );
}
