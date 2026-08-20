import AccessManagementCard from "@/components/private/access-management/accessManagement-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Mangement",
  description:
    "Control and customize admin access to different features and resources within the system.",
};

export default function AccessManagement() {
  return (
    <PageProvider
      addDataPageUrl={"/access-management/add"}
      moduleName={ModuleName.ACCESSMANAGEMENT}
      description={
        "Control and customize admin access to different features and resources within the system."
      }
      title={"Access Permissions"}
    >
      <AccessManagementCard />
    </PageProvider>
  );
}
