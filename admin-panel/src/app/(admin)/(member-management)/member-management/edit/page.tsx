import MemberMangementForm from "@/components/private/member-management/form/member-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Member | Member Management",
  description:
    "Update member details and account information to keep profiles accurate and up-to-date.",
};

export default function MemberManagementEditPage() {
  return (
    <PageProvider
      moduleName={ModuleName.MEMBER_MANAGEMENT}
      title="Edit Member"
      description="Update member details and account information to keep profiles accurate and up-to-date."
      goBackUrl={true}
    >
      <MemberMangementForm />
    </PageProvider>
  );
}
