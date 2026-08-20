"use server";

import apiService from "@/config/axios.service";
import { envConfig } from "@/config/env.config";
import { API_END_POINTS } from "@/constants/apiEndPoints";
import { ServerCookieKeys } from "@/constants/keys";
import { PermissionType } from "@/constants/permissionEnums";
import { setServerCookie } from "@/utils/serverSideCookie";

type TData = {
  email: string;
  password: string;
};

interface IAdmin {
  _id: string;
  username: string;
  email: string;
  role: string;
  permissions: {
    module: string;
    permissions: keyof typeof PermissionType;
  }[];
  token: string;
}

export async function GetAdminProfileAction() {
  try {
    const response = await apiService.get<IAdmin, {}>(
      API_END_POINTS.admin.getProfile,
      {}
    );

    if (response?.status === "success" && response?.data) {
      const { data } = response;
      const admin = {
        _id: data?._id,
        username: data?.username,
        email: data?.email,
        role: data?.role,
      };
      setServerCookie(ServerCookieKeys.admin, admin, {
        maxAge: envConfig.serverCookie.adminExpiry,
      });
    }

    return response;
  } catch (error: any) {
    return {
      message: error?.message,
      status: "error",
      data: [],
    };
  }
}
