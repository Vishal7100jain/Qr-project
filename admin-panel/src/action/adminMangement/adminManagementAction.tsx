"use server";

import apiService from "@/config/axios.service";
import { AdminStatus, DeletedEnum } from "@/constants/adminEnum";
import { API_END_POINTS } from "@/constants/apiEndPoints";
import { IAdmin } from "@/zustand/admin.store";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IAdminManagementItem {
  _id: string;
  username: string;
  email: string;
  status: number;
  contactNumber: string;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

interface AdminManagementResponse {
  data: IAdminManagementItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface IAdminCreateResponse {
  username: string;
  email: string;
  roleId: string;
  status: AdminStatus;
  isDeleted: DeletedEnum;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const GetAdminManagementAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      AdminManagementResponse,
      { params: IParams }
    >(
      API_END_POINTS.adminManagement.get,
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
export const CreateAdminAction = async (
  data: FormData
): Promise<IData<IAdminCreateResponse>> => {
  try {
    const response = await apiService.post<IAdminCreateResponse, FormData>(
      `${API_END_POINTS.adminManagement.post}`,
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

export const UpdateAdminAction = async (
  id: string,
  data: FormData
): Promise<IData<IAdminCreateResponse>> => {
  try {
    const response = await apiService.put<IAdminCreateResponse, FormData>(
      `${API_END_POINTS.adminManagement.put}/${id}`,
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

export const fetchAdminByIdAction = async (id: string) => {
  try {
    const response = await apiService.get<IAdmin, {}>(
      `${API_END_POINTS.adminManagement.getAdmin}/${id}`
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

export const DeleteAdminByIdAction = async ({
  id,
  superAdminPassword,
}: {
  id: string;
  superAdminPassword?: string;
}) => {
  try {
    const response = await apiService.delete(
      `${API_END_POINTS.adminManagement.delete}/${id}`,
      { data: { superAdminPassword } }
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

export const getRoleListAction = async () => {
  try {
    const response = await apiService.get<
      { value: string; label: string }[],
      []
    >(API_END_POINTS.adminManagement.getRoleList);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
      data: [],
    };
  }
};
