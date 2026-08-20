"use server";
import apiService from "@/config/axios.service";
import { PlanStatusEnum, PlanTypeEnum } from "@/constants/adminEnum";
import { API_END_POINTS } from "@/constants/apiEndPoints";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IPlanPrice {
  monthly: number;
  yearly: number;
}

export interface IPlanDiscountDetail {
  amount: number;
  percentage: number;
}

export interface IPlanDiscount {
  monthly: IPlanDiscountDetail;
  yearly: IPlanDiscountDetail;
}

export interface IPlanLimits {
  maxPortfolio: number;
  maxImagesPerPortfolio: number;
}

export interface IPlanPostManagementItem {
  _id: string;
  planType: PlanTypeEnum;
  planName: string;
  planDescription: string;
  slug?: string;

  price: IPlanPrice;
  discount: IPlanDiscount;
  limits: IPlanLimits;

  status: PlanStatusEnum;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  modifiedBy: string;
}

interface IPlanPostManagementResponse {
  data: IPlanPostManagementItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface IData<T> {
  data?: T;
  message: string;
  status: "success" | "error";
}

export const GetPlanOverviewManagementAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      IPlanPostManagementResponse,
      { params: IParams }
    >(
      API_END_POINTS.planOverview.get,
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

export const CreatePlanPostAction = async (
  data: IPlanPostManagementItem
): Promise<IData<IPlanPostManagementResponse>> => {
  try {
    const response = await apiService.post<
      IPlanPostManagementResponse,
      IPlanPostManagementItem
    >(`${API_END_POINTS.planOverview.post}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const UpdatePlanPostAction = async (
  id: string,
  data: IPlanPostManagementItem
): Promise<IData<IPlanPostManagementResponse>> => {
  try {
    const response = await apiService.put<
      IPlanPostManagementResponse,
      IPlanPostManagementItem
    >(`${API_END_POINTS.planOverview.put}/${id}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const fetchPlansOverviewByIdAction = async (id: string) => {
  try {
    const response = await apiService.get<IPlanPostManagementItem, {}>(
      `${API_END_POINTS.planOverview.get}/${id}`
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

export const DeletePlanPostByIdAction = async ({ id }: { id: string }) => {
  try {
    const response = await apiService.delete(
      `${API_END_POINTS.planOverview.delete}/${id}`
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
