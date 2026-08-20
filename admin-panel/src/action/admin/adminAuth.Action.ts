"use server";

import apiService from "@/config/axios.service";
import { envConfig } from "@/config/env.config";
import { API_END_POINTS } from "@/constants/apiEndPoints";
import { ServerCookieKeys } from "@/constants/keys";
import { setServerCookie } from "@/utils/serverSideCookie";

type TData = {
  email: string;
  password: string;
};

interface IAdmin {
  _id: string;
  username: string;
  email: string;
  role: {
    name: string;
    access: {
      module: string;
      permissions: string[];
    }[];
  };
  token: string;
}

export async function HandleLoginAction(data: TData) {
  try {
    const response = await apiService.post<
      IAdmin,
      { email: string; password: string }
    >(API_END_POINTS.auth.login, data);

    if (response?.status === "success" && response?.data) {
      const { data } = response;
      const admin = {
        _id: data?._id,
        username: data?.username,
        email: data?.email,
        role: data?.role,
      };

      await Promise.all([
        setServerCookie(ServerCookieKeys.token, response?.data?.token, {
          maxAge: envConfig.serverCookie.tokenExpiry,
        }),
        setServerCookie(ServerCookieKeys.admin, admin, {
          maxAge: envConfig.serverCookie.adminExpiry,
        }),
      ]);
    }

    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
      data: [],
    };
  }
}

export async function handleLogoutApiCall() {
  try {
    const response = await apiService.post<IAdmin, {}>(
      API_END_POINTS.auth.logout,
      {}
    );

    await HandleLogoutServerAction();
    return response;
  } catch (error: any) {
    return {
      status: "error",
      message: error?.message,
      data: [],
    };
  }
}

export async function HandleLogoutServerAction() {
  await Promise.all([
    setServerCookie(ServerCookieKeys.token, "", { maxAge: 0 }),
    setServerCookie(ServerCookieKeys.admin, "", { maxAge: 0 }),
  ]);
}
