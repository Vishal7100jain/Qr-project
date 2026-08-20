"use client";
import { GetComingSoonSubscriberAction } from "@/action/comingSoonAction/comingSoonSubscriberAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { ComingSoonManagementColumn } from "./ComingSoonManagement-Header";

const ComingSoonManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        searchPlaceHolder: "Search by email...",
      }}
      columns={ComingSoonManagementColumn()}
      fetchData={GetComingSoonSubscriberAction}
      exportable={true}
    />
  );
};

export default ComingSoonManagementCard;
