"use client";

import Button from "@/components/ui/button/Button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useModuleStore } from "@/zustand/module.store";
import { format } from "date-fns";
import { customToast } from "../customToast";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import ListTableFilteres from "./ListTableFilteres";
import useListTableRenderCell from "./ListTableRenderCell";
import Pagination from "./Pagination";
import { defaultLoadingState } from "./tableDeafultLoading";

// Define types for the table configuration
type ColumnType =
  | "text"
  | "image"
  | "badge"
  | "avatar"
  | "avatarGroup"
  | "custom";

export interface ColumnConfig<T> {
  key: keyof T;
  header: string;
  type?: ColumnType;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
  badgeConfig?: {
    colorMap: Record<
      string,
      "success" | "warning" | "error" | "info" | "primary"
    >;
  };
  omit?: boolean;
  sortable?: boolean;
  headerClassName?: string;
}

interface DynamicTableProps<T> {
  columns: ColumnConfig<T>[];
  fetchData: (params: {
    page: number;
    pageSize: number;
    [key: string]: any;
  }) => Promise<{
    data: {
      data: T[];
      total: number;
      page: number;
      pageSize: number;
    };
    message: string;
    status: "success" | "error";
  }>;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  className?: string;
  rowClassName?: string;
  headerClassName?: string;
  cellClassName?: string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectedRowsChange?: (selectedRows: T[]) => void;
  filters?: {
    search?: boolean;
    searchPlaceHolder?: string;
    emailSearch?: boolean;
    emailSearchPlaceHolder?: string;
    status?: boolean;
    IPOstatus?: boolean;
    statusCode?: boolean;
    typeDropdown?: boolean;
    date?: boolean;
    dropdown?: {
      key: string;
      label: string;
      options: { label: string; value: any }[];
    }[];
    budgetRange?: boolean;
    pincode?: boolean;
    blogStatus?: boolean;
    verifyStatus?: boolean;
  };
  exportable?: boolean;
  expandableRows?: boolean;
  expandableComponent?: (row: T) => React.ReactNode;
  rowKey?: keyof T;
}

const defaultEmptyState = (
  <div className="text-xl py-12 text-center text-gray-500 dark:text-gray-400">
    No data available
  </div>
);

export function DynamicTable<T extends { id: string | number }>({
  columns,
  fetchData,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  emptyState = defaultEmptyState,
  loadingState,
  className = "",
  rowClassName = "",
  headerClassName = "",
  cellClassName = "",
  onRowClick,
  selectable = false,
  onSelectedRowsChange,
  filters,
  exportable = false,
  expandableRows = false,
  expandableComponent,
  rowKey = "id" as keyof T,
}: DynamicTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const refreshApi = useModuleStore((state) => state.refetchApi);
  const [expandedRows, setExpandedRows] = useState<
    Set<string | number | T[keyof T]>
  >(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    order: "asc" | "desc";
  }>({ key: null, order: "asc" });

  const [displayFilters, setDisplayFilters] = useState({
    search: "",
    emailSearch: "",
  });

  const [filterParams, setFilterParams] = useState<{
    search: string;
    emailSearch: string;
    status: string | null;
    IPOstatus: string | null;
    type: string | null;
    statusCode: number | null;
    startDate: Date | null;
    endDate: Date | null;
    minBudget: number | null;
    maxBudget: number | null;
    pincode: number | null;
    [key: string]: any;
  }>({
    search: "",
    emailSearch: "",
    type: null,
    statusCode: null,
    IPOstatus: null,
    status: null,
    startDate: null,
    endDate: null,
    minBudget: null,
    maxBudget: null,
    pincode: null,
  });

  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const emailSearchDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setDisplayFilters((prev) => ({ ...prev, search: value }));

    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    searchDebounceTimer.current = setTimeout(() => {
      setFilterParams((prev) => ({ ...prev, search: value }));
      setCurrentPage(1);
    }, 400);
  };

  const handleEmailSearchChange = (value: string) => {
    setDisplayFilters((prev) => ({ ...prev, emailSearch: value }));

    if (emailSearchDebounceTimer.current) {
      clearTimeout(emailSearchDebounceTimer.current);
    }

    emailSearchDebounceTimer.current = setTimeout(() => {
      setFilterParams((prev) => ({ ...prev, emailSearch: value }));
      setCurrentPage(1);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
      if (emailSearchDebounceTimer.current) {
        clearTimeout(emailSearchDebounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (filters?.dropdown) {
      const initialDropdowns = filters?.dropdown?.reduce((acc, curr) => {
        acc[curr?.key] = null;
        return acc;
      }, {} as Record<string, any>);
      setFilterParams((prev) => ({ ...prev, ...initialDropdowns }));
    }
  }, [filters?.dropdown]);

  const loadData = async () => {
    try {
      setLoading(true);

      const params: any = {
        page: currentPage,
        pageSize,
      };

      // Map filter parameters to API parameters
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          if (key === "startDate" && value instanceof Date) {
            params.appointmentDateFrom = format(value, "yyyy-MM-dd");
          } else if (key === "endDate" && value instanceof Date) {
            params.appointmentDateTo = format(value, "yyyy-MM-dd");
          } else if (key === "search" && value) {
            params.search = value; // Search for location and occasion
          } else if (key === "emailSearch" && value) {
            params.memberEmail = value; // Map to memberEmail parameter
          } else if (filters?.dropdown?.some((d) => d.key === key)) {
            params[key] = value; // Dropdown filters like serviceType, adminStatus, gender
          } else if (
            key === "minBudget" ||
            key === "maxBudget" ||
            key === "pincode"
          ) {
            params[key] = Number(value); // Numeric parameters
          } else {
            params[key] = value; // Other parameters
          }
        }
      });

      // Clean up any undefined or null values
      Object.keys(params).forEach((key) => {
        if (
          params[key] === null ||
          params[key] === undefined ||
          params[key] === ""
        ) {
          delete params[key];
        }
      });

      const result = await fetchData(params);

      if (result?.status === "error") {
        customToast?.error(result?.message);
        setData([]);
        setTotalItems(0);
      } else {
        setData(result?.data?.data || []);
        setTotalItems(result?.data?.total || 0);
      }

      setError(null);
    } catch (err: any) {
      console.error("Error loading data:", err);
      customToast.error(err?.message || "Failed to load data");
      setError(err instanceof Error ? err.message : "Failed to load data");
      setData([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize, sortConfig, filterParams, fetchData, refreshApi]);

  const { renderCell } = useListTableRenderCell();

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleRowSelection = (row: T) => {
    setSelectedRows((prev) => {
      const isSelected = prev.includes(row);
      const newSelection = isSelected
        ? prev.filter((r) => r !== row)
        : [...prev, row];
      if (onSelectedRowsChange) {
        onSelectedRowsChange(newSelection);
      }
      return newSelection;
    });
  };

  const handleToggleRow = (rowId: string | number | any) => {
    setExpandedRows((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded?.has(rowId)) {
        newExpanded?.delete(rowId);
      } else {
        newExpanded?.add(rowId);
      }
      return newExpanded;
    });
  };

  const handleToggleAllRows = () => {
    if (expandedRows?.size === data?.length) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(data?.map((row) => row[rowKey])));
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] ${className}`}
      role="region"
      aria-label="Dynamic Table"
    >
      <ListTableFilteres
        displayFilters={displayFilters}
        filterParams={filterParams}
        filters={filters}
        searchDebounceTimer={searchDebounceTimer}
        emailSearchDebounceTimer={emailSearchDebounceTimer}
        columns={columns}
        data={data}
        selectable={selectable}
        selectedRows={selectedRows}
        exportable={exportable}
        handleEmailSearchChange={handleEmailSearchChange}
        handleSearchChange={handleSearchChange}
        setCurrentPage={setCurrentPage}
        setFilterParams={setFilterParams}
        setDisplayFilters={setDisplayFilters}
        setSelectedRows={setSelectedRows}
      />

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-full">
          <Table>
            <TableHeader
              className={`border-b border-gray-100 dark:border-white/[0.05] ${headerClassName}`}
            >
              <TableRow>
                {selectable && (
                  <TableCell isHeader className="w-10">
                    <Checkbox
                      checked={
                        selectedRows.length === data?.length && data?.length > 0
                      }
                      onCheckedChange={() => {
                        if (selectedRows.length === data?.length) {
                          setSelectedRows([]);
                          if (onSelectedRowsChange) onSelectedRowsChange([]);
                        } else {
                          setSelectedRows([...data]);
                          if (onSelectedRowsChange)
                            onSelectedRowsChange([...data]);
                        }
                      }}
                      aria-label="Select all rows"
                    />
                  </TableCell>
                )}
                {expandableRows && (
                  <TableCell isHeader className="w-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleAllRows}
                      aria-label={
                        expandedRows.size === data?.length
                          ? "Collapse all rows"
                          : "Expand all rows"
                      }
                    >
                      {expandedRows.size === data?.length ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                )}
                {columns?.map((column) => {
                  if (column?.omit) {
                    return null;
                  }

                  return (
                    <TableCell
                      key={column?.key as string}
                      isHeader
                      className={`px-5 py-3 font-medium text-gray-500 text-nowrap text-${
                        column?.align || "start"
                      } text-theme-md dark:text-gray-400 ${
                        column?.width ? `w-[${column?.width}]` : ""
                      }`}
                      aria-sort={
                        sortConfig.key === column?.key
                          ? sortConfig.order
                          : "none"
                      }
                    >
                      <div
                        className={`flex items-center${
                          column?.sortable
                            ? "cursor-pointer hover:text-gray-700 dark:hover:text-white"
                            : ""
                        } ${column?.headerClassName}`}
                        onClick={() =>
                          column?.sortable && handleSort(column.key)
                        }
                      >
                        {column?.header}
                        {sortConfig.key === column?.key &&
                          (sortConfig.order === "asc" ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                loadingState ||
                defaultLoadingState(
                  columns?.length +
                    (selectable ? 1 : 0) +
                    (expandableRows ? 1 : 0),
                  10
                )
              ) : error ? (
                <TableRow className="relative h-48">
                  <TableCell
                    className="text-center"
                    colSpan={
                      columns.length +
                      (selectable ? 1 : 0) +
                      (expandableRows ? 1 : 0)
                    }
                  >
                    <div className="flex flex-col items-center gap-2 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <p className="text-black dark:text-white">
                        No data available
                      </p>
                      <Button
                        variant="outline"
                        className="text-black dark:text-white"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                      >
                        Retry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.length === 0 ? (
                <TableRow className="relative h-100">
                  <TableCell
                    className="text-center"
                    colSpan={
                      columns.length +
                      (selectable ? 1 : 0) +
                      (expandableRows ? 1 : 0)
                    }
                  >
                    <div className="flex flex-col items-center gap-2 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <p className="text-black dark:text-white text-xl">
                        {emptyState}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((row) => (
                  <>
                    <TableRow
                      key={row[rowKey] as string}
                      className={`${rowClassName} ${
                        onRowClick
                          ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          : ""
                      }`}
                    >
                      {selectable && (
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(row)}
                            onCheckedChange={() => handleRowSelection(row)}
                            aria-label={`Select row ${row[rowKey]}`}
                          />
                        </TableCell>
                      )}
                      {expandableRows && (
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleToggleRow(row[rowKey])}
                            aria-label={
                              expandedRows.has(row[rowKey])
                                ? "Collapse row"
                                : "Expand row"
                            }
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedRows.has(row[rowKey])
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </Button>
                        </TableCell>
                      )}
                      {columns?.map((column) => (
                        <TableCell
                          key={column?.key as string}
                          className={`px-4 py-3 text-${
                            column?.align || "start"
                          } ${cellClassName}`}
                        >
                          {renderCell(row, column)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandableRows && expandedRows.has(row[rowKey]) && (
                      <TableRow>
                        <TableCell
                          colSpan={
                            columns.length +
                            (selectable ? 1 : 0) +
                            (expandableRows ? 1 : 0)
                          }
                        >
                          {expandableComponent && expandableComponent(row)}
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {!loading && !error && data?.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-white/50">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
              entries
            </div>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="dark:text-white cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white cursor-pointer">
                {pageSizeOptions.map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className={`ps-2 hover:bg-brand-300 hover:text-white cursor-pointer ${
                      pageSize.toString() === size.toFixed()
                        ? "bg-brand-500 text-white"
                        : ""
                    }`}
                  >
                    {size} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / pageSize)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
