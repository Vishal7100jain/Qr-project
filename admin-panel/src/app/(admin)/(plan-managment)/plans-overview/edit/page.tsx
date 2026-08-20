import PlanOverviewForm from "@/components/private/plan-management/plans-overview/form/planOverview-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Plan Management",
  description:
    "Update and modify existing plan, ensuring it aligns with the platform's standards and visibility.",
};

export default function PlanOverviewEditPage() {
  return (
    <PageProvider
      moduleName={ModuleName.PLANS}
      description={
        "Update and modify existing plan, ensuring it aligns with the platform's standards and visibility."
      }
      title={"Edit Plan Management"}
      goBackUrl={true}
    >
      <PlanOverviewForm />
    </PageProvider>
  );
}
