import { ModuleName, PermissionType } from "@/constants/permissionEnums";
import { useAdminStore } from "@/zustand/admin.store";
import React from "react";

const EditRestrictionCard = ({
  moduleName,
  children,
}: {
  moduleName: ModuleName;
  children: React.ReactNode;
}) => {
  const { admin } = useAdminStore();

  const hasEditPermission = admin?.role?.access?.some((permission) => {
    return (
      permission?.module === moduleName &&
      permission.permissions.includes(PermissionType.EDIT)
    );
  });

  return (
    <>
      {hasEditPermission || admin?.role?.name === "super_admin" ? (
        <>{children}</>
      ) : null}
    </>
  );
};

export default EditRestrictionCard;
