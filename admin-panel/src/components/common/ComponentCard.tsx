"use client";

import { ModuleName, PermissionType } from "@/constants/permissionEnums";
import { useAdminStore } from "@/zustand/admin.store";
import { ArrowBigLeftIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import Button from "../ui/button/Button";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  description?: string;
  addDataPageUrl?: string;
  moduleName?: ModuleName;
  customeButton?: ReactNode;
  goBlackUrl?: boolean;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  description = "",
  addDataPageUrl,
  moduleName,
  customeButton,
  goBlackUrl,
}) => {
  const router = useRouter();
  const { admin } = useAdminStore();

  const hasAddPermission =
    admin?.role?.access?.some((permission) => {
      return (
        permission?.module === moduleName &&
        permission.permissions.includes(PermissionType.CREATE)
      );
    }) || admin?.role?.name === "super_admin";

  const handleRedirect = () => {
    router.back();
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      <div className="flex flex-col  sm:flex-row justify-between sm:items-center px-6 py-5">
        <div className="order-2 sm:order-1">
          <h3 className="text-xl text-black dark:text-white font-semibold mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>

        <div className="mb-3 sm:mb-0 order-1 sm:order-2">
          {goBlackUrl ? (
            <div>
              <Button onClick={handleRedirect} startIcon={<ArrowBigLeftIcon />}>
                Back
              </Button>
            </div>
          ) : null}
          {hasAddPermission ? (
            <div className="flex flex-row gap-2">
              {customeButton && customeButton}
              {addDataPageUrl && (
                <Link
                  href={addDataPageUrl}
                  passHref
                  className="self-end md:self-start"
                >
                  <Button startIcon={<PlusIcon />}>Add</Button>
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
