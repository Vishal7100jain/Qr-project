"use server";
import apiService from "@/config/axios.service";
import { API_END_POINTS } from "@/constants/apiEndPoints";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

// -------- Booking Types --------
export interface IBookingMember {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  profilePic: string;
  gender: number;
}

export interface IBooking {
  _id: string;
  serviceType: number;
  appointmentDate: string;
  preferredTime: string;
  occasionType: string;
  styles: string[];
  budget: {
    min: number;
    max: number;
  };
  additionalDetails: string;
  location: string;
  pincode: number;
  isVerified: number;
  adminStatus: number;
  artistStatus: number;
  createdAt: string;
  updatedAt: string;
  member: IBookingMember;
}

export interface IBookingResponseData {
  data: IBooking[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IBookingResponse {
  data: IBookingResponseData;
  message: string;
  status: "success" | "error";
}

export const GetBookingManagementAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      IBookingResponse,
      { params: IParams }
    >(
      API_END_POINTS.bookings.bookingManagement,
      // @ts-ignore
      queryParams
    );

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
      data: [],
    };
  }
};
