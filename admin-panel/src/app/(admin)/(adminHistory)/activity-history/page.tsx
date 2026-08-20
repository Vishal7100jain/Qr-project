import ActivityHistoryManagementCard from "@/components/private/history-management/activity-history/activityHistory-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Activity History",
  description:
    "View and track admin actions in the system including login activity, actions taken, and access details.",
};

export default function ActivityHistoryPage() {
  return (
    <PageProvider
      moduleName={ModuleName.ADMIN_ACTIVITY_HISTORY}
      title="Admin Activity History"
      description="Monitor and review admin activities and behavior in your system."
    >
      <ActivityHistoryManagementCard />
    </PageProvider>
  );
}
