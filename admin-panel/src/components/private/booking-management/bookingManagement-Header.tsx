"use client";

import { ColumnConfig } from "@/components/tables/ListTable";
import { convertDate } from "@/utils/common";
import { useAdminStore } from "@/zustand/admin.store";
import { EyeIcon } from "lucide-react";
import { useState } from "react";

import { IBooking } from "@/action/booking/bookingManagementAction";
import GenericDetailsModal from "@/components/common/detailsModal";

import {
  AdminBookingOrderStatus,
  ArtistBookingOrderStatus,
  GenderEnum,
  OccasionType,
  PlanTypeEnum,
} from "@/enums/adminEnums";
import Image from "next/image";

const TableAction = ({ data }: { data: IBooking }) => {
  const [isOpen, setShowDetailsModal] = useState(false);

  // Map status codes to readable text using enums
  const getAdminStatusText = (statusCode: number) => {
    switch (statusCode) {
      case AdminBookingOrderStatus.PENDING:
        return "Pending";
      case AdminBookingOrderStatus.CONFIRMED:
        return "Confirmed";
      case AdminBookingOrderStatus.COMPLETED:
        return "Completed";
      case AdminBookingOrderStatus.CANCELLED:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getArtistStatusText = (statusCode: number) => {
    switch (statusCode) {
      case ArtistBookingOrderStatus.PENDING:
        return "Pending";
      case ArtistBookingOrderStatus.IN_PROGRESS:
        return "In Progress";
      case ArtistBookingOrderStatus.COMPLETED:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  // Map service type codes to readable text using enums
  const getServiceTypeText = (serviceType: number) => {
    switch (serviceType) {
      case PlanTypeEnum.HAIR:
        return "Hair Styling";
      case PlanTypeEnum.MAKEUP:
        return "Makeup";
      case PlanTypeEnum.NAIL:
        return "Nail Art";
      case PlanTypeEnum.MEHNDI:
        return "Mehndi";
      default:
        return "Unknown Service";
    }
  };

  // Map gender codes to readable text using enums
  const getGenderText = (genderCode: number) => {
    switch (genderCode) {
      case GenderEnum.FEMALE:
        return "Female";
      case GenderEnum.MALE:
        return "Male";
      default:
        return "Unknown";
    }
  };

  // Map occasion type to readable text using enums
  const getOccasionText = (occasionType: string) => {
    switch (occasionType) {
      case OccasionType.BABY_SHOWER:
        return "Baby Shower";
      case OccasionType.WEDDING:
        return "Wedding";
      case OccasionType.PARTY:
        return "Party";
      case OccasionType.EVENT:
        return "Event";
      case OccasionType.OTHER:
        return "Other";
      default:
        return occasionType;
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center w-full justify-center">
        <EyeIcon
          className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
          size={20}
          onClick={() => setShowDetailsModal(true)}
        />
      </div>

      <GenericDetailsModal
        isOpen={isOpen}
        onClose={() => setShowDetailsModal(false)}
        title="Booking Details"
        description="Information about the selected booking"
        data={{
          bookingId: data?._id ?? "-",
          customerName: data?.member?.fullName ?? "-",
          customerEmail: data?.member?.email ?? "-",
          customerPhone: data?.member?.phoneNumber ?? "-",
          customerGender: data?.member?.gender
            ? getGenderText(data.member.gender)
            : "-",
          serviceType: data?.serviceType
            ? getServiceTypeText(data.serviceType)
            : "-",
          appointmentDate: data?.appointmentDate
            ? convertDate(data.appointmentDate, "DD/MM/YYYY")
            : "-",
          preferredTime: data?.preferredTime ?? "-",
          occasionType: data?.occasionType
            ? getOccasionText(data.occasionType)
            : "-",
          styles: data?.styles?.join(", ") || "None",
          budget: data?.budget
            ? `$${data.budget.min} - $${data.budget.max}`
            : "-",
          location: data?.location ?? "-",
          pincode: data?.pincode ?? "-",
          additionalDetails: data?.additionalDetails || "None",
          adminStatus:
            data?.adminStatus !== undefined
              ? getAdminStatusText(data.adminStatus)
              : "-",
          artistStatus:
            data?.artistStatus !== undefined
              ? getArtistStatusText(data.artistStatus)
              : "-",
          isVerified: data?.isVerified === 1 ? "Verified" : "Not Verified",
          createdAt: data?.createdAt
            ? convertDate(data.createdAt, "DD/MM/YYYY h:mm:ss a")
            : "-",
          updatedAt: data?.updatedAt
            ? convertDate(data.updatedAt, "DD/MM/YYYY h:mm:ss a")
            : "-",
        }}
        fieldLabels={{
          bookingId: "Booking ID",
          customerName: "Customer Name",
          customerEmail: "Customer Email",
          customerPhone: "Customer Phone",
          customerGender: "Customer Gender",
          serviceType: "Service Type",
          appointmentDate: "Appointment Date",
          preferredTime: "Preferred Time",
          occasionType: "Occasion Type",
          styles: "Styles",
          budget: "Budget Range",
          location: "Location",
          pincode: "Pincode",
          additionalDetails: "Additional Details",
          adminStatus: "Admin Status",
          artistStatus: "Artist Status",
          isVerified: "Verification Status",
          createdAt: "Created On",
          updatedAt: "Last Updated",
        }}
      />
    </>
  );
};

export const BookingManagementColumn = (): ColumnConfig<any>[] => {
  const admin = useAdminStore((state) => state.admin);

  // Map admin status codes to badge colors using enums
  const getAdminStatusBadge = (statusCode: number) => {
    let badgeColor = "bg-gray-100 text-gray-800";
    let statusText = "Unknown";

    switch (statusCode) {
      case AdminBookingOrderStatus.PENDING:
        badgeColor = "bg-yellow-100 text-yellow-800";
        statusText = "Pending";
        break;
      case AdminBookingOrderStatus.CONFIRMED:
        badgeColor = "bg-green-100 text-green-800";
        statusText = "Confirmed";
        break;
      case AdminBookingOrderStatus.COMPLETED:
        badgeColor = "bg-blue-100 text-blue-800";
        statusText = "Completed";
        break;
      case AdminBookingOrderStatus.CANCELLED:
        badgeColor = "bg-red-100 text-red-800";
        statusText = "Cancelled";
        break;
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}
      >
        {statusText}
      </span>
    );
  };

  // Map service type codes to readable text using enums
  const getServiceTypeText = (serviceType: number) => {
    switch (serviceType) {
      case PlanTypeEnum.HAIR:
        return "Hair Styling";
      case PlanTypeEnum.MAKEUP:
        return "Makeup";
      case PlanTypeEnum.NAIL:
        return "Nail Art";
      case PlanTypeEnum.MEHNDI:
        return "Mehndi";
      default:
        return "Unknown Service";
    }
  };

  return [
    {
      key: "_id",
      header: "Booking ID",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return (
          <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">
            {value?.substring(0, 8)}...
          </p>
        );
      },
    },
    {
      key: "member",
      header: "Customer Name",
      type: "custom",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any, data: any) => {
        const handleImageUrl = () => {
          if (data?.member?.profilePic) {
            return (
              process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL +
              data?.member?.profilePic
            );
          } else {
            return "/images/user/owner.jpg";
          }
        };
        return (
          <div className="flex flex-row items-center gap-2">
            <div className="w-10 h-10 relative">
              <Image
                src={handleImageUrl()}
                alt="customer"
                fill
                className="rounded-full object-cover border border-gray-200"
              />
            </div>
            <span className="text-gray-800 dark:text-gray-200">
              {data?.member?.fullName || "-"}
            </span>
          </div>
        );
      },
    },
    {
      key: "serviceType",
      header: "Service",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return (
          <p className="text-gray-800 dark:text-gray-200">
            {getServiceTypeText(value)}
          </p>
        );
      },
    },
    {
      key: "appointmentDate",
      header: "Booking Date",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return (
          <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {convertDate(value, "DD/MM/YYYY")}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: "preferredTime",
      header: "Time",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return (
          <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {value || "-"}
          </span>
        );
      },
    },
    {
      key: "adminStatus",
      header: "Status",
      type: "badge",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return getAdminStatusBadge(value);
      },
    },
    {
      key: "budget",
      header: "Budget",
      type: "text",
      align: "left",
      headerClassName: "justify-start",
      render: (value: any) => {
        return (
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            ${value?.min} - ${value?.max}
          </p>
        );
      },
    },
    {
      key: "_id",
      header: "Actions",
      type: "text",
      align: "center",
      headerClassName: "justify-center",
      render: (id: any, row) => {
        return <TableAction data={row} />;
      },
    },
  ];
};

// Enhanced filter configuration for booking management
export const bookingFilters = {
  search: true,
  searchPlaceHolder: "Search by location or occasion...",
  emailSearch: true,
  emailSearchPlaceHolder: "Search by member email...",
  date: true,
  dropdown: [
    {
      key: "serviceType",
      label: "Service Type",
      options: [
        { label: "All Services", value: null },
        { label: "Mehndi", value: PlanTypeEnum.MEHNDI },
        { label: "Nail Art", value: PlanTypeEnum.NAIL },
        { label: "Makeup", value: PlanTypeEnum.MAKEUP },
        { label: "Hair Styling", value: PlanTypeEnum.HAIR },
      ],
    },
    {
      key: "adminStatus",
      label: "Status",
      options: [
        { label: "All Status", value: null },
        { label: "Pending", value: AdminBookingOrderStatus.PENDING },
        { label: "Confirmed", value: AdminBookingOrderStatus.CONFIRMED },
        { label: "Completed", value: AdminBookingOrderStatus.COMPLETED },
        { label: "Cancelled", value: AdminBookingOrderStatus.CANCELLED },
      ],
    },
  ],
  budgetRange: true,
  pincode: true,
};
