import AdminMangementForm from "@/components/private/admin-management/form/admin-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Admin | Admin Management",
  description:
    "Edit existing admin user details including name, email, role, and status. Use this page to manage and update admin access within the system.",
};

export default function AdminManagementEditPage({}) {
  return (
    <PageProvider
      moduleName={ModuleName.ADMINMANAGEMENT}
      title="Edit Admin"
      description="Update admin details, roles, and status from the admin management panel."
      goBackUrl={true}
    >
      <AdminMangementForm />
    </PageProvider>
  );
}
