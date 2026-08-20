"use server";
import marketDataApiService from "@/config/marketData.axios.service";
import { MARKET_DATA_API_END_POINT } from "@/constants/marketData.apiEndPoint";
import { IJobs } from "@/zustand/apiJob.store";

interface IParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface IHistoricalDataItem {
  _id: string;
  s: string; // symbol
  f: string; // timeframe
  ex: string; // expiry
}

interface IHistoricalDataResponse {
  data: IHistoricalDataItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface IData<T> {
  data?: T;
  message: string;
  status: "success" | "error";
}

// ✅ Get paginated stock list
export const GetHistoricalDataListAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await marketDataApiService.get<
      IHistoricalDataResponse,
      IParams
    >(MARKET_DATA_API_END_POINT.historicalDataManagement.get_list, queryParams);

    return response;
  } catch (error: any) {
    return { status: "error", message: error?.message, data: [] as any };
  }
};

// ✅ Insert all historical data (starts background job)
export const InsertAllHistoricalDataAction = async (): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.post<any, any>(
      MARKET_DATA_API_END_POINT.historicalDataManagement.insert_all,
      {}
    );
    return response;
  } catch (error: any) {
    return { status: "error", message: error?.message };
  }
};

// ✅ Insert historical data by Symbols
export const InsertHistoricalDataBySymbolsAction = async (data: {
  symbols: string[];
}): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.post(
      MARKET_DATA_API_END_POINT.historicalDataManagement.insert_by_symbols,
      data
    );
    return response;
  } catch (error: any) {
    return { status: "error", message: error?.message };
  }
};

// ✅ Insert historical data by date range
export const InsertHistoricalDataByRangeAction = async (data: {
  startDate: string;
  endDate: string;
  config: any;
}): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.post(
      MARKET_DATA_API_END_POINT.historicalDataManagement.insert_by_range,
      data
    );
    return response;
  } catch (error: any) {
    return { status: "error", message: error?.message };
  }
};

// ✅ Delete historical data by symbol and timeframe
export const DeleteHistoricalDataAction = async (data: {
  symbol: string;
  timeFrame?: string;
}): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.delete(
      MARKET_DATA_API_END_POINT.historicalDataManagement.delete,
      { data }
    );
    return response;
  } catch (error: any) {
    return { status: "error", message: error?.message };
  }
};

interface ILogs {
  msg: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}
interface IHistoricalLogsResponse {
  data: ILogs[];
  total: number;
  page: number;
  pageSize: number;
}

// ✅ Get paginated logs
export const GetHistoricalLogsAction = async (
  params: IParams,
  email: string
): Promise<any> => {
  try {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await marketDataApiService.get<
      IHistoricalLogsResponse,
      IParams
    >(
      `${MARKET_DATA_API_END_POINT.historicalDataManagement.get_logs}/${email}`,
      queryParams
    );

    return {
      status: "success",
      message: "Logs Fetched successfully",
      data: response.data,
    };
  } catch (error: any) {
    return { status: "error", message: error?.message, data: [] as any };
  }
};

interface IHistoricalJobIdResponse {
  data: IJobs[];
  total: number;
  page: number;
  pageSize: number;
}

// ✅ Get paginated logs
export const GetHistoricalJobIdsAction = async (
  email: string | any,
  page: number,
  pageSize: number
): Promise<any> => {
  try {
    const response = await marketDataApiService.get<
      IHistoricalJobIdResponse,
      IParams
    >(
      `${MARKET_DATA_API_END_POINT.historicalDataManagement.get_jobIds}?email=${email}&page=${page}&pageSize=${pageSize}`,
      {}
    );

    return response;
  } catch (error: any) {
    return { status: "error", message: error?.message, data: [] as any };
  }
};
