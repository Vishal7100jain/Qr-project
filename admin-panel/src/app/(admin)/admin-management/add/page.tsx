import AdminMangementForm from "@/components/private/admin-management/form/admin-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Admin | Admin Management",
  description:
    "Create and register a new admin user with specific roles and permissions using the admin management panel.",
};

export default function AdminManagementAddPage() {
  return (
    <PageProvider
      moduleName={ModuleName.ADMINMANAGEMENT}
      title="Add New Admin"
      description="Create and assign new admin users, managing their roles and access within the system."
      goBackUrl={true}
    >
      <AdminMangementForm />
    </PageProvider>
  );
}
