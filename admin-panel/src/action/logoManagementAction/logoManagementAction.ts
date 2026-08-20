"use server";
import marketDataApiService from "@/config/marketData.axios.service";
import { MARKET_DATA_API_END_POINT } from "@/constants/marketData.apiEndPoint";

interface IParams {
  [key: string]: any;
  page: number;
  pageSize: number;
  search?: string;
}

export interface ILogoManagementSummary {
  totalStocks: number;
  stocksWithLogo: number;
  stocksWithoutLogo: number;
  logoCompletionPercentage: string;
}

export interface ILogoPendingItem {
  _id?: string;
  sk: string;
  xc: string;
  in?: string;
  logo?: string;
  fileName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILogoPendingResponse {
  summary: ILogoManagementSummary;
  pendingStocks: {
    data: ILogoPendingItem[];
    total: number;
    page: number;
    totalPages: number;
  };
}

interface IData<T> {
  data?: T;
  message: string;
  status: "success" | "error";
}

// ✅ Get Logo Management Analysis (paginated)
export const GetLogoManagementAnalysisAction = async (
  params: IParams
): Promise<any> => {
  try {
    const queryParams: any = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    const response = await marketDataApiService.get<
      ILogoPendingResponse,
      { params: IParams }
    >(MARKET_DATA_API_END_POINT.logoManagement.get_analysis, queryParams);

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "Failed to fetch logo management data",
    };
  }
};

// ✅ Add New Symbol Logo (via URL or file)
export const AddNewSymbolLogoAction = async (
  data: FormData
): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.post<any, FormData>(
      MARKET_DATA_API_END_POINT.logoManagement.add_logo,
      data
    );

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "Failed to add symbol logo",
    };
  }
};

// ✅ Delete Symbol Logo by sk
export const DeleteSymbolLogoAction = async (data: {
  sk: string;
}): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.delete<any>(
      `${MARKET_DATA_API_END_POINT.logoManagement.delete_logo}/${data.sk}`
    );

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "Failed to delete symbol logo",
    };
  }
};

// ✅ Set Up Logo for all stock api
export const LogoSetUpForAllStocksAction = async (): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.get<any, any>(
      `${MARKET_DATA_API_END_POINT.logoManagement.set_up_logo}`
    );

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "Failed to set up symbols logo",
    };
  }
};

// ✅ Set Up Logo for existing stock api
export const LogoSetUpForExistingStocksAction = async (): Promise<
  IData<any>
> => {
  try {
    const response = await marketDataApiService.get<any, any>(
      `${MARKET_DATA_API_END_POINT.logoManagement.set_up_existing}`
    );

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message || "Failed to set up symbols existing logo",
    };
  }
};
