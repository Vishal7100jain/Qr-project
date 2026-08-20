"use server";
import apiService from "@/config/axios.service";
import { API_END_POINTS } from "@/constants/apiEndPoints";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IMemberActivityHistory {
  _id: string;
  mo: string;
  ac: string;
  des: string;
  url: string;
  ipAdd: string;
  agent: string;
  sC: number;
  tiToRes: number;
  createdAt: string;
  person: {
    email: string;
    _id: string;
  };
}

interface IMemberActivityHistoryResponse {
  data: IMemberActivityHistory[];
  total: number;
  page: number;
  pageSize: number;
}

export const GetMemberActivityHistoyAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      IMemberActivityHistoryResponse,
      { params: IParams }
    >(
      API_END_POINTS.memberHistory.memberActivity,
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

export interface IMemberLoginHistory {
  _id: string;
  email: string;
  oAuthType: "CUSTOM" | "GOOGLE" | "FACEBOOK" | string;
  isSuccessful: boolean;
  ipAddress: string;
  userAgent: string;
  loginAt: string;
  logoutAt: string;
  token: string;
  member: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: number;
    profilePic: string;
    gender: number;
    bio: string;
    socialAuthId: string;
    authType: "CUSTOM" | "GOOGLE" | "FACEBOOK" | string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
      isAddressVerified: boolean;
    };
    isVerifiedEmail: number;
    isVerifiedNumber: number;
    isVerified: number;
    isDeleted: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  isActive: number;
}

interface IMemberLoginHistoryResponse {
  data: IMemberLoginHistory[];
  total: number;
  page: number;
  pageSize: number;
}

export const GetMemberLoginActivityHistoyAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      IMemberLoginHistoryResponse,
      { params: IParams }
    >(
      API_END_POINTS.memberHistory.memberLogin,
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
