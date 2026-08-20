import AccessMangementForm from "@/components/private/access-management/form/access-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Access | Access Management",
  description:
    "Modify existing admin user access rights and update their permissions for system resources.",
};

export default function AccessManagementEditPage({}) {
  return (
    <PageProvider
      moduleName={ModuleName.ACCESSMANAGEMENT}
      title="Edit Access Permissions"
      description="Modify existing admin user access rights and update their permissions for system resources."
      goBackUrl={true}
    >
      <AccessMangementForm />
    </PageProvider>
  );
}
