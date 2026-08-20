import RoleManagementForm from "@/components/private/role-management/form/roleMangement-Form";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Roles | Role Management",
  description:
    "Create and assign new roles to users, defining their access levels and responsibilities within the system.",
};

export default function RoleManagementAddPage() {
  return (
    <PageProvider
      moduleName={ModuleName.ROLEMANAGEMENT}
      description={
        "Create and assign new roles to users, defining their access levels and responsibilities within the system."
      }
      title={"Add Role"}
      goBackUrl={true}
    >
      <RoleManagementForm />
    </PageProvider>
  );
}
