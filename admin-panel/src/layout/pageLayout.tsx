"use client";

import { GetAdminProfileAction } from "@/action/admin/adminProfileAction";
import { ServerCookieKeys } from "@/constants/keys";
import { getServerCookie } from "@/utils/serverSideCookie";
import { useAdminStore } from "@/zustand/admin.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PageClient = () => {
  const { setAdmin } = useAdminStore();
  const router = useRouter();

  useEffect(() => {
    const handleAdminAuthSetUp = async () => {
      const token = await getServerCookie(ServerCookieKeys.token);
      if (token) {
        const response: any = await GetAdminProfileAction();
        if (response?.status === "success") {
          setAdmin({ ...response?.data, token });
        } else if (response?.status === "error") {
          router.push("/sign-in");
        }
      }
    };

    handleAdminAuthSetUp();
  }, []);
  return null;
};

export default PageClient;
