import Image from "next/image";
import { useCallback } from "react";
import Badge from "../ui/badge/Badge";
import { ColumnConfig } from "./ListTable";

const useListTableRenderCell = () => {
  // Memoized cell renderer
  const renderCell = useCallback((row: any, column: ColumnConfig<any>) => {
    const value = row[column?.key];

    if (column?.omit) {
      return;
    }

    if (value === undefined || value === null) {
      return <span className="text-gray-600 dark:text-gray-300">-</span>;
    }

    if (column?.render && (String(value) || Array.isArray(value))) {
      return column?.render(value, row);
    }

    switch (column?.type) {
      case "image":
        return (
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <Image
              width={40}
              height={40}
              src={value as string}
              alt=""
              className="object-cover"
            />
          </div>
        );

      case "avatar":
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <Image
                width={40}
                height={40}
                src={(value as any)?.image}
                alt={(value as any)?.name}
                className="object-cover"
              />
            </div>
            <div>
              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {(value as any)?.name}
              </span>
              {(value as any)?.role && (
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {(value as any)?.role}
                </span>
              )}
            </div>
          </div>
        );

      case "avatarGroup":
        return (
          <div className="flex -space-x-2">
            {(value as string[])?.map((img, index) => (
              <div
                key={index}
                className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
              >
                <Image
                  width={24}
                  height={24}
                  src={img}
                  alt={`Team member ${index + 1}`}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        );

      case "badge":
        const badgeColor =
          column?.badgeConfig?.colorMap?.[value as string] || "primary";
        return <Badge color={badgeColor}>{value}</Badge>;

      case "custom":
        return (
          // @ts-ignore
          <span className="text-gray-600 dark:text-gray-300">{value}</span>
        );

      default:
        return (
          <span className="text-gray-600 dark:text-gray-300">
            {value as string}
          </span>
        );
    }
  }, []);

  return { renderCell };
};

export default useListTableRenderCell;
