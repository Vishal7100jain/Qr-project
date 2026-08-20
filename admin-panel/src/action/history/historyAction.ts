"use server";
import apiService from "@/config/axios.service";
import { API_END_POINTS } from "@/constants/apiEndPoints";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IActivityHistory {
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

interface ActivityHistoryResponse {
  data: IActivityHistory[];
  total: number;
  page: number;
  pageSize: number;
}

export const GetAdminActivityHistoyAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      ActivityHistoryResponse,
      { params: IParams }
    >(
      API_END_POINTS.history.adminActivity,
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

export interface ILoginHistory {
  _id: string;
  personType: number;
  logoutAt: string;
  ipAddress: string;
  userAgent: string;
  isActive: number;
  loginAt: string;
  admin: {
    email: string;
    _id: string;
  };
}

interface LoginHistoryResponse {
  data: ILoginHistory[];
  total: number;
  page: number;
  pageSize: number;
}

export const GetLoginActivityHistoyAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      LoginHistoryResponse,
      { params: IParams }
    >(
      API_END_POINTS.history.adminLogin,
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
