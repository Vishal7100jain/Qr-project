import RoleManagementForm from "@/components/private/role-management/form/roleMangement-Form";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Role Edit | Role Management",
  description:
    "Modify existing user roles, updating permissions and access levels as per system requirements.",
};

export default function RoleManagementEditPage() {
  return (
    <PageProvider
      moduleName={ModuleName.ROLEMANAGEMENT}
      description={
        "Modify existing user roles, updating permissions and access levels as per system requirements."
      }
      title={"Edit Role"}
      goBackUrl={true}
    >
      <RoleManagementForm />
    </PageProvider>
  );
}
