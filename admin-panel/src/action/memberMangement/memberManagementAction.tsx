"use server";

import apiService from "@/config/axios.service";
import { API_END_POINTS } from "@/constants/apiEndPoints";
import { AuthType, GenderType } from "@/enums/adminEnums";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isAddressVerified: boolean;
}

export interface IMemberManagementItem {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  profilePic: string;
  gender: GenderType;
  bio: string;
  socialAuthId: string;
  authType: AuthType;
  address: IAddress;
  isVerifiedEmail: number;
  isVerifiedNumber: number;
  isVerified: number;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
}

interface ImemberManagementResponse {
  data: IMemberManagementItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ICreateMember {
  fullName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  gender: GenderType;
  pincode: string;
  profilePhoto: string;
  profilePic: File | null;
  isAddressVerified: boolean;
}

export const GetMemberManagementAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      ImemberManagementResponse,
      { params: IParams }
    >(
      API_END_POINTS.memberManagement.get,
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

interface IData<T> {
  data?: T;
  message: string;
  status: "success" | "error";
}

// Create new admin api action
export const CreateMemberAction = async (
  data: FormData
): Promise<IData<ImemberManagementResponse>> => {
  try {
    const response = await apiService.post<ImemberManagementResponse, FormData>(
      `${API_END_POINTS.memberManagement.post}`,
      data
    );

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const UpdateMemberAction = async (
  id: string,
  data: FormData
): Promise<IData<ImemberManagementResponse>> => {
  try {
    const response = await apiService.put<ImemberManagementResponse, FormData>(
      `${API_END_POINTS.memberManagement.put}/${id}`,
      data
    );

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const fetchMemberByIdAction = async (id: string) => {
  try {
    const response = await apiService.get<IMemberManagementItem, {}>(
      `${API_END_POINTS.memberManagement.get}/${id}`
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

export const DeleteMemberByIdAction = async ({ id }: { id: string }) => {
  try {
    const response = await apiService.delete(
      `${API_END_POINTS.memberManagement.delete}/${id}`
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
