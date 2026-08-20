import AdminManagementCard from "@/components/private/admin-management/adminManagement-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Mangement",
  description:
    "This is a Admin Management Page, from your you can manage your admin's",
};

export default function AdminManagement() {
  return (
    <PageProvider
      addDataPageUrl={"/admin-management/add"}
      moduleName={ModuleName.ADMINMANAGEMENT}
      description={
        "Manage admin users, roles, and permissions to ensure proper access and control within the system."
      }
      title={"Admin Management"}
    >
      <AdminManagementCard />
    </PageProvider>
  );
}
