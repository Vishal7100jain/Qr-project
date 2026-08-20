import MemberMangementForm from "@/components/private/member-management/form/member-mangementForm";
import PageProvider from "@/components/provider/PageProvider";
import { ModuleName } from "@/constants/permissionEnums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Member | Member Management",
  description:
    "Create new member profiles by entering essential details and setting up account information.",
};

export default function MemberManagementAddPage() {
  return (
    <PageProvider
      moduleName={ModuleName.MEMBER_MANAGEMENT}
      title="Add New Member"
      description="Create new member profiles by entering essential details and setting up account information."
      goBackUrl={true}
    >
      <MemberMangementForm />
    </PageProvider>
  );
}
