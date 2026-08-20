import MemberLoginHistoryManagementCard from "@/components/private/(member-history-management)/member-login-history/memberLoginHistory-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Login History",
  description:
    "View and track member actions in the system including login actions, actions taken, and access details.",
};

export default function MemberLoginHistoryPage() {
  return (
    <PageProvider
      moduleName={ModuleName.MEMBER_MANAGEMENT}
      title="Member Login History"
      description="Monitor and review member login history in your system."
    >
      <MemberLoginHistoryManagementCard />
    </PageProvider>
  );
}
