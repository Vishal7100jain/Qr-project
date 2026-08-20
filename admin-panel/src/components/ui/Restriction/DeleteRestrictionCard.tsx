import { ModuleName, PermissionType } from "@/constants/permissionEnums";
import { useAdminStore } from "@/zustand/admin.store";
import React from "react";

const DeleteRestrictionCard = ({
  moduleName,
  children,
}: {
  moduleName: ModuleName;
  children: React.ReactNode;
}) => {
  const { admin } = useAdminStore();

  const hasDeletePermission = admin?.role?.access?.some((permission) => {
    return (
      permission?.module === moduleName &&
      permission.permissions.includes(PermissionType.DELETE)
    );
  });

  return (
    <>
      {hasDeletePermission || admin?.role?.name === "super_admin" ? (
        <>{children}</>
      ) : null}
    </>
  );
};

export default DeleteRestrictionCard;
