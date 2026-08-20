"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ROLES = exports.DEFAULT_ROLE_PERMISSIONS = exports.generatePermissionString = exports.PermissionType = exports.ModuleName = void 0;
// Module Names
var ModuleName;
(function (ModuleName) {
    ModuleName["ADMIN"] = "admin";
    ModuleName["ADMINMANAGEMENT"] = "adminManagement";
    ModuleName["ROLEMANAGEMENT"] = "roleManagement";
    ModuleName["ACCESSMANAGEMENT"] = "accessManagement";
    ModuleName["ADMIN_ACTIVITY_HISTORY"] = "adminActivityHistory";
    ModuleName["ADMIN_LOGIN_HISTORY"] = "adminLoginHistory";
    ModuleName["PROFILE"] = "profile";
    ModuleName["BLOG_POST"] = "blogPost";
    ModuleName["BLOG_CATEGORY"] = "blogCategory";
    ModuleName["MEMBER_MANAGEMENT"] = "memberManagement";
    ModuleName["MEMBER_LOGIN_HISTORY"] = "memberLoginHistory";
    ModuleName["MEMBER_ACTIVITY_HISTORY"] = "memberActivityHistory";
    ModuleName["BOOKING_MANAGEMENT"] = "bookingManagement";
    ModuleName["COMMING_SOON_MANAGEMENT"] = "commingSoonManagement";
    ModuleName["MEHNDI_DESIGN"] = "mehndi_design";
    ModuleName["BOOKING"] = "booking";
    ModuleName["CUSTOMER"] = "customer";
    ModuleName["PLANS"] = "plan";
    ModuleName["PLANFEATURE"] = "planFeature";
    ModuleName["PLANFAQ"] = "planFAQ";
})(ModuleName || (exports.ModuleName = ModuleName = {}));
// Permission Types
var PermissionType;
(function (PermissionType) {
    PermissionType["VIEW"] = "view";
    PermissionType["CREATE"] = "create";
    PermissionType["EDIT"] = "edit";
    PermissionType["DELETE"] = "delete";
})(PermissionType || (exports.PermissionType = PermissionType = {}));
// Helper function to generate permission strings
const generatePermissionString = (module, action) => {
    return `${module}_${action}`;
};
exports.generatePermissionString = generatePermissionString;
// Default permissions for each role
exports.DEFAULT_ROLE_PERMISSIONS = {
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
exports.ADMIN_ROLES = {
    SUPER_ADMIN: "super_admin",
    DEFAUL: "default",
};
