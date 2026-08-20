"use server";
import apiService from "@/config/axios.service";
import { API_END_POINTS } from "@/constants/apiEndPoints";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

type TAccess = {
  module: string;
  permissions: string;
  _id: string;
};

export interface IRoleManagementItem {
  _id: string;
  name: string;
  access: TAccess[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  modifiedBy?: string;
}

interface IRoleManagementResponse {
  data: IRoleManagementItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface IData<T> {
  data?: T;
  message: string;
  status: "success" | "error";
}

export const GetRoleManagementAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      IRoleManagementResponse,
      { params: IParams }
    >(
      API_END_POINTS.role.get,
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

export const CreateRoleAction = async (
  data: IRoleManagementItem
): Promise<IData<IRoleManagementResponse>> => {
  try {
    const response = await apiService.post<
      IRoleManagementResponse,
      IRoleManagementItem
    >(`${API_END_POINTS.role.post}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const UpdateRoleAction = async (
  id: string,
  data: IRoleManagementItem
): Promise<IData<IRoleManagementResponse>> => {
  try {
    const response = await apiService.put<
      IRoleManagementResponse,
      IRoleManagementItem
    >(`${API_END_POINTS.role.put}/${id}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const fetchRoleByIdAction = async (id: string) => {
  try {
    const response = await apiService.get<IRoleManagementItem, {}>(
      `${API_END_POINTS.role.get}/${id}`
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

export const DeleteRoleByIdAction = async ({ id }: { id: string }) => {
  try {
    const response = await apiService.delete(
      `${API_END_POINTS.role.delete}/${id}`
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
