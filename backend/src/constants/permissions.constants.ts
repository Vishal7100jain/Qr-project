// Module Names
export enum ModuleName {
  ADMIN = "admin",
  ADMINMANAGEMENT = "adminManagement",
  ROLEMANAGEMENT = "roleManagement",
  ACCESSMANAGEMENT = "accessManagement",
  ADMIN_ACTIVITY_HISTORY = "adminActivityHistory",
  ADMIN_LOGIN_HISTORY = "adminLoginHistory",
  PROFILE = "profile",
  BLOG_POST = "blogPost",
  BLOG_CATEGORY = "blogCategory",
  MEMBER_MANAGEMENT = "memberManagement",
  MEMBER_LOGIN_HISTORY = "memberLoginHistory",
  MEMBER_ACTIVITY_HISTORY = "memberActivityHistory",
  BOOKING_MANAGEMENT = "bookingManagement",
  COMMING_SOON_MANAGEMENT = "commingSoonManagement",
  MEHNDI_DESIGN = "mehndi_design",
  BOOKING = "booking",
  CUSTOMER = "customer",
  PLANS = "plan",
  PLANFEATURE = "planFeature",
  PLANFAQ = "planFAQ",
}

// Permission Types
export enum PermissionType {
  VIEW = "view",
  CREATE = "create",
  EDIT = "edit",
  DELETE = "delete",
}

// Permission Structure
export interface IPermission {
  module: ModuleName;
  permissions: PermissionType[];
}

// Helper function to generate permission strings
export const generatePermissionString = (
  module: ModuleName,
  action: PermissionType
): string => {
  return `${module}_${action}`;
};

// Default permissions for each role
export const DEFAULT_ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(ModuleName).map((module) => ({
    module,
    permissions: Object.values(PermissionType),
  })),
  CONTENT_MANAGER: [
    {
      module: ModuleName.MEHNDI_DESIGN,
      permissions: [
        PermissionType.VIEW,
        PermissionType.CREATE,
        PermissionType.EDIT,
      ],
    },
    {
      module: ModuleName.BLOG_POST,
      permissions: [
        PermissionType.VIEW,
        PermissionType.CREATE,
        PermissionType.EDIT,
      ],
    },
  ],
  BOOKING_MANAGER: [
    { module: ModuleName.BOOKING, permissions: Object.values(PermissionType) },
    {
      module: ModuleName.CUSTOMER,
      permissions: [PermissionType.VIEW, PermissionType.EDIT],
    },
  ],
  CUSTOMER_SUPPORT: [
    {
      module: ModuleName.BOOKING,
      permissions: [PermissionType.VIEW, PermissionType.EDIT],
    },
    { module: ModuleName.CUSTOMER, permissions: [PermissionType.VIEW] },
  ],
};

export const ADMIN_ROLES = {
  SUPER_ADMIN: "super_admin",
  DEFAUL: "default",
};
