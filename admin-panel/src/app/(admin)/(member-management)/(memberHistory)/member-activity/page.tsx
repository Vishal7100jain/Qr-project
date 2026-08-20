import MemberHistoryManagementCard from "@/components/private/(member-history-management)/member-activity-history/memberActivityHistory-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Activity History",
  description:
    "View and track member actions in the system including login activity, actions taken, and access details.",
};

export default function MemberActivityHistoryPage() {
  return (
    <PageProvider
      moduleName={ModuleName.MEMBER_MANAGEMENT}
      title="Member Activity History"
      description="Monitor and review member activities and behavior in your system."
    >
      <MemberHistoryManagementCard />
    </PageProvider>
  );
}
