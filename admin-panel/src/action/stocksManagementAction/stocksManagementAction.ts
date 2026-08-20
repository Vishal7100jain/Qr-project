"use server";
import marketDataApiService from "@/config/marketData.axios.service";
import { MARKET_DATA_API_END_POINT } from "@/constants/marketData.apiEndPoint";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
}

export interface IStockManagementItem {
  _id: string;
  sk: string;
  sn: string;
  in: string;
  xc: string;
  logo: string;
  index: string[];
  createdAt: string;
  updatedAt: string;
}

interface IStockManagementResponse {
  data: IStockManagementItem[];
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
export const GetStocksListAction = async (params: IParams): Promise<any> => {
  try {
    const queryParams: any = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await marketDataApiService.get<
      IStockManagementResponse,
      { params: IParams }
    >(MARKET_DATA_API_END_POINT.stockManagement.get_stocksList, queryParams);

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
export const AddSymbolAction = async (
  data: FormData
): Promise<IData<IStockManagementItem>> => {
  try {
    const response = await marketDataApiService.post<
      IStockManagementItem,
      FormData
    >(`${MARKET_DATA_API_END_POINT.stockManagement.add_stock}`, data);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
    };
  }
};

// Delete symbol from stock list action
export const DeleteSymbolAction = async (data: {
  sk: string;
  xc: string;
}): Promise<IData<IStockManagementItem>> => {
  try {
    const response = await marketDataApiService.delete<IStockManagementItem>(
      `${MARKET_DATA_API_END_POINT.stockManagement.delete_stock}?sk=${data.sk}&xc=${data.xc}`
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
export const UploadStockListCSVAction = async (data: any): Promise<any> => {
  try {
    const response = await marketDataApiService.post<any, any>(
      `${MARKET_DATA_API_END_POINT.stockManagement.post_csv}`,
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

// Get Stocks data by id
export const GetStockById = async ({ id }: { id: string }) => {
  try {
    const response = await marketDataApiService.get<IStockManagementItem, {}>(
      `${MARKET_DATA_API_END_POINT.stockManagement.getById}/${id}`
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

// ✅ Update Stocks by Id
export const UpdateStockById = async (
  id: string,
  data: FormData
): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.put(
      `${MARKET_DATA_API_END_POINT.stockManagement.getById}/${id}`,
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
