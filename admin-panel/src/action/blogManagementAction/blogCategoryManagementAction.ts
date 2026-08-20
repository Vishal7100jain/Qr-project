"use server";
import apiService from "@/config/axios.service";
import { API_END_POINTS } from "@/constants/apiEndPoints";
import { BlogStatus } from "@/enums/adminEnums";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IBlogCategoryManagementItem {
  _id: string;
  name: string;
  slug: string;
  status: BlogStatus;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface IBlogCategoryManagementResponse {
  data: IBlogCategoryManagementItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface IData<T> {
  data?: T;
  message: string;
  status: "success" | "error";
}

export const GetBlogCategoryManagementAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      IBlogCategoryManagementResponse,
      { params: IParams }
    >(
      API_END_POINTS.blogCategory.get,
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

export const CreateBlogCategoryAction = async (
  data: IBlogCategoryManagementItem
): Promise<IData<IBlogCategoryManagementResponse>> => {
  try {
    const response = await apiService.post<
      IBlogCategoryManagementResponse,
      IBlogCategoryManagementItem
    >(`${API_END_POINTS.blogCategory.post}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const UpdateBlogCategoryAction = async (
  id: string,
  data: IBlogCategoryManagementItem
): Promise<IData<IBlogCategoryManagementResponse>> => {
  try {
    const response = await apiService.put<
      IBlogCategoryManagementResponse,
      IBlogCategoryManagementItem
    >(`${API_END_POINTS.blogCategory.put}/${id}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const fetchBlogCategoryByIdAction = async (id: string) => {
  try {
    const response = await apiService.get<IBlogCategoryManagementItem, {}>(
      `${API_END_POINTS.blogCategory.get}/${id}`
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

export const DeleteBlogCategoryByIdAction = async ({ id }: { id: string }) => {
  try {
    const response = await apiService.delete(
      `${API_END_POINTS.blogCategory.delete}/${id}`
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

export const getCategoryListAction = async () => {
  try {
    const response = await apiService.get<
      { value: string; label: string }[],
      []
    >(API_END_POINTS.blogCategory.getList);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
      data: [],
    };
  }
};
