"use client";
import { GetBookingManagementAction } from "@/action/booking/bookingManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import { IPO_managementColomn } from "./ipo-management-Header";
const IPOManagementCard = () => {
  return (
    <DynamicTable
      filters={{
        search: true,
        IPOstatus: true,
        searchPlaceHolder: "Search by user name or email...",
      }}
      columns={IPO_managementColomn()}
      fetchData={GetBookingManagementAction}
      exportable={true}
    />
  );
};

export default IPOManagementCard;
