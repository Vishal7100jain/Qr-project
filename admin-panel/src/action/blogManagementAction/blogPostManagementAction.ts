"use server";
import apiService from "@/config/axios.service";
import { API_END_POINTS } from "@/constants/apiEndPoints";
import { BlogPostStatus, BlogType, RoleEnum } from "@/enums/adminEnums";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IBlogPostManagementItem {
  _id: string;
  title: string;
  description: string;

  slug: string;
  content: string;
  tags: string[];
  views: number;
  likes: number;
  status: BlogPostStatus;
  type: BlogType;
  contentLength: number;
  hasImage: boolean;
  createdByRole: RoleEnum;

  thumbnail?: File | string;

  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  updatedAt: string;

  categoryId?: any;
  categorySlug?: string;
}

interface IBlogPostManagementResponse {
  data: IBlogPostManagementItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface IData<T> {
  data?: T;
  message: string;
  status: "success" | "error";
}

export const GetBlogPostManagementAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await apiService.get<
      IBlogPostManagementResponse,
      { params: IParams }
    >(
      API_END_POINTS.blogPost.get,
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

export const CreateBlogPostAction = async (
  data: IBlogPostManagementItem
): Promise<IData<IBlogPostManagementResponse>> => {
  try {
    const response = await apiService.post<
      IBlogPostManagementResponse,
      IBlogPostManagementItem
    >(`${API_END_POINTS.blogPost.post}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const UpdateBlogPostAction = async (
  id: string,
  data: IBlogPostManagementItem
): Promise<IData<IBlogPostManagementResponse>> => {
  try {
    const response = await apiService.put<
      IBlogPostManagementResponse,
      IBlogPostManagementItem
    >(`${API_END_POINTS.blogPost.put}/${id}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const fetchBlogPostByIdAction = async (id: string) => {
  try {
    const response = await apiService.get<IBlogPostManagementItem, {}>(
      `${API_END_POINTS.blogPost.get}/${id}`
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

export const DeleteBlogPostByIdAction = async ({ id }: { id: string }) => {
  try {
    const response = await apiService.delete(
      `${API_END_POINTS.blogPost.delete}/${id}`
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
