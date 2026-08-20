"use server";
import marketDataApiService from "@/config/marketData.axios.service";
import { MARKET_DATA_API_END_POINT } from "@/constants/marketData.apiEndPoint";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IETFsManagementItem {
  _id: string;
  sk: string;
  ud: string;
  sn: string;
  logo: string;
  logoUrl: string;
  tp: string;
  in: number;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

interface IETFManagementResponse {
  data: IETFsManagementItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface IData<T> {
  data?: T;
  message: string;
  status: "success" | "error";
}

// Get stock list action to get stock list paginated
export const GetETFListAction = async (params: IParams): Promise<any> => {
  try {
    const queryParams: any = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await marketDataApiService.get<
      IETFManagementResponse,
      { params: IParams }
    >(MARKET_DATA_API_END_POINT.etfManagement.get_etfList, queryParams);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
      data: [],
    };
  }
};

// add symbol to the stock list action
export const AddETFAction = async (
  data: FormData
): Promise<IData<IETFsManagementItem>> => {
  try {
    const response = await marketDataApiService.post<
      IETFsManagementItem,
      FormData
    >(`${MARKET_DATA_API_END_POINT.etfManagement.add_etf}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const EditETFAction = async (
  id: string,
  data: FormData
): Promise<IData<IETFsManagementItem>> => {
  try {
    const response = await marketDataApiService.put<
      IETFsManagementItem,
      FormData
    >(`${MARKET_DATA_API_END_POINT.etfManagement.edit_etfList}?id=${id}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const fetchETFBySkAction = async (
  id: string
): Promise<IData<IETFsManagementItem>> => {
  try {
    const response = await marketDataApiService.get<
      IETFsManagementItem,
      undefined
    >(`${MARKET_DATA_API_END_POINT.etfManagement.get_etf_by_sk}/${id}`);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};
// Delete symbol from stock list action
export const DeleteETFAction = async (
  id: string
): Promise<IData<IETFsManagementItem>> => {
  try {
    const response = await marketDataApiService.delete<IETFsManagementItem>(
      `${MARKET_DATA_API_END_POINT.etfManagement.delete_etf}?id=${id}`
    );

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

// Delete symbol from stock list action
export const UploadETFListCSVAction = async (data: any): Promise<any> => {
  try {
    const response = await marketDataApiService.post<any, any>(
      `${MARKET_DATA_API_END_POINT.etfManagement.post_csv}`,
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
