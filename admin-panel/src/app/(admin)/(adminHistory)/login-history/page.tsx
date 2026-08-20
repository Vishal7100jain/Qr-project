import LoginHistoryManagementCard from "@/components/private/history-management/login-history/loginHistory-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login History",
  description:
    "View and track admin actions in the system including login Login, actions taken, and access details.",
};

export default function LoginHistoryPage() {
  return (
    <PageProvider
      moduleName={ModuleName.ADMIN_ACTIVITY_HISTORY}
      title="Admin Login History"
      description="Monitor and review admin login history in your system."
    >
      <LoginHistoryManagementCard />
    </PageProvider>
  );
}
