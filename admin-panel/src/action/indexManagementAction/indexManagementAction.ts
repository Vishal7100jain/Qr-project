"use server";
import marketDataApiService from "@/config/marketData.axios.service";
import { MARKET_DATA_API_END_POINT } from "@/constants/marketData.apiEndPoint";

interface IParams {
  [key: string]: any;
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface IIndexManagementItem {
  _id: string;
  sk: string;
  sn: string;
  in: string;
  xc: string;
  type: number;
  count: number;
  logo: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

interface IIndexManagementResponse {
  data: IIndexManagementItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface IData<T> {
  data?: T;
  message: string;
  status: "success" | "error";
}

// ✅ Get paginated indices list
export const GetIndexListAction = async (params: IParams): Promise<any> => {
  try {
    const queryParams: any = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await marketDataApiService.get<
      IIndexManagementResponse,
      { params: IParams }
    >(MARKET_DATA_API_END_POINT.indexManagement.get_indexData, queryParams);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "Failed to fetch indices",
    };
  }
};

// ✅ Add single symbol to an index
export const AddSymbolToIndexAction = async (
  data: FormData
): Promise<IData<IIndexManagementItem>> => {
  try {
    const response = await marketDataApiService.post<
      IIndexManagementItem,
      FormData
    >(MARKET_DATA_API_END_POINT.indexManagement.add_symbol, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "Failed to add symbol",
    };
  }
};

// ✅ Delete a symbol from an index
export const DeleteSymbolFromIndexAction = async (data: {
  sk: string;
}): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.delete(
      MARKET_DATA_API_END_POINT.indexManagement.delete_symbol,
      { params: data }
    );

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "Failed to delete symbol",
    };
  }
};

// ✅ Update index by sk — now accepts FormData
export const UpdateIndexBySk = async (
  sk: string,
  data: FormData
): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.put(
      `${MARKET_DATA_API_END_POINT.indexManagement.get_indexData}?sk=${sk}`,
      data
    );

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "Failed to Update Index data",
    };
  }
};

// Get Index list for stocks management form
export const GetIndiceListAction = async () => {
  try {
    const response = await marketDataApiService.get<
      {
        _id: string;
        sk: string;
        sn: string;
        type: number;
      }[],
      []
    >(MARKET_DATA_API_END_POINT.indexManagement.list);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
      data: [],
    };
  }
};

// Get Index data by id
export const GetIndexById = async ({ id }: { id: string }) => {
  try {
    const response = await marketDataApiService.get<IIndexManagementItem, {}>(
      `${MARKET_DATA_API_END_POINT.indexManagement.get_indexData}/${id}`
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
