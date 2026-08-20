"use client";
import { GetBookingManagementAction } from "@/action/booking/bookingManagementAction";
import { DynamicTable } from "@/components/tables/ListTable";
import {
  BookingManagementColumn,
  bookingFilters,
} from "./bookingManagement-Header";

const BookingManagementCard = () => {
  return (
    <DynamicTable
      filters={bookingFilters}
      columns={BookingManagementColumn()}
      fetchData={GetBookingManagementAction}
      exportable={true}
    />
  );
};

export default BookingManagementCard;
