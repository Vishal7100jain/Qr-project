import MemberManagementCard from "@/components/private/member-management/memberManagement-Card";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Management",
  description:
    "Centralized page for managing member accounts, roles, and access permissions within the system.",
};

export default function MemberManagement() {
  return (
    <PageProvider
      addDataPageUrl={"/member-management/add"}
      moduleName={ModuleName.MEMBER_MANAGEMENT}
      description={
        "Efficiently manage member records, roles, and access rights to maintain proper governance and control across the platform."
      }
      title={"Member Management"}
    >
      <MemberManagementCard />
    </PageProvider>
  );
}
