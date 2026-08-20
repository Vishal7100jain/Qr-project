import AccessMangementForm from "@/components/private/access-management/form/access-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Access | Access Management",
  description:
    "Assign and customize access rights for admin users, defining their permissions within the system.",
};

export default function AccessManagementAddPage() {
  return (
    <PageProvider
      moduleName={ModuleName.ACCESSMANAGEMENT}
      title="Add Access Permissions"
      description="Assign and customize access rights for admin users, defining their permissions within the system."
      goBackUrl={true}
    >
      <AccessMangementForm />
    </PageProvider>
  );
}
