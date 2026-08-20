import RoleManagementCard from "@/components/private/role-management/roleManagement-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles Management",
  description:
    "This is a Roles Management Page, from your you can manage your Roles's",
};

export default function RoleManagement() {
  return (
    <PageProvider
      addDataPageUrl={"/role-management/add"}
      moduleName={ModuleName.ROLEMANAGEMENT}
      description={
        "Manage admin roles and permissions to control access across the system efficiently."
      }
      title={"Role Management"}
    >
      <RoleManagementCard />
    </PageProvider>
  );
}
