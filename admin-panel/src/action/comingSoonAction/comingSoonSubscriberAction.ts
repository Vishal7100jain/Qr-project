"use server";
import apiService from "@/config/axios.service";
import { API_END_POINTS } from "@/constants/apiEndPoints";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IComingSoon {
  _id: string;
  email: string;
}

export interface IComingSoonData {
  data: IComingSoon[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IComingSoonResponse {
  data: IComingSoonData;
  message: string;
  status: "success" | "error";
}

export const GetComingSoonSubscriberAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      IComingSoonResponse,
      { params: IParams }
    >(
      API_END_POINTS.comingSoon.comingSoonSubscriber,
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
