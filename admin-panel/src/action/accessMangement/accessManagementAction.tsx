"use server";

import apiService from "@/config/axios.service";
import { API_END_POINTS } from "@/constants/apiEndPoints";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IAccessManagementItem {
  _id: string;
  moduleName: string;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
}

interface AccessManagementResponse {
  data: IAccessManagementItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface IAccessManagementCreateResponse {
  moduleName: string;
  createdBy: string;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export const GetAccessManagementAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      AccessManagementResponse,
      { params: IParams }
    >(
      API_END_POINTS.accessManagement.get,
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

// Create new access management api action
export const CreateAccessManagementAction = async (
  data: IAccessManagementItem
): Promise<IData<IAccessManagementCreateResponse>> => {
  try {
    const response = await apiService.post<
      IAccessManagementCreateResponse,
      IAccessManagementItem
    >(`${API_END_POINTS.accessManagement.post}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const UpdateAccessAction = async (
  id: string,
  data: IAccessManagementItem
): Promise<IData<IAccessManagementCreateResponse>> => {
  try {
    const response = await apiService.put<
      IAccessManagementCreateResponse,
      IAccessManagementItem
    >(`${API_END_POINTS.accessManagement.put}/${id}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const fetchAccessByIdAction = async (id: string) => {
  try {
    const response = await apiService.get<IAccessManagementItem, {}>(
      `${API_END_POINTS.accessManagement.getAccess}/${id}`
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

export const DeleteAccessByIdAction = async ({ id }: { id: string }) => {
  try {
    const response = await apiService.delete(
      `${API_END_POINTS.accessManagement.delete}/${id}`
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

export const GetAccessPermissionsList = async (): Promise<any> => {
  try {
    const response = await apiService.get<
      AccessManagementResponse,
      { params: IParams }
    >(`${API_END_POINTS.accessManagement.getAccessPermissions}`);
    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
      data: [],
    };
  }
};
