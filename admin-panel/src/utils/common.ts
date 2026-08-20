import { ModuleName, PermissionType } from "@/constants/permissionEnums";
import { IAdmin, useAdminStore } from "@/zustand/admin.store";
import CryptoJS from "crypto-js";
import isEqual from "lodash/isEqual";
import moment from "moment";

export const convertDate = (date: Date | string, format = "DD/MM/YYYY") => {
  return moment(date).format(format);
};

export const checkEditDeleteModulePermissions = (
  moduleName: ModuleName,
  admin: IAdmin | null
): Boolean | any => {
  const hasPermissionToViewActionColumn = admin?.role?.access?.some(
    (permission) => {
      return (
        permission?.module === moduleName &&
        (permission.permissions.includes(PermissionType.EDIT) ||
          permission.permissions.includes(PermissionType.VIEW) ||
          permission.permissions.includes(PermissionType.DELETE))
      );
    }
  );

  return hasPermissionToViewActionColumn || admin?.role?.name === "super_admin";
};

export const checkEditApiPermission = (moduleName: ModuleName) => {
  const admin = useAdminStore.getState().admin;
  const hasApiPermission = admin?.role?.access?.some((permission) => {
    return (
      permission?.module === moduleName &&
      permission.permissions.includes(PermissionType.EDIT)
    );
  });

  return hasApiPermission || admin?.role?.name === "super_admin";
};

export const checkViewApiPermission = (moduleName: ModuleName) => {
  const admin = useAdminStore.getState().admin;
  const hasEditPermission = admin?.role?.access?.some((permission) => {
    return (
      permission?.module === moduleName &&
      permission.permissions.includes(PermissionType.VIEW)
    );
  });

  return hasEditPermission || admin?.role?.name === "super_admin";
};

export const checkDeleteApiPermission = (moduleName: ModuleName) => {
  const admin = useAdminStore.getState().admin;
  const hasEditPermission = admin?.role?.access?.some((permission) => {
    return (
      permission?.module === moduleName &&
      permission.permissions.includes(PermissionType.DELETE)
    );
  });

  return hasEditPermission || admin?.role?.name === "super_admin";
};

export const getUserAgentIcon = (agent: string): string | null => {
  const lower = agent.toLowerCase();
  if (lower.includes("chrome")) return "/images/icons/chrome.svg";
  if (lower.includes("firefox")) return "/images/icons/firefox.svg";
  if (lower.includes("safari")) return "/images/icons/safari.svg";
  if (lower.includes("edge")) return "/images/icons/edge.svg";
  if (lower.includes("postman")) return "/images/icons/postman.svg";
  if (lower.includes("android")) return "/images/icons/android.svg";
  if (lower.includes("axios")) return "/images/icons/server.svg";
  return null;
};

type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

export function getStatusBadgeProps(status: number): {
  color: BadgeColor;
  label: string;
} {
  if (status >= 100 && status < 200) {
    return { color: "info", label: "Informational" };
  }
  if (status >= 200 && status < 300) {
    return { color: "success", label: "Success" };
  }
  if (status >= 300 && status < 400) {
    return { color: "primary", label: "Redirect" };
  }
  if (status >= 400 && status < 500) {
    return { color: "warning", label: "Client Error" };
  }
  if (status >= 500 && status < 600) {
    return { color: "error", label: "Server Error" };
  }
  return { color: "light", label: "Unknown" };
}

export function getMethodBadgeProps(method: string): {
  color: BadgeColor;
  label: string;
} {
  const normalized = method?.toUpperCase();

  switch (normalized) {
    case "GET":
      return { color: "primary", label: "GET – Read" };
    case "POST":
      return { color: "success", label: "POST – Create" };
    case "PUT":
      return { color: "warning", label: "PUT – Update" };
    case "PATCH":
      return { color: "info", label: "PATCH – Partial Update" };
    case "DELETE":
      return { color: "error", label: "DELETE – Remove" };
    case "OPTIONS":
      return { color: "light", label: "OPTIONS" };
    case "HEAD":
      return { color: "light", label: "HEAD" };
    default:
      return { color: "dark", label: normalized || "UNKNOWN" };
  }
}

export function getChangedFields<T extends Record<string, any>>(
  values: T,
  original: Partial<T>
): Partial<T> {
  return Object.keys(values).reduce((acc: Partial<T>, key) => {
    if (!isEqual(values[key], original?.[key])) {
      acc[key as keyof T] = values[key];
    }
    return acc;
  }, {});
}

export function appendChangedFieldsToFormData<T extends Record<string, any>>(
  formData: FormData,
  values: T,
  original?: Partial<T>,
  skipFields: string[] = [],
  fileChanged: boolean = false,
  fileFieldNames: string[] = ["profilePic"]
) {
  const alwaysSkipFields = ["profilePhoto"];

  Object.keys(values).forEach((key) => {
    if (skipFields.includes(key)) {
      return;
    }

    if (alwaysSkipFields.includes(key)) {
      return;
    }

    const newValue = values[key];
    const oldValue = original?.[key];

    if (typeof newValue === "string" && newValue.startsWith("blob:")) {
      return;
    }

    if (fileFieldNames.includes(key)) {
      if (fileChanged && newValue) {
        formData.append(key, newValue);
      }
    } else if (newValue instanceof File) {
      console.error(`⏭️ Skipping unwanted file field: ${key}`);
    } else if (
      !isEqual(newValue, oldValue) &&
      String(newValue) !== String(oldValue)
    ) {
      formData.append(key, newValue);
    } else {
      console.error(`⏭️ No changes for field: ${key}`);
    }
  });
}

const SECRET_KEY = "bridal-mehndi";

export const commonStorageObj = {
  getItem: (name: any) => {
    const encrypted = localStorage.getItem(name);
    if (!encrypted) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  },
  setItem: (name: any, value: any) => {
    const stringValue = JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
    localStorage.setItem(name, encrypted);
  },
  removeItem: (name: any) => localStorage.removeItem(name),
};
