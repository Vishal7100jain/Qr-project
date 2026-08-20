"use server";
import marketDataApiService from "@/config/marketData.axios.service";
import { MARKET_DATA_API_END_POINT } from "@/constants/marketData.apiEndPoint";

interface IData<T> {
  data?: T;
  message: string;
  status: "success" | "error";
}

// ✅ Sync all instruments in DB and cache
export const SyncAllInstrumentsAction = async (): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.put<any, any>(
      MARKET_DATA_API_END_POINT.syncManagement.sync_instruments,
      {}
    );
    return response;
  } catch (error: any) {
    return { status: "error", message: error?.message };
  }
};

// ✅ Sync Holiday List in DB and cache
export const SyncHolidayListAction = async (): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.put<any, any>(
      MARKET_DATA_API_END_POINT.syncManagement.sync_holiday_list,
      {}
    );
    return response;
  } catch (error: any) {
    return { status: "error", message: error?.message };
  }
};

// ✅ Sync 1 month Market time in DB and cache
export const SyncMarketTimeAction = async (): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.put<any, any>(
      MARKET_DATA_API_END_POINT.syncManagement.sync_market_time,
      {}
    );
    return response;
  } catch (error: any) {
    return { status: "error", message: error?.message };
  }
};

// ✅ Update Socket Source from cache for live price
export const UpdateSocketSimulationAction = async (): Promise<IData<any>> => {
  try {
    const response = await marketDataApiService.put<any, any>(
      MARKET_DATA_API_END_POINT.syncManagement.sync_socket_simulation,
      {}
    );
    return response;
  } catch (error: any) {
    return { status: "error", message: error?.message };
  }
};
